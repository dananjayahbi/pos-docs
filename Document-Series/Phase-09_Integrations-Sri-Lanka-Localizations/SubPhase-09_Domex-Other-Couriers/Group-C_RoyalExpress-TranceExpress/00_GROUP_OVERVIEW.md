# Group C: Royal Express & Trance Express

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 09 - Domex & Other Couriers  
> **Group:** C of F  
> **Tasks Covered:** 43-60  
> **Group Goal:** Integrate Royal Express and Trance Express couriers

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_PromptX-Integration](../Group-B_PromptX-Integration/)
- **→ Next Group:** [Group-D_Courier-Comparison](../Group-D_Courier-Comparison/)

---

## Group Overview

This group integrates two additional couriers. Creates Royal Express constants, settings, and config model. Creates RoyalExpressClient HTTP client. Creates RoyalExpressProvider implementing ShippingProvider with create_shipment and track_shipment. Creates webhook handler and provider registration. Creates Trance Express constants, settings, and config model. Creates TranceExpressClient HTTP client. Creates TranceExpressProvider implementing ShippingProvider with create_shipment and track_shipment. Creates provider registration. Verifies both courier integrations.

### Key Outcomes

- RoyalExpress constants
- RoyalExpress settings
- RoyalExpress config
- RoyalExpressClient
- RoyalExpressProvider
- RoyalExpress shipment
- RoyalExpress tracking
- RoyalExpress webhook
- RoyalExpress registration
- TranceExpress constants
- TranceExpress settings
- TranceExpress config
- TranceExpressClient
- TranceExpressProvider
- TranceExpress shipment
- TranceExpress tracking
- TranceExpress registration
- Both integrations verified

### Technology Context

- **Royal Express:** Budget-friendly, island-wide
- **Trance Express:** Express delivery, major cities
- **Interface:** ShippingProvider ABC

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-43-51_RoyalExpress.md` | Create Royal Express integration | 43-51 |
| 02 | `02_Tasks-52-60_TranceExpress.md` | Create Trance Express integration | 52-60 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 43 | Create RoyalExpress Constants | Low | Task 42 |
| 44 | Create RoyalExpress Settings | Low | Task 43 |
| 45 | Create RoyalExpress Config | Medium | Task 44 |
| 46 | Create RoyalExpressClient | Medium | Task 45 |
| 47 | Create RoyalExpressProvider | High | Task 46 |
| 48 | Create RoyalExpress Shipment | Medium | Task 47 |
| 49 | Create RoyalExpress Tracking | Medium | Task 47 |
| 50 | Create RoyalExpress Webhook | Medium | Task 47 |
| 51 | Create RoyalExpress Reg | Low | Task 47 |
| 52 | Create TranceExpress Constants | Low | Task 42 |
| 53 | Create TranceExpress Settings | Low | Task 52 |
| 54 | Create TranceExpress Config | Medium | Task 53 |
| 55 | Create TranceExpressClient | Medium | Task 54 |
| 56 | Create TranceExpressProvider | High | Task 55 |
| 57 | Create TranceExpress Shipment | Medium | Task 56 |
| 58 | Create TranceExpress Tracking | Medium | Task 56 |
| 59 | Create TranceExpress Reg | Low | Task 56 |
| 60 | Verify Royal & Trance | Low | Task 59 |

---

## Execution Order

```
                    Task 42 (from Group B)
                            │
        ┌───────────────────┼───────────────────┐
        │                                       │
        ▼                                       ▼
Task 43: RoyalExpress Constants       Task 52: TranceExpress Constants
        │                                       │
        ▼                                       ▼
Task 44: RoyalExpress Settings        Task 53: TranceExpress Settings
        │                                       │
        ▼                                       ▼
Task 45: RoyalExpress Config          Task 54: TranceExpress Config
        │                                       │
        ▼                                       ▼
Task 46: RoyalExpressClient           Task 55: TranceExpressClient
        │                                       │
        ▼                                       ▼
