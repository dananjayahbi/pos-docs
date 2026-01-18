# SubPhase 09: Domex & Other Couriers - Tasks Summary

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase Index:** 09 of 12  
> **SubPhase Goal:** Integrate additional Sri Lanka courier services using the unified ShippingProvider interface  
> **Total Tasks:** 88 | **Status:** Planning  
> **Estimated Duration:** 11-13 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-08_Koombiyo-Courier-API](../SubPhase-08_Koombiyo-Courier-API/)
- **→ Next SubPhase:** [SubPhase-10_Waybill-Generation](../SubPhase-10_Waybill-Generation/)

---

## SubPhase Overview

This sub-phase integrates additional Sri Lanka courier services (Domex, Prompt X, Royal Express, Trance Express) using the unified ShippingProvider interface established in SubPhase-08.

### Key Outcomes
- Domex courier integration
- Prompt X courier integration
- Royal Express integration
- Trance Express integration
- Unified courier comparison
- Fallback courier logic

### Couriers Covered
- **Domex** - Island-wide delivery
- **Prompt X** - Same-day delivery focus
- **Royal Express** - Budget-friendly option
- **Trance Express** - Express delivery

### Architecture
```
ShippingProvider (ABC)
├── KoombiyoProvider (from SubPhase-08)
├── DomexProvider
├── PromptXProvider
├── RoyalExpressProvider
└── TranceExpressProvider
```

### Technology Context
- **Backend:** Django 5.x, DRF
- **Interface:** ShippingProvider ABC
- **Factory:** CourierFactory for provider selection
- **Fallback:** Auto-switch on failure

---

## Task Execution Order

```
TASK GROUP A: Domex Integration (Tasks 01-22)
        │
        ▼
TASK GROUP B: Prompt X Integration (Tasks 23-42)
        │
        ▼
TASK GROUP C: Royal Express & Trance (Tasks 43-60)
        │
        ▼
TASK GROUP D: Courier Comparison (Tasks 61-72)
        │
        ▼
TASK GROUP E: Fallback & Reliability (Tasks 73-82)
        │
        ▼
TASK GROUP F: Frontend & Testing (Tasks 83-88)
```

---

## Task Index

### Group A: Domex Integration (Tasks 01-22)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create Domex Constants** | API URLs and endpoints | SubPhase-08 | 🔴 Not Created |
| 02 | **Create Domex Settings** | Django settings | Task 01 | 🔴 Not Created |
| 03 | **Create Domex API Key** | DOMEX_API_KEY | Task 02 | 🔴 Not Created |
| 04 | **Create Domex Config Model** | Tenant config | Task 02 | 🔴 Not Created |
| 05 | **Create DomexClient Class** | HTTP client | Task 04 | 🔴 Not Created |
| 06 | **Create Authentication** | API authentication | Task 05 | 🔴 Not Created |
| 07 | **Create Request Handler** | Generic requests | Task 06 | 🔴 Not Created |
| 08 | **Create Error Handling** | Handle errors | Task 07 | 🔴 Not Created |
| 09 | **Create DomexProvider Class** | Implement interface | Task 08 | 🔴 Not Created |
| 10 | **Create create_shipment** | Create Domex shipment | Task 09 | 🔴 Not Created |
| 11 | **Create get_rates** | Get Domex rates | Task 09 | 🔴 Not Created |
| 12 | **Create track_shipment** | Track Domex shipment | Task 09 | 🔴 Not Created |
| 13 | **Create cancel_shipment** | Cancel Domex shipment | Task 09 | 🔴 Not Created |
| 14 | **Create Waybill Generation** | Domex waybill | Task 10 | 🔴 Not Created |
| 15 | **Create Label Download** | Download Domex label | Task 14 | 🔴 Not Created |
| 16 | **Create Domex Webhook** | Webhook handler | Task 09 | 🔴 Not Created |
| 17 | **Create Status Mapping** | Map Domex statuses | Task 16 | 🔴 Not Created |
| 18 | **Create COD Support** | Domex COD | Task 09 | 🔴 Not Created |
| 19 | **Create Pickup Scheduling** | Schedule pickup | Task 09 | 🔴 Not Created |
| 20 | **Create Provider Registration** | Register provider | Task 09 | 🔴 Not Created |
| 21 | **Create Domex Admin** | Admin for config | Task 04 | 🔴 Not Created |
| 22 | **Verify Domex Integration** | Test Domex flow | Task 21 | 🔴 Not Created |

---

