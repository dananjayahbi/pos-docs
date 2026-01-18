# SubPhase 08: Koombiyo Courier API - Tasks Summary

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase Index:** 08 of 12  
> **SubPhase Goal:** Integrate Koombiyo courier API for waybill generation, tracking, and COD collection  
> **Total Tasks:** 94 | **Status:** Planning  
> **Estimated Duration:** 12-14 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-07_Shipping-Zone-Configuration](../SubPhase-07_Shipping-Zone-Configuration/)
- **→ Next SubPhase:** [SubPhase-09_Domex-Other-Couriers](../SubPhase-09_Domex-Other-Couriers/)

---

## SubPhase Overview

This sub-phase integrates Koombiyo, Sri Lanka's leading courier service, for automated waybill generation, shipment tracking, and COD collection.

### Key Outcomes
- Koombiyo API client implementation
- Waybill generation and printing
- Pickup scheduling
- Real-time tracking status
- COD collection reports
- Webhook event handling

### Koombiyo API Features
- Waybill generation
- Pickup scheduling
- Tracking status
- COD collection
- POD (Proof of Delivery)

### Koombiyo Flow
```
Order Confirmed → Generate Waybill → Schedule Pickup →
In Transit → Out for Delivery → Delivered/Failed →
COD Collected (if applicable)
```

### Technology Context
- **Backend:** Django 5.x, DRF
- **API:** Koombiyo REST API
- **Webhooks:** Real-time tracking updates
- **PDFs:** Waybill label generation

---

## Task Execution Order

```
TASK GROUP A: Koombiyo Configuration (Tasks 01-16)
        │
        ▼
TASK GROUP B: API Client Implementation (Tasks 17-34)
        │
        ▼
TASK GROUP C: Waybill Generation (Tasks 35-50)
        │
        ▼
TASK GROUP D: Tracking & Webhooks (Tasks 51-66)
        │
        ▼
TASK GROUP E: Pickup & COD (Tasks 67-80)
        │
        ▼
TASK GROUP F: Admin & Testing (Tasks 81-94)
```

---

## Task Index

### Group A: Koombiyo Configuration (Tasks 01-16)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create Koombiyo Constants** | API URLs and endpoints | SubPhase-07 | 🔴 Not Created |
| 02 | **Create Sandbox URL** | Test environment URL | Task 01 | 🔴 Not Created |
| 03 | **Create Production URL** | Live environment URL | Task 01 | 🔴 Not Created |
| 04 | **Create Koombiyo Settings** | Django settings module | Task 01 | 🔴 Not Created |
| 05 | **Create API Key Setting** | KOOMBIYO_API_KEY | Task 04 | 🔴 Not Created |
| 06 | **Create Merchant ID Setting** | KOOMBIYO_MERCHANT_ID | Task 04 | 🔴 Not Created |
| 07 | **Create Sandbox Toggle** | KOOMBIYO_SANDBOX | Task 04 | 🔴 Not Created |
| 08 | **Create Webhook Secret** | Webhook signature secret | Task 04 | 🔴 Not Created |
| 09 | **Create KoombiyoConfig Model** | Tenant courier config | Task 04 | 🔴 Not Created |
| 10 | **Create Pickup Address** | Default pickup address | Task 09 | 🔴 Not Created |
| 11 | **Create Contact Details** | Pickup contact info | Task 09 | 🔴 Not Created |
| 12 | **Create Default Weight** | Default package weight | Task 09 | 🔴 Not Created |
| 13 | **Create COD Enabled** | COD through Koombiyo | Task 09 | 🔴 Not Created |
| 14 | **Create Config Validation** | Validate credentials | Task 09 | 🔴 Not Created |
| 15 | **Create Config Admin** | Django admin for config | Task 09 | 🔴 Not Created |
| 16 | **Verify Configuration** | Test config loading | Task 15 | 🔴 Not Created |

---

### Group B: API Client Implementation (Tasks 17-34)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 17 | **Create KoombiyoClient Class** | HTTP client wrapper | Task 16 | 🔴 Not Created |
| 18 | **Create Authentication Header** | API key authentication | Task 17 | 🔴 Not Created |
| 19 | **Create Request Method** | Generic request method | Task 18 | 🔴 Not Created |
| 20 | **Create Error Handling** | Handle API errors | Task 19 | 🔴 Not Created |
| 21 | **Create Retry Logic** | Retry on failure | Task 20 | 🔴 Not Created |
| 22 | **Create Timeout Config** | Request timeouts | Task 19 | 🔴 Not Created |
| 23 | **Create Response Parser** | Parse API responses | Task 19 | 🔴 Not Created |
| 24 | **Create Error Exceptions** | Custom exceptions | Task 20 | 🔴 Not Created |
| 25 | **Create Rate Limiter** | Respect rate limits | Task 17 | 🔴 Not Created |
| 26 | **Create Request Logging** | Log all API calls | Task 17 | 🔴 Not Created |
| 27 | **Create ShippingProvider ABC** | Abstract shipping interface | Task 16 | 🔴 Not Created |
| 28 | **Create create_shipment Method** | Abstract method | Task 27 | 🔴 Not Created |
| 29 | **Create get_rates Method** | Abstract method | Task 27 | 🔴 Not Created |
| 30 | **Create track_shipment Method** | Abstract method | Task 27 | 🔴 Not Created |
| 31 | **Create cancel_shipment Method** | Abstract method | Task 27 | 🔴 Not Created |
| 32 | **Create KoombiyoProvider Class** | Implement interface | Task 31 | 🔴 Not Created |
| 33 | **Create Provider Registration** | Register Koombiyo | Task 32 | 🔴 Not Created |
| 34 | **Verify API Client** | Test client methods | Task 33 | 🔴 Not Created |

