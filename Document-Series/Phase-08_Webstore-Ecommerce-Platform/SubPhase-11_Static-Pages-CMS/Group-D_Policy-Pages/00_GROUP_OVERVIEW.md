# Group D: Policy Pages

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 11 - Static Pages & CMS  
> **Group:** D of F  
> **Tasks Covered:** 53-66  
> **Group Goal:** Create policy pages for Terms, Privacy, Returns, and Shipping with table of contents

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Contact-FAQ-Pages](../Group-C_Contact-FAQ-Pages/)
- **→ Next Group:** [Group-E_Blog-System](../Group-E_Blog-System/)

---

## Group Overview

This group creates policy pages. Creates Terms & Conditions page with content and table of contents. Creates Privacy Policy page with content and TOC. Creates Return Policy page with content and return process steps. Creates Shipping Information page with shipping rates table. Creates reusable policy template layout. Creates anchor links for jumping to sections. Verifies all policy pages work correctly.

### Key Outcomes

- Terms & Conditions page
- Terms content area
- Terms table of contents
- Privacy Policy page
- Privacy content area
- Privacy table of contents
- Return Policy page
- Returns content area
- Return process steps
- Shipping Information page
- Shipping rates table
- Policy template layout
- Anchor links (jump to section)
- Policy pages verified

### Technology Context

- **TOC:** Auto-generated from headings
- **Anchors:** Smooth scroll to section
- **Template:** Reusable policy layout
- **Table:** Responsive shipping rates

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-53-61_Terms-Privacy-Returns.md` | Create Terms, Privacy, Returns pages | 53-61 |
| 02 | `02_Tasks-62-66_Shipping-Template-Verify.md` | Create Shipping and template | 62-66 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 53 | Create Terms Page | Low | Task 52 |
| 54 | Create Terms Content | Medium | Task 53 |
| 55 | Create Terms TOC | Medium | Task 53 |
| 56 | Create Privacy Page | Low | Task 52 |
| 57 | Create Privacy Content | Medium | Task 56 |
| 58 | Create Privacy TOC | Medium | Task 56 |
| 59 | Create Returns Page | Low | Task 52 |
| 60 | Create Returns Content | Medium | Task 59 |
| 61 | Create Returns Process | Medium | Task 59 |
| 62 | Create Shipping Page | Low | Task 52 |
| 63 | Create Shipping Rates | Medium | Task 62 |
| 64 | Create Policy Template | Medium | Task 53 |
| 65 | Create Anchor Links | Medium | Task 55 |
| 66 | Verify Policy Pages | Low | Task 65 |

---

## Execution Order

```
Task 53: Terms Page          Task 56: Privacy Page
    │                             │
    ├────────┐               ┌────┴────┐
    ▼        ▼               ▼         ▼
T-54      T-55            T-57      T-58
(Content) (TOC)         (Content)  (TOC)
    │        │               │         │
    └────────┴───────────────┴─────────┘
                   │
                   ▼
             Task 64: Policy Template
                   │
                   ▼
Task 59: Returns Page        Task 62: Shipping Page
    │                             │
    ├────────┐                    ▼
    ▼        ▼              Task 63: Rates Table
T-60      T-61                    │
(Content)(Process)                │
    │        │                    │
    └────────┴────────────────────┘
                   │
                   ▼
             Task 65: Anchor Links
                   │
                   ▼
             Task 66: Verify
```

---

## Expected Deliverables

```
frontend/
├── app/
│   └── (storefront)/
│       ├── terms/
│       │   └── page.tsx
│       ├── privacy/
│       │   └── page.tsx
│       ├── returns/
│       │   └── page.tsx
│       └── shipping/
│           └── page.tsx
├── components/
│   └── storefront/
│       └── cms/
│           └── Policy/
│               ├── PolicyTemplate.tsx
│               ├── TableOfContents.tsx
│               ├── AnchorLink.tsx
│               ├── PolicyContent.tsx
│               ├── ReturnProcess.tsx
│               ├── ShippingRates.tsx
│               └── index.ts
```

---

## Notes for AI Agents

### Terms Page (Task 53)
| Section | Content |
|---------|---------|
| General | General terms |
| Use | Acceptable use |
| Account | Account terms |
| Orders | Order policies |
| Payment | Payment terms |
| Liability | Limitations |

### Terms TOC (Task 55)
| Feature | Description |
|---------|-------------|
| Auto | Extract from headings |
| Links | Anchor links |
| Sticky | Optional sticky on desktop |
| Mobile | Collapsible |

### Privacy Page (Task 56)
| Section | Content |
|---------|---------|
| Collection | Data collected |
| Use | How data is used |
| Sharing | Third-party sharing |
| Security | Data protection |
| Rights | User rights |
| Contact | Privacy contact |

### Returns Page (Task 59)
| Section | Content |
|---------|---------|
| Policy | Return conditions |
| Timeframe | Return window |
| Process | How to return |
| Refunds | Refund process |
| Exclusions | Non-returnable items |

### Return Process Steps (Task 61)
| Step | Description |
|------|-------------|
| 1 | Contact customer service |
| 2 | Get return authorization |
| 3 | Pack item securely |
| 4 | Ship to return address |
| 5 | Receive refund |

### Shipping Page (Task 62)
| Section | Content |
|---------|---------|
| Zones | Delivery zones |
| Rates | Shipping costs |
| Times | Delivery times |
| Tracking | How to track |

### Shipping Rates Table (Task 63)
| Column | Content |
|--------|---------|
| Zone | Colombo, Other, etc. |
| Standard | Standard rate |
| Express | Express rate |
| Time | Delivery time |

### Policy Template (Task 64)
| Element | Description |
|---------|-------------|
| Layout | Two-column on desktop |
| Sidebar | TOC |
| Main | Content |
| Mobile | TOC above content |

### Anchor Links (Task 65)
| Feature | Value |
|---------|-------|
| ID | From heading |
| Scroll | Smooth scroll |
| Offset | Account for header |
| Hash | Update URL hash |