### Group B: Prompt X Integration (Tasks 23-42)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 23 | **Create PromptX Constants** | API URLs and endpoints | Task 22 | 🔴 Not Created |
| 24 | **Create PromptX Settings** | Django settings | Task 23 | 🔴 Not Created |
| 25 | **Create PromptX API Key** | PROMPTX_API_KEY | Task 24 | 🔴 Not Created |
| 26 | **Create PromptX Config Model** | Tenant config | Task 24 | 🔴 Not Created |
| 27 | **Create PromptXClient Class** | HTTP client | Task 26 | 🔴 Not Created |
| 28 | **Create PromptX Auth** | API authentication | Task 27 | 🔴 Not Created |
| 29 | **Create PromptX Requests** | Generic requests | Task 28 | 🔴 Not Created |
| 30 | **Create PromptX Errors** | Error handling | Task 29 | 🔴 Not Created |
| 31 | **Create PromptXProvider** | Implement interface | Task 30 | 🔴 Not Created |
| 32 | **Create PromptX Shipment** | Create shipment | Task 31 | 🔴 Not Created |
| 33 | **Create PromptX Rates** | Get rates | Task 31 | 🔴 Not Created |
| 34 | **Create PromptX Tracking** | Track shipment | Task 31 | 🔴 Not Created |
| 35 | **Create PromptX Cancel** | Cancel shipment | Task 31 | 🔴 Not Created |
| 36 | **Create PromptX Waybill** | Waybill generation | Task 32 | 🔴 Not Created |
| 37 | **Create PromptX Label** | Label download | Task 36 | 🔴 Not Created |
| 38 | **Create PromptX Webhook** | Webhook handler | Task 31 | 🔴 Not Created |
| 39 | **Create PromptX Status Map** | Status mapping | Task 38 | 🔴 Not Created |
| 40 | **Create PromptX Registration** | Register provider | Task 31 | 🔴 Not Created |
| 41 | **Create PromptX Admin** | Admin for config | Task 26 | 🔴 Not Created |
| 42 | **Verify PromptX Integration** | Test PromptX flow | Task 41 | 🔴 Not Created |

---

### Group C: Royal Express & Trance (Tasks 43-60)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 43 | **Create RoyalExpress Constants** | API URLs | Task 42 | 🔴 Not Created |
| 44 | **Create RoyalExpress Settings** | Django settings | Task 43 | 🔴 Not Created |
| 45 | **Create RoyalExpress Config** | Tenant config | Task 44 | 🔴 Not Created |
| 46 | **Create RoyalExpressClient** | HTTP client | Task 45 | 🔴 Not Created |
| 47 | **Create RoyalExpressProvider** | Implement interface | Task 46 | 🔴 Not Created |
| 48 | **Create RoyalExpress Shipment** | Create shipment | Task 47 | 🔴 Not Created |
| 49 | **Create RoyalExpress Tracking** | Track shipment | Task 47 | 🔴 Not Created |
| 50 | **Create RoyalExpress Webhook** | Webhook handler | Task 47 | 🔴 Not Created |
| 51 | **Create RoyalExpress Reg** | Register provider | Task 47 | 🔴 Not Created |
| 52 | **Create TranceExpress Constants** | API URLs | Task 42 | 🔴 Not Created |
| 53 | **Create TranceExpress Settings** | Django settings | Task 52 | 🔴 Not Created |
| 54 | **Create TranceExpress Config** | Tenant config | Task 53 | 🔴 Not Created |
| 55 | **Create TranceExpressClient** | HTTP client | Task 54 | 🔴 Not Created |
| 56 | **Create TranceExpressProvider** | Implement interface | Task 55 | 🔴 Not Created |
| 57 | **Create TranceExpress Shipment** | Create shipment | Task 56 | 🔴 Not Created |
| 58 | **Create TranceExpress Tracking** | Track shipment | Task 56 | 🔴 Not Created |
| 59 | **Create TranceExpress Reg** | Register provider | Task 56 | 🔴 Not Created |
| 60 | **Verify Royal & Trance** | Test both couriers | Task 59 | 🔴 Not Created |

---

### Group D: Courier Comparison (Tasks 61-72)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 61 | **Create CourierFactory** | Factory for providers | Task 60 | 🔴 Not Created |
| 62 | **Create get_provider Method** | Get by courier type | Task 61 | 🔴 Not Created |
| 63 | **Create get_all_providers** | Get all active providers | Task 61 | 🔴 Not Created |
| 64 | **Create RateComparisonService** | Compare courier rates | Task 63 | 🔴 Not Created |
| 65 | **Create get_all_rates** | Get rates from all | Task 64 | 🔴 Not Created |
| 66 | **Create sort_by_price** | Sort rates by price | Task 65 | 🔴 Not Created |
| 67 | **Create sort_by_speed** | Sort by delivery time | Task 65 | 🔴 Not Created |
| 68 | **Create Cheapest Option** | Get cheapest rate | Task 66 | 🔴 Not Created |
| 69 | **Create Fastest Option** | Get fastest rate | Task 67 | 🔴 Not Created |
| 70 | **Create Rate Comparison API** | GET /api/shipping/compare/ | Task 69 | 🔴 Not Created |
| 71 | **Create Preferred Courier** | Tenant default courier | Task 61 | 🔴 Not Created |
| 72 | **Verify Comparison** | Test comparison | Task 71 | 🔴 Not Created |

---