---

### Group C: Waybill Generation (Tasks 35-50)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 35 | **Create Waybill Model** | Store waybill data | Task 34 | 🔴 Not Created |
| 36 | **Create Order FK** | Link to order | Task 35 | 🔴 Not Created |
| 37 | **Create Waybill Number** | Koombiyo waybill number | Task 35 | 🔴 Not Created |
| 38 | **Create Barcode Field** | Waybill barcode | Task 35 | 🔴 Not Created |
| 39 | **Create Status Field** | Waybill status | Task 35 | 🔴 Not Created |
| 40 | **Create PDF URL Field** | Label PDF URL | Task 35 | 🔴 Not Created |
| 41 | **Create create_waybill API** | POST to Koombiyo | Task 35 | 🔴 Not Created |
| 42 | **Create Sender Data** | Build sender payload | Task 41 | 🔴 Not Created |
| 43 | **Create Receiver Data** | Build receiver payload | Task 41 | 🔴 Not Created |
| 44 | **Create Package Data** | Weight, dimensions | Task 41 | 🔴 Not Created |
| 45 | **Create COD Data** | COD amount if applicable | Task 41 | 🔴 Not Created |
| 46 | **Create Items Description** | Order items description | Task 41 | 🔴 Not Created |
| 47 | **Create Waybill Response** | Parse create response | Task 41 | 🔴 Not Created |
| 48 | **Create Label Download** | Download PDF label | Task 47 | 🔴 Not Created |
| 49 | **Create Local Label Storage** | Store PDF locally | Task 48 | 🔴 Not Created |
| 50 | **Verify Waybill Generation** | Test waybill creation | Task 49 | 🔴 Not Created |

---

### Group D: Tracking & Webhooks (Tasks 51-66)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 51 | **Create TrackingEvent Model** | Store tracking events | Task 50 | 🔴 Not Created |
| 52 | **Create Event Waybill FK** | Link to waybill | Task 51 | 🔴 Not Created |
| 53 | **Create Event Status** | Status code/description | Task 51 | 🔴 Not Created |
| 54 | **Create Event Timestamp** | When event occurred | Task 51 | 🔴 Not Created |
| 55 | **Create Event Location** | Where event occurred | Task 51 | 🔴 Not Created |
| 56 | **Create track_shipment API** | GET tracking from Koombiyo | Task 51 | 🔴 Not Created |
| 57 | **Create Tracking Response** | Parse tracking data | Task 56 | 🔴 Not Created |
| 58 | **Create Save Events** | Store tracking events | Task 57 | 🔴 Not Created |
| 59 | **Create Webhook View** | Koombiyo webhook endpoint | Task 50 | 🔴 Not Created |
| 60 | **Create Webhook URL** | /api/webhooks/koombiyo/ | Task 59 | 🔴 Not Created |
| 61 | **Create Signature Verify** | Verify webhook signature | Task 59 | 🔴 Not Created |
| 62 | **Create Webhook Parser** | Parse webhook payload | Task 59 | 🔴 Not Created |
| 63 | **Create Picked Up Event** | Handle picked up | Task 62 | 🔴 Not Created |
| 64 | **Create In Transit Event** | Handle in transit | Task 62 | 🔴 Not Created |
| 65 | **Create Delivered Event** | Handle delivered | Task 62 | 🔴 Not Created |
| 66 | **Create Failed Event** | Handle delivery failed | Task 62 | 🔴 Not Created |

---

### Group E: Pickup & COD (Tasks 67-80)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 67 | **Create Pickup Model** | Store pickup requests | Task 66 | 🔴 Not Created |
| 68 | **Create Pickup Date** | Requested pickup date | Task 67 | 🔴 Not Created |
| 69 | **Create Pickup Time Slot** | Morning/afternoon | Task 67 | 🔴 Not Created |
| 70 | **Create Pickup Status** | pending/scheduled/completed | Task 67 | 🔴 Not Created |
| 71 | **Create schedule_pickup API** | POST pickup to Koombiyo | Task 67 | 🔴 Not Created |
| 72 | **Create Pickup Response** | Parse pickup response | Task 71 | 🔴 Not Created |
| 73 | **Create Bulk Pickup** | Schedule multiple waybills | Task 71 | 🔴 Not Created |
| 74 | **Create CODReport Model** | COD collection reports | Task 66 | 🔴 Not Created |
| 75 | **Create Report Date Range** | Report date range | Task 74 | 🔴 Not Created |
| 76 | **Create Total Collected** | Total COD collected | Task 74 | 🔴 Not Created |
| 77 | **Create get_cod_report API** | GET COD report | Task 74 | 🔴 Not Created |
| 78 | **Create COD Reconciliation** | Match with orders | Task 77 | 🔴 Not Created |
| 79 | **Create COD Settlement** | Track settlement dates | Task 78 | 🔴 Not Created |
| 80 | **Verify Pickup & COD** | Test pickup and COD | Task 79 | 🔴 Not Created |

