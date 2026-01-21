# Group D: Store API Client

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 01 - Webstore Project Structure  
> **Group:** D of F  
> **Tasks Covered:** 47-60  
> **Group Goal:** Create store API client with modules for products, cart, checkout, and more

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Store-Configuration](../Group-C_Store-Configuration/)
- **→ Next Group:** [Group-E_Store-State-Management](../Group-E_Store-State-Management/)

---

## Group Overview

This group creates the complete store API client. Creates main store API client with base URL configuration. Creates auth interceptor for customer token handling and error handler for API errors. Creates API modules for products, categories, cart, checkout, customer accounts, orders, reviews, wishlist, and search. Verifies all API modules work correctly.

### Key Outcomes

- Store API client created
- Store base URL configured
- Store auth interceptor
- Store error handler
- Products API module
- Categories API module
- Cart API module
- Checkout API module
- Customer API module
- Orders API module
- Reviews API module
- Wishlist API module
- Search API module
- API client verified

### Technology Context

- **HTTP:** Axios or fetch wrapper
- **Auth:** JWT token handling
- **Errors:** Standardized error handling
- **Modules:** Separated by domain

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-47-53_Client-Core-Modules.md` | Create API client and core modules | 47-53 |
| 02 | `02_Tasks-54-60_Extended-Modules-Verify.md` | Create extended modules and verification | 54-60 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 47 | Create Store API Client | Medium | Task 46 |
| 48 | Configure Store Base URL | Low | Task 47 |
| 49 | Create Store Auth Interceptor | Medium | Task 47 |
| 50 | Create Store Error Handler | Medium | Task 47 |
| 51 | Create Products API Module | Medium | Task 47 |
| 52 | Create Categories API Module | Low | Task 47 |
| 53 | Create Cart API Module | Medium | Task 47 |
| 54 | Create Checkout API Module | Medium | Task 47 |
| 55 | Create Customer API Module | Medium | Task 47 |
| 56 | Create Orders API Module | Medium | Task 47 |
| 57 | Create Reviews API Module | Low | Task 47 |
| 58 | Create Wishlist API Module | Low | Task 47 |
| 59 | Create Search API Module | Medium | Task 47 |
| 60 | Verify API Client | Low | Task 59 |

---

## Execution Order

```
Task 47: Create Store API Client
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 48: Configure Base URL                            │
    │                                                  │
    ▼                                                  │
Task 49: Auth Interceptor                              │
    │                                                  │
    ▼                                                  │
Task 50: Error Handler                                 │
    │                                                  │
    └──────────────────────────────────────────────────┘
               │
    ┌──────────┼──────────┬──────────┬──────────┐
    ▼          ▼          ▼          ▼          │
Task 51    Task 52    Task 53    Task 54       │
(Products) (Categories)(Cart)   (Checkout)     │
    │          │          │          │          │
    └──────────┴──────────┴──────────┘          │
               │                                │
    ┌──────────┼──────────┬──────────┬──────────┤
    ▼          ▼          ▼          ▼          │
Task 55    Task 56    Task 57    Task 58       │
(Customer) (Orders)   (Reviews) (Wishlist)     │
    │          │          │          │          │
    └──────────┴──────────┴──────────┘          │
               │                                │
               ▼                                │
         Task 59: Search API                    │
               │                                │
               ▼
         Task 60: Verify
```

---

## Expected Deliverables

```
frontend/
└── lib/
    └── api/
        └── store/
            ├── client.ts             # Main API client
            ├── config.ts             # Base URL config
            ├── interceptors.ts       # Auth interceptor
            ├── errors.ts             # Error handler
            ├── modules/
            │   ├── products.ts       # Products API
            │   ├── categories.ts     # Categories API
            │   ├── cart.ts           # Cart API
            │   ├── checkout.ts       # Checkout API
            │   ├── customer.ts       # Customer API
            │   ├── orders.ts         # Orders API
            │   ├── reviews.ts        # Reviews API
            │   ├── wishlist.ts       # Wishlist API
            │   ├── search.ts         # Search API
            │   └── index.ts          # Export all
            └── index.ts              # Main export
```

---

## Notes for AI Agents

### API Client Config (Task 47)
| Setting | Value |
|---------|-------|
| baseURL | NEXT_PUBLIC_API_URL |
| timeout | 30000ms |
| headers | Content-Type: application/json |

### Auth Interceptor (Task 49)
| Feature | Description |
|---------|-------------|
| Token | Add customer JWT to requests |
| Refresh | Auto-refresh expired tokens |
| Logout | Clear on 401 response |

### Error Handler (Task 50)
| Error Code | Action |
|------------|--------|
| 400 | Validation error toast |
| 401 | Redirect to login |
| 403 | Permission denied |
| 404 | Not found page |
| 500 | Server error toast |

### Products API (Task 51)
| Endpoint | Method | Description |
|----------|--------|-------------|
| /products | GET | List products |
| /products/:slug | GET | Get product |
| /products/featured | GET | Featured products |
| /products/sale | GET | Sale products |

### Categories API (Task 52)
| Endpoint | Method | Description |
|----------|--------|-------------|
| /categories | GET | List categories |
| /categories/:slug | GET | Get category |
| /categories/:slug/products | GET | Category products |

### Cart API (Task 53)
| Endpoint | Method | Description |
|----------|--------|-------------|
| /cart | GET | Get cart |
| /cart/items | POST | Add item |
| /cart/items/:id | PATCH | Update item |
| /cart/items/:id | DELETE | Remove item |
| /cart/clear | DELETE | Clear cart |

### Checkout API (Task 54)
| Endpoint | Method | Description |
|----------|--------|-------------|
| /checkout | POST | Create checkout |
| /checkout/shipping | POST | Set shipping |
| /checkout/payment | POST | Process payment |
| /checkout/confirm | POST | Confirm order |

### Customer API (Task 55)
| Endpoint | Method | Description |
|----------|--------|-------------|
| /auth/register | POST | Register |
| /auth/login | POST | Login |
| /auth/logout | POST | Logout |
| /customer/profile | GET | Get profile |
| /customer/profile | PATCH | Update profile |
| /customer/addresses | GET | Get addresses |

### Orders API (Task 56)
| Endpoint | Method | Description |
|----------|--------|-------------|
| /orders | GET | List orders |
| /orders/:id | GET | Get order |
| /orders/:id/track | GET | Track order |
| /orders/:id/cancel | POST | Cancel order |

### Reviews API (Task 57)
| Endpoint | Method | Description |
|----------|--------|-------------|
| /products/:id/reviews | GET | Get reviews |
| /products/:id/reviews | POST | Add review |
| /reviews/:id | DELETE | Delete review |

### Wishlist API (Task 58)
| Endpoint | Method | Description |
|----------|--------|-------------|
| /wishlist | GET | Get wishlist |
| /wishlist | POST | Add item |
| /wishlist/:id | DELETE | Remove item |

### Search API (Task 59)
| Endpoint | Method | Description |
|----------|--------|-------------|
| /search | GET | Search products |
| /search/suggestions | GET | Autocomplete |
| /search/filters | GET | Get filters |
