# Group C: Store Configuration

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 01 - Webstore Project Structure  
> **Group:** C of F  
> **Tasks Covered:** 31-46  
> **Group Goal:** Create store configuration with settings, routes, navigation, and feature flags

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Store-Layout-Foundation](../Group-B_Store-Layout-Foundation/)
- **→ Next Group:** [Group-D_Store-API-Client](../Group-D_Store-API-Client/)

---

## Group Overview

This group creates all store configuration. Creates store environment variables and main config file. Defines store metadata (name, description). Configures currency settings (LKR) and locale settings (en-LK). Creates feature flags for toggleable features. Creates store routes config and navigation config. Creates footer links config and social links config. Creates contact info config. Creates shipping and payment methods config. Creates default SEO config. Creates image optimization config. Verifies all configuration values.

### Key Outcomes

- Store environment variables
- Store config file
- Store metadata defined
- Currency settings (LKR, ₨)
- Locale settings (en-LK)
- Store feature flags
- Store routes config
- Navigation menu config
- Footer links config
- Social links config
- Contact info config
- Shipping config
- Payment methods config
- SEO default config
- Image config
- Configuration verified

### Technology Context

- **Config:** TypeScript configuration objects
- **Currency:** LKR (Sri Lankan Rupees)
- **Locale:** en-LK
- **Timezone:** Asia/Colombo

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-31-40_Environment-Navigation.md` | Create environment, metadata, and navigation config | 31-40 |
| 02 | `02_Tasks-41-46_Business-SEO-Verify.md` | Create business config, SEO, and verification | 41-46 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 31 | Create Store Environment Variables | Low | Task 14 |
| 32 | Create Store Config File | Medium | Task 31 |
| 33 | Define Store Metadata | Low | Task 32 |
| 34 | Configure Currency Settings | Low | Task 32 |
| 35 | Configure Locale Settings | Low | Task 32 |
| 36 | Create Store Feature Flags | Medium | Task 32 |
| 37 | Create Store Routes Config | Low | Task 32 |
| 38 | Create Store Navigation Config | Low | Task 37 |
| 39 | Create Store Footer Config | Low | Task 37 |
| 40 | Create Social Links Config | Low | Task 39 |
| 41 | Create Contact Info Config | Low | Task 32 |
| 42 | Create Shipping Config | Medium | Task 32 |
| 43 | Create Payment Methods Config | Medium | Task 32 |
| 44 | Create SEO Default Config | Medium | Task 33 |
| 45 | Create Image Config | Low | Task 32 |
| 46 | Verify Configuration | Low | Task 45 |

---

## Execution Order

```
Task 31: Store Environment Variables
    │
    ▼
Task 32: Store Config File
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 33: Store Metadata                                │
    │                                                  │
    ▼                                                  │
Task 34: Currency Settings                             │
    │                                                  │
    ▼                                                  │
Task 35: Locale Settings                               │
    │                                                  │
    ▼                                                  │
Task 36: Feature Flags                                 │
    │                                                  │
    ▼                                                  │
Task 37: Routes Config                                 │
    │                                                  │
    ├──────────┬──────────┐                            │
    ▼          ▼          │                            │
Task 38    Task 39       │                            │
(Nav)      (Footer)       │                            │
    │          │          │                            │
    │          ▼          │                            │
    │     Task 40        │                            │
    │     (Social)       │                            │
    │          │          │                            │
    └──────────┴──────────┘                            │
               │                                       │
               ▼                                       │
         Task 41: Contact Info                         │
               │                                       │
         ┌─────┴─────┐                                 │
         ▼           ▼                                 │
      Task 42    Task 43                               │
     (Shipping) (Payment)                              │
         │           │                                 │
         └─────┬─────┘                                 │
               ▼                                       │
         Task 44: SEO Config                           │
               │                                       │
               ▼                                       │
         Task 45: Image Config                         │
               │                                       │
               └───────────────────────────────────────┘
                          │
                          ▼
                    Task 46: Verify
```

---

## Expected Deliverables

```
frontend/
├── .env.local                    # Store env vars
├── lib/
│   └── store/
│       ├── config.ts             # Main store config
│       ├── routes.ts             # Store routes
│       ├── navigation.ts         # Nav/footer config
│       ├── shipping.ts           # Shipping config
│       ├── payment.ts            # Payment config
│       ├── seo.ts                # SEO defaults
│       ├── images.ts             # Image config
│       └── index.ts              # Export all
```

---

## Notes for AI Agents

### Environment Variables (Task 31)
| Variable | Example | Description |
|----------|---------|-------------|
| NEXT_PUBLIC_STORE_NAME | LankaCommerce | Store name |
| NEXT_PUBLIC_STORE_URL | https://store.lcc.lk | Store URL |
| NEXT_PUBLIC_API_URL | https://api.lcc.lk | API base URL |
| NEXT_PUBLIC_CURRENCY | LKR | Currency code |

### Store Metadata (Task 33)
| Key | Value |
|-----|-------|
| name | LankaCommerce Store |
| tagline | Your One-Stop Shop |
| description | Quality products at best prices |
| copyright | © 2026 LankaCommerce |

### Currency Settings (Task 34)
| Setting | Value |
|---------|-------|
| code | LKR |
| symbol | ₨ |
| decimals | 2 |
| position | before |
| separator | , |

### Locale Settings (Task 35)
| Setting | Value |
|---------|-------|
| locale | en-LK |
| language | English |
| timezone | Asia/Colombo |
| dateFormat | DD/MM/YYYY |
| phonePrefix | +94 |

### Feature Flags (Task 36)
| Flag | Default | Description |
|------|---------|-------------|
| wishlist | true | Enable wishlist |
| reviews | true | Enable reviews |
| compare | true | Product comparison |
| guestCheckout | true | Guest checkout |
| newsletter | true | Newsletter signup |

### Navigation Config (Task 38)
| Label | Href | Mega Menu |
|-------|------|-----------|
| Home | / | No |
| Products | /products | Yes |
| Categories | /categories | Yes |
| Sale | /sale | No |
| Contact | /contact | No |

### Footer Config (Task 39)
| Section | Links |
|---------|-------|
| Shop | Products, Categories, Sale |
| Account | Login, Register, Orders |
| Support | Contact, FAQ, Returns |
| Legal | Terms, Privacy, Cookies |

### Social Links (Task 40)
| Platform | URL |
|----------|-----|
| Facebook | facebook.com/lankacommerce |
| Instagram | instagram.com/lankacommerce |
| Twitter | twitter.com/lankacommerce |
| WhatsApp | wa.me/94xxxxxxxxx |

### Shipping Config (Task 42)
| Zone | Methods | Delivery |
|------|---------|----------|
| Colombo | Express, Standard | 1-2 days |
| Western | Standard | 2-3 days |
| Other | Standard | 3-5 days |

### Payment Methods (Task 43)
| Method | Provider | Enabled |
|--------|----------|---------|
| Card | Stripe/PayHere | Yes |
| Bank | Direct | Yes |
| COD | - | Yes |
| PayHere | PayHere | Yes |

### SEO Defaults (Task 44)
| Meta | Value |
|------|-------|
| titleTemplate | %s | LankaCommerce |
| defaultTitle | LankaCommerce Store |
| description | Quality products... |
| openGraph | Site og config |

### Image Config (Task 45)
| Size | Width | Height | Quality |
|------|-------|--------|---------|
| thumbnail | 150 | 150 | 75 |
| small | 300 | 300 | 80 |
| medium | 600 | 600 | 85 |
| large | 1200 | 1200 | 90 |
