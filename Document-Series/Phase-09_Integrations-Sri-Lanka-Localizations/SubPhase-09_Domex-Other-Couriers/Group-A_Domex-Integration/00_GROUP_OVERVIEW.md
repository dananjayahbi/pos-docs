# Group A: Domex Integration

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 09 - Domex & Other Couriers  
> **Group:** A of F  
> **Tasks Covered:** 01-22  
> **Group Goal:** Integrate Domex courier using the ShippingProvider interface

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_PromptX-Integration](../Group-B_PromptX-Integration/)

---

## Group Overview

This group integrates Domex courier. Creates Domex constants for API URLs and endpoints (sandbox/production). Creates Django settings with API key environment variable. Creates DomexConfig model for tenant-specific credentials. Creates DomexClient class as HTTP wrapper with authentication and request handler. Creates error handling. Creates DomexProvider implementing ShippingProvider interface with create_shipment, get_rates, track_shipment, and cancel_shipment methods. Creates waybill generation and label download. Creates webhook handler with status mapping. Creates COD support and pickup scheduling. Creates admin and provider registration. Verifies Domex integration.

### Key Outcomes

- Domex constants
- Domex settings
- Domex API key
- DomexConfig model
- DomexClient class
- Authentication
- Request handler
- Error handling
- DomexProvider class
- create_shipment method
- get_rates method
- track_shipment method
- cancel_shipment method
- Waybill generation
- Label download
- Domex webhook
- Status mapping
- COD support
- Pickup scheduling
- Provider registration
- Domex admin
- Integration verified

### Technology Context

- **Interface:** ShippingProvider ABC
- **Coverage:** Island-wide delivery
- **Cost:** Low-medium pricing
- **COD:** Supported

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-08_Configuration-Client.md` | Create config and client | 01-08 |
| 02 | `02_Tasks-09-15_Provider-Waybill.md` | Create provider and waybill | 09-15 |
| 03 | `03_Tasks-16-22_Webhook-Admin-Verify.md` | Create webhook and admin | 16-22 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create Domex Constants | Low | SubPhase-08 |
| 02 | Create Domex Settings | Low | Task 01 |
| 03 | Create Domex API Key | Low | Task 02 |
| 04 | Create DomexConfig Model | Medium | Task 02 |
| 05 | Create DomexClient Class | Medium | Task 04 |
| 06 | Create Authentication | Low | Task 05 |
| 07 | Create Request Handler | Medium | Task 06 |
| 08 | Create Error Handling | Medium | Task 07 |
| 09 | Create DomexProvider Class | High | Task 08 |
| 10 | Create create_shipment | Medium | Task 09 |
| 11 | Create get_rates | Medium | Task 09 |
| 12 | Create track_shipment | Medium | Task 09 |
| 13 | Create cancel_shipment | Low | Task 09 |
| 14 | Create Waybill Generation | Medium | Task 10 |
| 15 | Create Label Download | Low | Task 14 |
| 16 | Create Domex Webhook | Medium | Task 09 |
| 17 | Create Status Mapping | Low | Task 16 |
| 18 | Create COD Support | Medium | Task 09 |
| 19 | Create Pickup Scheduling | Medium | Task 09 |
| 20 | Create Provider Registration | Low | Task 09 |
| 21 | Create Domex Admin | Medium | Task 04 |
| 22 | Verify Domex Integration | Low | Task 21 |

---

## Execution Order

```
Task 01: Domex Constants
    │
    ▼
Task 02: Domex Settings
    │
    ├─────────┐
    ▼         ▼
T-03       T-04
(Key)    (Config)
    │         │
    │         ▼
    │      Task 05: DomexClient
    │         │
    │         ▼
    │      Task 06: Auth
    │         │
    │         ▼
    │      Task 07: Request
    │         │
    │         ▼
    │      Task 08: Error
    │         │
    │         ▼
    │      Task 09: DomexProvider
    │         │
    ├─────────┼─────────┬─────────┬─────────┬─────────┬─────────┐
    │         ▼         ▼         ▼         ▼         ▼         ▼
    │      T-10      T-11      T-12      T-13      T-16      T-18
    │    (Create)  (Rates) (Track) (Cancel)(Webhook) (COD)
    │         │                             │
    │         ▼                             ▼
    │      T-14                          T-17
    │    (Waybill)                    (StatusMap)
    │         │
    │         ▼
    │      T-15
    │     (Label)
    │         │
    └─────────┼─────────────────────────────────────────────────┐
              │                                                 │
              │         T-19        T-20        T-21           │
              │       (Pickup)    (Reg)      (Admin)           │
              │         │          │          │                │
              └─────────┴──────────┴──────────┴────────────────┘
                                   │
                                   ▼
                             Task 22: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── shipping/
        └── providers/
            └── domex/
                ├── __init__.py
                ├── constants.py
                ├── config.py
                ├── client.py
                ├── provider.py
                └── webhooks.py
```

---

## Notes for AI Agents

### Domex Constants (Task 01)
| Constant | Value |
|----------|-------|
| SANDBOX_URL | Domex test API |
| PRODUCTION_URL | Domex live API |

### Domex Settings (Task 02)
| File | settings/domex.py |
|------|-------------------|
| Purpose | Domex-specific settings |

### Domex API Key (Task 03)
| Setting | DOMEX_API_KEY |
|---------|---------------|
| Env var | DOMEX_API_KEY |

### DomexConfig Model (Task 04)
| Field | Type |
|-------|------|
| tenant | ForeignKey |
| api_key | CharField |
| is_active | BooleanField |

### DomexClient Class (Task 05)
| Attribute | Value |
|-----------|-------|
| base_url | From config |
| timeout | 30 seconds |

### Authentication (Task 06)
| Type | API key header |
|------|----------------|
| Header | X-API-Key |

### Request Handler (Task 07)
| Method | request(method, endpoint, data) |
|--------|--------------------------------|
| Return | Parsed JSON response |

### Error Handling (Task 08)
| Error | Action |
|-------|--------|
| 400 | Raise validation error |
| 401 | Raise auth error |
| 500 | Retry or raise |

### DomexProvider Class (Task 09)
| Class | DomexProvider |
|-------|---------------|
| Extends | ShippingProvider |
| Uses | DomexClient |

### Waybill Generation (Task 14)
| Action | Generate Domex waybill |
|--------|------------------------|
| Return | Waybill number, barcode |

### Label Download (Task 15)
| Action | Download PDF label |
|--------|-------------------|
| Store | S3 or local |

### Domex Webhook (Task 16)
| URL | /api/webhooks/domex/ |
|-----|---------------------|
| Method | POST |

### Status Mapping (Task 17)
| Map | Domex status → internal |
|-----|-------------------------|
| Normalize | Standard status codes |

### COD Support (Task 18)
| Feature | Cash on Delivery |
|---------|------------------|
| Add | COD amount to shipment |

### Pickup Scheduling (Task 19)
| Action | Schedule Domex pickup |
|--------|----------------------|
| API | POST /pickup |

### Provider Registration (Task 20)
| Factory | CourierFactory |
|---------|----------------|
| Key | "domex" |
