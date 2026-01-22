# Group B: API Client Implementation

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 08 - Koombiyo Courier API  
> **Group:** B of F  
> **Tasks Covered:** 17-34  
> **Group Goal:** Implement Koombiyo HTTP client with abstract shipping provider interface

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Koombiyo-Configuration](../Group-A_Koombiyo-Configuration/)
- **→ Next Group:** [Group-C_Waybill-Generation](../Group-C_Waybill-Generation/)

---

## Group Overview

This group implements the API client. Creates KoombiyoClient class as HTTP wrapper with authentication header and generic request method. Creates error handling, retry logic, and timeout configuration. Creates response parser and custom exceptions. Creates rate limiter and request logging. Creates ShippingProvider abstract base class with create_shipment, get_rates, track_shipment, and cancel_shipment abstract methods. Creates KoombiyoProvider implementing the interface. Creates provider registration. Verifies API client.

### Key Outcomes

- KoombiyoClient class
- Authentication header
- Request method
- Error handling
- Retry logic
- Timeout config
- Response parser
- Custom exceptions
- Rate limiter
- Request logging
- ShippingProvider ABC
- create_shipment method
- get_rates method
- track_shipment method
- cancel_shipment method
- KoombiyoProvider class
- Provider registration
- API client verified

### Technology Context

- **HTTP:** httpx or requests
- **Retry:** Exponential backoff
- **Interface:** Abstract base class
- **Factory:** Provider registration

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-17-26_Client-Methods.md` | Create client and methods | 17-26 |
| 02 | `02_Tasks-27-34_Provider-Verify.md` | Create provider and verify | 27-34 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 17 | Create KoombiyoClient Class | High | Task 16 |
| 18 | Create Authentication Header | Low | Task 17 |
| 19 | Create Request Method | Medium | Task 18 |
| 20 | Create Error Handling | Medium | Task 19 |
| 21 | Create Retry Logic | Medium | Task 20 |
| 22 | Create Timeout Config | Low | Task 19 |
| 23 | Create Response Parser | Medium | Task 19 |
| 24 | Create Error Exceptions | Medium | Task 20 |
| 25 | Create Rate Limiter | Medium | Task 17 |
| 26 | Create Request Logging | Low | Task 17 |
| 27 | Create ShippingProvider ABC | Medium | Task 16 |
| 28 | Create create_shipment Method | Low | Task 27 |
| 29 | Create get_rates Method | Low | Task 27 |
| 30 | Create track_shipment Method | Low | Task 27 |
| 31 | Create cancel_shipment Method | Low | Task 27 |
| 32 | Create KoombiyoProvider Class | High | Task 31 |
| 33 | Create Provider Registration | Low | Task 32 |
| 34 | Verify API Client | Low | Task 33 |

---

## Execution Order

```
Task 17: KoombiyoClient Class
    │
    ├────────┬────────┬────────┐
    ▼        ▼        ▼        ▼
T-18     T-25     T-26
(Auth)  (Rate)  (Log)
    │        │        │
    ▼        │        │
T-19       │        │
(Req)      │        │
    │        │        │
    ├────────┬────────┐
    ▼        ▼        ▼
T-20     T-22     T-23
(Err)  (Timeout)(Parse)
    │        │        │
    ├────┐   │        │
    ▼    ▼   │        │
T-21   T-24  │        │
(Retry)(Exc) │        │
    │    │    │        │
    └────┴────┴────────┘
         │
         │   Task 27: ShippingProvider ABC
         │        │
         │   ┌────┼────┬────────┬────────┐
         │   ▼    ▼    ▼        ▼        ▼
         │ T-28  T-29  T-30    T-31
         │(Create)(Rates)(Track)(Cancel)
         │   │    │    │        │
         │   └────┴────┴────────┘
         │               │
         └───────────────┘
                    │
                    ▼
             Task 32: KoombiyoProvider
                    │
                    ▼
             Task 33: Provider Registration
                    │
                    ▼
             Task 34: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── shipping/
        └── providers/
            ├── base.py
            ├── factory.py
            └── koombiyo/
                ├── client.py
                ├── provider.py
                └── exceptions.py
```

---

## Notes for AI Agents

### KoombiyoClient Class (Task 17)
| Attribute | Value |
|-----------|-------|
| base_url | From config |
| timeout | 30 seconds |
| headers | Authentication |

### Authentication Header (Task 18)
| Header | Value |
|--------|-------|
| X-API-Key | API key |
| X-Merchant-ID | Merchant ID |

### Request Method (Task 19)
| Method | Description |
|--------|-------------|
| request | Generic HTTP request |
| Input | method, endpoint, data |
| Output | Parsed response |

### Error Handling (Task 20)
| Error | Action |
|-------|--------|
| 400 | Raise validation error |
| 401 | Raise auth error |
| 500 | Retry or raise |

### Retry Logic (Task 21)
| Setting | Value |
|---------|-------|
| Max retries | 3 |
| Backoff | Exponential |
| Retry on | 5xx, timeout |

### Timeout Config (Task 22)
| Timeout | Value |
|---------|-------|
| Connect | 5 seconds |
| Read | 30 seconds |

### Response Parser (Task 23)
| Parse | JSON response |
|-------|---------------|
| Validate | Success field |
| Error | Extract message |

### Error Exceptions (Task 24)
| Exception | Use |
|-----------|-----|
| KoombiyoAuthError | Authentication failed |
| KoombiyoValidationError | Invalid data |
| KoombiyoAPIError | General API error |

### Rate Limiter (Task 25)
| Setting | Value |
|---------|-------|
| Rate | 10 requests/second |
| Method | Token bucket |

### Request Logging (Task 26)
| Log | Details |
|-----|---------|
| Request | Method, URL, payload |
| Response | Status, time, body |

### ShippingProvider ABC (Task 27)
| Class | ShippingProvider |
|-------|------------------|
| Type | Abstract base class |
| Methods | Abstract methods |

### create_shipment Method (Task 28)
| Input | ShipmentRequest |
|-------|-----------------|
| Output | ShipmentResponse |
| Abstract | Yes |

### get_rates Method (Task 29)
| Input | RateRequest |
|-------|-------------|
| Output | List[Rate] |
| Abstract | Yes |

### track_shipment Method (Task 30)
| Input | waybill_number |
|-------|----------------|
| Output | TrackingInfo |
| Abstract | Yes |

### cancel_shipment Method (Task 31)
| Input | waybill_number |
|-------|----------------|
| Output | CancellationResult |
| Abstract | Yes |

### KoombiyoProvider Class (Task 32)
| Class | KoombiyoProvider |
|-------|------------------|
| Extends | ShippingProvider |
| Uses | KoombiyoClient |

### Provider Registration (Task 33)
| Factory | ShippingProviderFactory |
|---------|-------------------------|
| Key | "koombiyo" |
| Class | KoombiyoProvider |
