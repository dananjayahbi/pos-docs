# Group B: API Client & Auth

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 11 - WhatsApp Business API  
> **Group:** B of F  
> **Tasks Covered:** 17-32  
> **Group Goal:** Implement WhatsApp API client with authentication and messaging methods

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_WhatsApp-Configuration](../Group-A_WhatsApp-Configuration/)
- **→ Next Group:** [Group-C_Template-Messages](../Group-C_Template-Messages/)

---

## Group Overview

This group implements the API client. Creates WhatsAppClient class with bearer token authentication. Creates generic request handler with error handling, rate limiter, and retry logic (exponential backoff). Creates send_message core method. Creates specialized methods: send_template, send_text, send_image, send_document, and send_interactive for buttons and lists. Creates phone validation for Sri Lanka +94 format and phone formatting for WhatsApp. Creates message logging. Verifies API client connection.

### Key Outcomes

- WhatsAppClient class
- Authentication (Bearer token)
- Request handler
- Error handling
- Rate limiter
- Retry logic
- send_message method
- send_template method
- send_text method
- send_image method
- send_document method
- send_interactive method
- Phone validation
- Phone formatting
- Message logging
- API client verified

### Technology Context

- **HTTP:** httpx for async
- **Auth:** Bearer access token
- **Rate limit:** Tier-based limits
- **Retry:** Exponential backoff

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-17-25_Client-Send-Methods.md` | Create client and send methods | 17-25 |
| 02 | `02_Tasks-26-32_Media-Phone-Verify.md` | Create media and phone handling | 26-32 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 17 | Create WhatsAppClient Class | High | Task 16 |
| 18 | Create Authentication | Low | Task 17 |
| 19 | Create Request Handler | Medium | Task 18 |
| 20 | Create Error Handling | Medium | Task 19 |
| 21 | Create Rate Limiter | Medium | Task 20 |
| 22 | Create Retry Logic | Medium | Task 21 |
| 23 | Create send_message Method | Medium | Task 22 |
| 24 | Create send_template Method | Medium | Task 23 |
| 25 | Create send_text Method | Low | Task 23 |
| 26 | Create send_image Method | Low | Task 23 |
| 27 | Create send_document Method | Low | Task 23 |
| 28 | Create send_interactive Method | Medium | Task 23 |
| 29 | Create Phone Validation | Low | Task 17 |
| 30 | Create Phone Formatting | Low | Task 29 |
| 31 | Create Message Logging | Medium | Task 23 |
| 32 | Verify API Client | Low | Task 31 |

---

## Execution Order

```
Task 17: WhatsAppClient Class
    │
    ├─────────────────────────────────┐
    ▼                                 ▼
Task 18: Authentication          Task 29: Phone Validation
    │                                 │
    ▼                                 ▼
Task 19: Request Handler         Task 30: Phone Formatting
    │                                 │
    ▼                                 │
Task 20: Error Handling               │
    │                                 │
    ▼                                 │
Task 21: Rate Limiter                 │
    │                                 │
    ▼                                 │
Task 22: Retry Logic                  │
    │                                 │
    ▼                                 │
Task 23: send_message                 │
    │                                 │
    ├─────────┬─────────┬─────────┬───┼───────┐
    ▼         ▼         ▼         ▼   │       ▼
T-24       T-25       T-26       T-27 │     T-28
(Templ)   (Text)    (Img)     (Doc)   │   (Inter)
    │         │         │         │   │       │
    └─────────┴─────────┴─────────┴───┼───────┘
                                      │
                                      ▼
                               Task 31: Message Logging
                                      │
                                      ▼
                               Task 32: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── notifications/
        └── clients/
            └── whatsapp_client.py
```

---

## Notes for AI Agents

### WhatsAppClient Class (Task 17)
| Class | WhatsAppClient |
|-------|----------------|
| Purpose | WhatsApp Cloud API client |
| Base URL | graph.facebook.com/v18.0 |

### Authentication (Task 18)
| Type | Bearer token |
|------|--------------|
| Header | Authorization: Bearer {token} |

### Request Handler (Task 19)
| Method | request(method, endpoint, data) |
|--------|--------------------------------|
| Return | JSON response |

### Error Handling (Task 20)
| Error Code | Action |
|------------|--------|
| 100 | Invalid parameter |
| 130 | Rate limit exceeded |
| 131 | Phone number error |
| 190 | Token expired |

### Rate Limiter (Task 21)
| Tier | Messages/sec |
|------|--------------|
| Unverified | 250/day |
| Tier 1 | 1K/day |
| Tier 2 | 10K/day |
| Tier 3 | 100K/day |

### Retry Logic (Task 22)
| Setting | Value |
|---------|-------|
| Max retries | 3 |
| Backoff | Exponential |
| Retry on | 429, 5xx |

### send_message Method (Task 23)
| Method | send_message(to, message) |
|--------|---------------------------|
| Return | Message ID |
| Core | All sends use this |

### send_template Method (Task 24)
| Method | send_template(to, template_name, params) |
|--------|------------------------------------------|
| Use | Pre-approved templates |
| Required | For first message |

### send_text Method (Task 25)
| Method | send_text(to, text) |
|--------|---------------------|
| Use | Free-form text |
| Limit | Within 24h session |

### send_image Method (Task 26)
| Method | send_image(to, image_url, caption) |
|--------|-----------------------------------|
| Format | JPEG, PNG |
| Max size | 5MB |

### send_document Method (Task 27)
| Method | send_document(to, doc_url, filename) |
|--------|--------------------------------------|
| Format | PDF, DOC, XLS |
| Max size | 100MB |

### send_interactive Method (Task 28)
| Method | send_interactive(to, type, content) |
|--------|-------------------------------------|
| Types | button, list |
| Use | User actions |

### Phone Validation (Task 29)
| Format | +94XXXXXXXXX |
|--------|--------------|
| Pattern | Starts with +94 or 0 |
| Length | 10 digits after prefix |

### Phone Formatting (Task 30)
| Input | +94771234567 or 0771234567 |
|-------|----------------------------|
| Output | 94771234567 |
| WhatsApp | No + prefix |

### Message Logging (Task 31)
| Log | All messages |
|-----|--------------|
| Fields | to, type, content, response |
| Level | INFO |