---

### Group F: Admin & Testing (Tasks 81-94)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 81 | **Create Waybill Admin** | Django admin for waybills | Task 80 | 🔴 Not Created |
| 82 | **Create Waybill Actions** | Bulk print labels | Task 81 | 🔴 Not Created |
| 83 | **Create Tracking Admin** | Admin for tracking events | Task 81 | 🔴 Not Created |
| 84 | **Create Pickup Admin** | Admin for pickups | Task 81 | 🔴 Not Created |
| 85 | **Create COD Report Admin** | Admin for COD reports | Task 81 | 🔴 Not Created |
| 86 | **Create Waybill API** | REST API for waybills | Task 80 | 🔴 Not Created |
| 87 | **Create Generate Waybill API** | POST /api/orders/{id}/waybill/ | Task 86 | 🔴 Not Created |
| 88 | **Create Tracking API** | GET /api/waybills/{id}/tracking/ | Task 86 | 🔴 Not Created |
| 89 | **Create Pickup API** | POST /api/pickups/schedule/ | Task 86 | 🔴 Not Created |
| 90 | **Create Koombiyo Types** | TypeScript interfaces | Task 80 | 🔴 Not Created |
| 91 | **Create Frontend Client** | Frontend API client | Task 90 | 🔴 Not Created |
| 92 | **Create Tracking UI** | Order tracking display | Task 91 | 🔴 Not Created |
| 93 | **Create Integration Tests** | Test full flow | Task 80 | 🔴 Not Created |
| 94 | **Create Documentation** | Koombiyo integration docs | Task 93 | 🔴 Not Created |

---

## Expected Final Structure

```
backend/
└── apps/
    └── shipping/
        ├── providers/
        │   ├── __init__.py
        │   ├── base.py                       # ShippingProvider ABC (Task 27)
        │   ├── factory.py                    # Provider factory
        │   └── koombiyo/
        │       ├── __init__.py
        │       ├── client.py                 # KoombiyoClient (Task 17)
        │       ├── provider.py               # KoombiyoProvider (Task 32)
        │       ├── config.py                 # Configuration (Task 04)
        │       ├── constants.py              # URLs, codes (Task 01)
        │       └── webhooks.py               # Webhook handler (Task 59)
        ├── models/
        │   ├── waybill.py                    # Waybill model (Task 35)
        │   ├── tracking_event.py             # TrackingEvent (Task 51)
        │   ├── pickup.py                     # Pickup model (Task 67)
        │   └── cod_report.py                 # CODReport model (Task 74)
        ├── admin.py                          # Admin classes (Task 81)
        ├── api/
        │   ├── serializers.py
        │   ├── views.py                      # API views (Task 86)
        │   └── urls.py
        └── services/
            ├── waybill_service.py            # Waybill generation (Task 41)
            └── tracking_service.py           # Tracking service (Task 56)

frontend/
└── lib/
    └── shipping/
        └── koombiyo/
            ├── types.ts                      # Types (Task 90)
            └── client.ts                     # API client (Task 91)
└── components/
    └── orders/
        └── TrackingTimeline.tsx              # Tracking UI (Task 92)
```

---

## Progress Tracking

| Group | Name | Tasks | Completed | Progress |
|-------|------|-------|-----------|----------|
| A | Koombiyo Configuration | 16 | 0 | 0% |
| B | API Client Implementation | 18 | 0 | 0% |
| C | Waybill Generation | 16 | 0 | 0% |
| D | Tracking & Webhooks | 16 | 0 | 0% |
| E | Pickup & COD | 14 | 0 | 0% |
| F | Admin & Testing | 14 | 0 | 0% |
| **Total** | | **94** | **0** | **0%** |

---

## Koombiyo Status Codes Reference

| Code | Status | Description |
|------|--------|-------------|
| 1 | Pending | Waybill created |
| 2 | Picked Up | Package collected |
| 3 | In Transit | On the way |
| 4 | Out for Delivery | With rider |
| 5 | Delivered | Successfully delivered |
| 6 | Failed | Delivery failed |
| 7 | Returned | Returned to sender |

---

## Notes for AI Agents

1. **Execute tasks in order** - Follow Group A → F sequence
2. **Sandbox first** - Test with sandbox credentials
3. **Abstract interface** - Use ShippingProvider base class
4. **Webhook verification** - Validate webhook signatures
5. **Store PDFs** - Download and store waybill PDFs
6. **Track events** - Store all tracking events
7. **COD reconciliation** - Match COD with orders
8. **Bulk operations** - Support batch waybill/pickup
9. **Rate limiting** - Respect API rate limits