### Group E: Fallback & Reliability (Tasks 73-82)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 73 | **Create Courier Priority** | Fallback priority order | Task 72 | 🔴 Not Created |
| 74 | **Create Health Check** | Courier API health | Task 73 | 🔴 Not Created |
| 75 | **Create Availability Check** | Zone availability | Task 74 | 🔴 Not Created |
| 76 | **Create Auto Fallback** | Switch on failure | Task 75 | 🔴 Not Created |
| 77 | **Create Fallback Logging** | Log fallback events | Task 76 | 🔴 Not Created |
| 78 | **Create Retry with Fallback** | Retry then fallback | Task 76 | 🔴 Not Created |
| 79 | **Create Courier Status Model** | Track courier status | Task 74 | 🔴 Not Created |
| 80 | **Create Status Dashboard** | Admin courier status | Task 79 | 🔴 Not Created |
| 81 | **Create Alert on Failure** | Notify on failures | Task 79 | 🔴 Not Created |
| 82 | **Verify Fallback Logic** | Test fallback flow | Task 81 | 🔴 Not Created |

---

### Group F: Frontend & Testing (Tasks 83-88)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 83 | **Create Courier Types** | TypeScript interfaces | Task 82 | 🔴 Not Created |
| 84 | **Create Courier API Client** | Frontend API client | Task 83 | 🔴 Not Created |
| 85 | **Create Courier Selection UI** | Select courier dropdown | Task 84 | 🔴 Not Created |
| 86 | **Create Rate Comparison UI** | Compare rates display | Task 84 | 🔴 Not Created |
| 87 | **Create Integration Tests** | Test all couriers | Task 82 | 🔴 Not Created |
| 88 | **Create Documentation** | Multi-courier docs | Task 87 | 🔴 Not Created |

---

## Expected Final Structure

```
backend/
└── apps/
    └── shipping/
        ├── providers/
        │   ├── __init__.py
        │   ├── base.py                       # ShippingProvider ABC
        │   ├── factory.py                    # CourierFactory (Task 61)
        │   ├── koombiyo/                     # From SubPhase-08
        │   ├── domex/
        │   │   ├── __init__.py
        │   │   ├── client.py                 # DomexClient (Task 05)
        │   │   ├── provider.py               # DomexProvider (Task 09)
        │   │   ├── config.py                 # Configuration (Task 02)
        │   │   └── webhooks.py               # Webhook handler (Task 16)
        │   ├── promptx/
        │   │   ├── __init__.py
        │   │   ├── client.py                 # PromptXClient (Task 27)
        │   │   ├── provider.py               # PromptXProvider (Task 31)
        │   │   └── config.py                 # Configuration (Task 24)
        │   ├── royal_express/
        │   │   ├── __init__.py
        │   │   ├── client.py                 # RoyalExpressClient (Task 46)
        │   │   └── provider.py               # RoyalExpressProvider (Task 47)
        │   └── trance_express/
        │       ├── __init__.py
        │       ├── client.py                 # TranceExpressClient (Task 55)
        │       └── provider.py               # TranceExpressProvider (Task 56)
        ├── services/
        │   ├── rate_comparison.py            # RateComparisonService (Task 64)
        │   └── fallback.py                   # Fallback logic (Task 76)
        ├── models/
        │   └── courier_status.py             # CourierStatus (Task 79)
        └── api/
            └── comparison_views.py           # Comparison API (Task 70)

frontend/
└── lib/
    └── shipping/
        └── courier/
            ├── types.ts                      # Types (Task 83)
            └── client.ts                     # API client (Task 84)
└── components/
    └── checkout/
        ├── CourierSelection.tsx              # Selection (Task 85)
        └── RateComparison.tsx                # Comparison (Task 86)
```

---

## Progress Tracking

| Group | Name | Tasks | Completed | Progress |
|-------|------|-------|-----------|----------|
| A | Domex Integration | 22 | 0 | 0% |
| B | Prompt X Integration | 20 | 0 | 0% |
| C | Royal Express & Trance | 18 | 0 | 0% |
| D | Courier Comparison | 12 | 0 | 0% |
| E | Fallback & Reliability | 10 | 0 | 0% |
| F | Frontend & Testing | 6 | 0 | 0% |
| **Total** | | **88** | **0** | **0%** |

---

## Couriers Comparison

| Courier | Speed | Cost | COD | Coverage |
|---------|-------|------|-----|----------|
| Koombiyo | Fast | Medium | Yes | Island-wide |
| Domex | Medium | Low | Yes | Island-wide |
| Prompt X | Same-day | High | Yes | Colombo Metro |
| Royal Express | Standard | Low | Yes | Island-wide |
| Trance Express | Express | High | Yes | Major cities |

---

## Notes for AI Agents

1. **Execute tasks in order** - Follow Group A → F sequence
2. **Reuse interface** - All use ShippingProvider ABC
3. **Factory pattern** - Use CourierFactory for selection
4. **Rate comparison** - Get rates from all couriers
5. **Fallback logic** - Auto-switch on failure
6. **Health checks** - Monitor courier API status
7. **Preferred courier** - Allow tenant default
8. **Zone coverage** - Check courier availability
9. **Unified webhooks** - Normalize all webhook events