Task 47: RoyalExpressProvider         Task 56: TranceExpressProvider
        │                                       │
        ├─────────┬─────────┐                   ├─────────┐
        ▼         ▼         ▼                   ▼         ▼
     T-48      T-49      T-50                T-57      T-58
   (Ship)   (Track)  (Webhook)             (Ship)   (Track)
        │         │         │                   │         │
        └─────────┴─────────┘                   └─────────┘
                    │                                 │
                    ▼                                 ▼
              Task 51: Reg                     Task 59: Reg
                    │                                 │
                    └─────────────────────────────────┘
                                    │
                                    ▼
                              Task 60: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── shipping/
        └── providers/
            ├── royal_express/
            │   ├── __init__.py
            │   ├── constants.py
            │   ├── config.py
            │   ├── client.py
            │   ├── provider.py
            │   └── webhooks.py
            └── trance_express/
                ├── __init__.py
                ├── constants.py
                ├── config.py
                ├── client.py
                └── provider.py
```

---

## Notes for AI Agents

### Royal Express Overview
| Feature | Value |
|---------|-------|
| Coverage | Island-wide |
| Speed | Standard (2-4 days) |
| Cost | Low (budget option) |
| COD | Supported |

### RoyalExpress Constants (Task 43)
| Constant | Value |
|----------|-------|
| API_URL | Royal Express API base |
| ENDPOINTS | API endpoint paths |

### RoyalExpress Settings (Task 44)
| File | settings/royal_express.py |
|------|---------------------------|
| Purpose | Royal Express settings |

### RoyalExpress Config (Task 45)
| Field | Type |
|-------|------|
| tenant | ForeignKey |
| api_key | CharField |
| is_active | BooleanField |

### RoyalExpressClient (Task 46)
| Attribute | Value |
|-----------|-------|
| base_url | From config |
| timeout | 30 seconds |

### RoyalExpressProvider (Task 47)
| Class | RoyalExpressProvider |
|-------|----------------------|
| Extends | ShippingProvider |
| Uses | RoyalExpressClient |

### RoyalExpress Shipment (Task 48)
| Method | create_shipment |
|--------|-----------------|
| Return | Waybill info |

### RoyalExpress Tracking (Task 49)
| Method | track_shipment |
|--------|----------------|
| Return | Tracking events |

### RoyalExpress Webhook (Task 50)
| URL | /api/webhooks/royal-express/ |
|-----|------------------------------|
| Method | POST |

### RoyalExpress Reg (Task 51)
| Factory | CourierFactory |
|---------|----------------|
| Key | "royal_express" |

---

### Trance Express Overview
| Feature | Value |
|---------|-------|
| Coverage | Major cities |
| Speed | Express (1-2 days) |
| Cost | High (premium option) |
| COD | Supported |

### TranceExpress Constants (Task 52)
| Constant | Value |
|----------|-------|
| API_URL | Trance Express API base |
| ENDPOINTS | API endpoint paths |

### TranceExpress Settings (Task 53)
| File | settings/trance_express.py |
|------|----------------------------|
| Purpose | Trance Express settings |

### TranceExpress Config (Task 54)
| Field | Type |
|-------|------|
| tenant | ForeignKey |
| api_key | CharField |
| is_active | BooleanField |

### TranceExpressClient (Task 55)
| Attribute | Value |
|-----------|-------|
| base_url | From config |
| timeout | 30 seconds |

### TranceExpressProvider (Task 56)
| Class | TranceExpressProvider |
|-------|------------------------|
| Extends | ShippingProvider |
| Uses | TranceExpressClient |

### TranceExpress Shipment (Task 57)
| Method | create_shipment |
|--------|-----------------|
| Return | Waybill info |

### TranceExpress Tracking (Task 58)
| Method | track_shipment |
|--------|----------------|
| Return | Tracking events |

### TranceExpress Reg (Task 59)
| Factory | CourierFactory |
|---------|----------------|
| Key | "trance_express" |
