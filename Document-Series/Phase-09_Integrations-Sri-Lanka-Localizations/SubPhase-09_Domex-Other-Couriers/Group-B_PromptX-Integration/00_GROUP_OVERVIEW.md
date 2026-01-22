# Group B: Prompt X Integration

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 09 - Domex & Other Couriers  
> **Group:** B of F  
> **Tasks Covered:** 23-42  
> **Group Goal:** Integrate Prompt X courier for same-day delivery in Colombo Metro

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Domex-Integration](../Group-A_Domex-Integration/)
- **→ Next Group:** [Group-C_RoyalExpress-TranceExpress](../Group-C_RoyalExpress-TranceExpress/)

---

## Group Overview

This group integrates Prompt X courier. Creates PromptX constants for API URLs and endpoints. Creates Django settings with API key environment variable. Creates PromptXConfig model for tenant credentials. Creates PromptXClient class with authentication and request methods. Creates error handling. Creates PromptXProvider implementing ShippingProvider interface with create_shipment, get_rates, track_shipment, and cancel_shipment. Creates waybill generation and label download. Creates webhook handler with status mapping. Creates admin and provider registration. Verifies Prompt X integration.

### Key Outcomes

- PromptX constants
- PromptX settings
- PromptX API key
- PromptXConfig model
- PromptXClient class
- PromptX authentication
- PromptX requests
- PromptX errors
- PromptXProvider class
- PromptX shipment
- PromptX rates
- PromptX tracking
- PromptX cancel
- PromptX waybill
- PromptX label
- PromptX webhook
- PromptX status map
- Provider registration
- PromptX admin
- Integration verified

### Technology Context

- **Interface:** ShippingProvider ABC
- **Coverage:** Colombo Metro (same-day)
- **Speed:** Same-day delivery
- **Cost:** Higher pricing

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-23-30_Configuration-Client.md` | Create config and client | 23-30 |
| 02 | `02_Tasks-31-42_Provider-Webhook-Verify.md` | Create provider and verify | 31-42 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 23 | Create PromptX Constants | Low | Task 22 |
| 24 | Create PromptX Settings | Low | Task 23 |
| 25 | Create PromptX API Key | Low | Task 24 |
| 26 | Create PromptXConfig Model | Medium | Task 24 |
| 27 | Create PromptXClient Class | Medium | Task 26 |
| 28 | Create PromptX Auth | Low | Task 27 |
| 29 | Create PromptX Requests | Medium | Task 28 |
| 30 | Create PromptX Errors | Medium | Task 29 |
| 31 | Create PromptXProvider | High | Task 30 |
| 32 | Create PromptX Shipment | Medium | Task 31 |
| 33 | Create PromptX Rates | Medium | Task 31 |
| 34 | Create PromptX Tracking | Medium | Task 31 |
| 35 | Create PromptX Cancel | Low | Task 31 |
| 36 | Create PromptX Waybill | Medium | Task 32 |
| 37 | Create PromptX Label | Low | Task 36 |
| 38 | Create PromptX Webhook | Medium | Task 31 |
| 39 | Create PromptX Status Map | Low | Task 38 |
| 40 | Create PromptX Registration | Low | Task 31 |
| 41 | Create PromptX Admin | Medium | Task 26 |
| 42 | Verify PromptX Integration | Low | Task 41 |

---

## Execution Order

```
Task 23: PromptX Constants
    │
    ▼
Task 24: PromptX Settings
    │
    ├─────────┐
    ▼         ▼
T-25       T-26
(Key)    (Config)
    │         │
    │         ▼
    │      Task 27: PromptXClient
    │         │
    │         ▼
    │      Task 28: Auth
    │         │
    │         ▼
    │      Task 29: Requests
    │         │
    │         ▼
    │      Task 30: Errors
    │         │
    │         ▼
    │      Task 31: PromptXProvider
    │         │
    ├─────────┼─────────┬─────────┬─────────┬─────────┐
    │         ▼         ▼         ▼         ▼         ▼
    │      T-32      T-33      T-34      T-35      T-38
    │    (Ship)   (Rates)  (Track)(Cancel)(Webhook)
    │         │                             │
    │         ▼                             ▼
    │      T-36                          T-39
    │    (Waybill)                    (StatusMap)
    │         │
    │         ▼
    │      T-37
    │     (Label)
    │         │
    └─────────┼─────────────────────────────────────────┐
              │                                         │
              │         T-40        T-41               │
              │        (Reg)      (Admin)              │
              │          │          │                  │
              └──────────┴──────────┴──────────────────┘
                                   │
                                   ▼
                             Task 42: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── shipping/
        └── providers/
            └── promptx/
                ├── __init__.py
                ├── constants.py
                ├── config.py
                ├── client.py
                ├── provider.py
                └── webhooks.py
```

---

## Notes for AI Agents

### PromptX Constants (Task 23)
| Constant | Value |
|----------|-------|
| API_URL | PromptX API base |
| ENDPOINTS | API endpoint paths |

### PromptX Settings (Task 24)
| File | settings/promptx.py |
|------|---------------------|
| Purpose | PromptX-specific settings |

### PromptX API Key (Task 25)
| Setting | PROMPTX_API_KEY |
|---------|-----------------|
| Env var | PROMPTX_API_KEY |

### PromptXConfig Model (Task 26)
| Field | Type |
|-------|------|
| tenant | ForeignKey |
| api_key | CharField |
| is_active | BooleanField |

### PromptXClient Class (Task 27)
| Attribute | Value |
|-----------|-------|
| base_url | From config |
| timeout | 30 seconds |

### PromptX Auth (Task 28)
| Type | Bearer token |
|------|--------------|
| Header | Authorization |

### PromptX Requests (Task 29)
| Method | request(method, endpoint, data) |
|--------|--------------------------------|
| Return | Parsed JSON response |

### PromptX Errors (Task 30)
| Exception | PromptXError |
|-----------|--------------|
| Use | Generic API error |

### PromptXProvider (Task 31)
| Class | PromptXProvider |
|-------|-----------------|
| Extends | ShippingProvider |
| Uses | PromptXClient |

### Same-Day Delivery Feature
| Coverage | Colombo Metro |
|----------|---------------|
| Cutoff | 2:00 PM for same-day |
| Zones | Colombo 01-15, suburbs |

### PromptX Waybill (Task 36)
| Action | Generate waybill |
|--------|-----------------|
| Return | Waybill number |

### PromptX Webhook (Task 38)
| URL | /api/webhooks/promptx/ |
|-----|------------------------|
| Method | POST |

### PromptX Status Map (Task 39)
| PromptX Status | Internal Status |
|----------------|-----------------|
| PICKED | PICKED_UP |
| INTRANSIT | IN_TRANSIT |
| DELIVERED | DELIVERED |
| RETURNED | RETURNED |

### Provider Registration (Task 40)
| Factory | CourierFactory |
|---------|----------------|
| Key | "promptx" |
