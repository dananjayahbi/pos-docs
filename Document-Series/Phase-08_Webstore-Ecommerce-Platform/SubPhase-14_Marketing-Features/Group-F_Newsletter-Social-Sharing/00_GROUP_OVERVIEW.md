# Group F: Newsletter & Social Sharing

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 14 - Marketing Features  
> **Group:** F of F  
> **Tasks Covered:** 83-96  
> **Group Goal:** Implement newsletter subscription and social sharing features

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Promotional-Banners-Popups](../Group-E_Promotional-Banners-Popups/)
- **→ Next Group:** None (Last Group) | **Next Phase:** [Phase-09_Integrations-Sri-Lanka-Localizations](../../Phase-09_Integrations-Sri-Lanka-Localizations/)

---

## Group Overview

This group implements newsletter and social sharing. Creates newsletter types and API client. Creates useSubscribe mutation hook. Creates NewsletterForm component with email validation and success message. Creates footer newsletter and popup newsletter placements. Creates social share types and ShareButtons component. Creates Facebook share, WhatsApp share, and copy link functionality. Verifies all marketing features work correctly.

### Key Outcomes

- Newsletter types interface
- Newsletter API client
- useSubscribe mutation
- NewsletterForm component
- Newsletter email validation
- Newsletter success message
- Footer newsletter section
- Popup newsletter
- Social share types
- ShareButtons component
- Facebook share
- WhatsApp share
- Copy link share
- Marketing features verified

### Technology Context

- **Form:** React Hook Form
- **Validation:** Email regex
- **Share:** Web Share API fallback
- **Clipboard:** Navigator clipboard

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-83-90_Newsletter-Form.md` | Create newsletter types and form | 83-90 |
| 02 | `02_Tasks-91-96_Social-Share-Verify.md` | Create social sharing and verification | 91-96 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 83 | Create Newsletter Types | Low | Task 82 |
| 84 | Create Newsletter API | Medium | Task 83 |
| 85 | Create Subscribe Mutation | Medium | Task 84 |
| 86 | Create NewsletterForm Component | Medium | Task 85 |
| 87 | Create Newsletter Validation | Low | Task 86 |
| 88 | Create Newsletter Success | Low | Task 86 |
| 89 | Create Footer Newsletter | Medium | Task 86 |
| 90 | Create Popup Newsletter | Medium | Task 86 |
| 91 | Create Social Share Types | Low | Task 82 |
| 92 | Create ShareButtons Component | Medium | Task 91 |
| 93 | Create Facebook Share | Low | Task 92 |
| 94 | Create WhatsApp Share | Low | Task 92 |
| 95 | Create Copy Link Share | Low | Task 92 |
| 96 | Verify Marketing Features | Medium | Task 95 |

---

## Execution Order

```
Task 83: Newsletter Types
    │
    ▼
Task 84: Newsletter API
    │
    ▼
Task 85: Subscribe Mutation
    │
    ▼
Task 86: NewsletterForm Component
    │
    ├────────┬────────┬────────┐
    ▼        ▼        ▼        ▼
T-87     T-88     T-89     T-90
(Valid) (Success)(Footer)(Popup)
    │        │        │        │
    └────────┴────────┴────────┘
                   │
    ┌──────────────┘
    ▼
Task 91: Social Share Types
    │
    ▼
Task 92: ShareButtons Component
    │
    ├────────┬────────┐
    ▼        ▼        ▼
T-93     T-94     T-95
(FB)    (WA)    (Copy)
    │        │        │
    └────────┴────────┘
              │
              ▼
        Task 96: Verify
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── marketing/
│       ├── newsletter/
│       │   ├── NewsletterForm.tsx
│       │   ├── FooterNewsletter.tsx
│       │   ├── PopupNewsletter.tsx
│       │   └── index.ts
│       └── social/
│           ├── ShareButtons.tsx
│           └── index.ts
├── lib/
│   └── marketing/
│       └── newsletter.ts
├── hooks/
│   └── marketing/
│       └── useNewsletter.ts
└── types/
    └── marketing/
        ├── newsletter.types.ts
        └── social.types.ts
```

---

## Notes for AI Agents

### Newsletter Types (Task 83)
| Type | Fields |
|------|--------|
| Subscription | email, name? |
| Response | success, message |
| Preferences | categories? |

### Newsletter API (Task 84)
| Endpoint | Method |
|----------|--------|
| /api/newsletter/subscribe | POST |
| Body | { email, source } |

### Subscribe Mutation (Task 85)
| Hook | Return |
|------|--------|
| useSubscribe | mutation function |
| Options | onSuccess, onError |

### NewsletterForm Component (Task 86)
| Props | Type |
|-------|------|
| onSuccess | () => void |
| placeholder | string |
| buttonText | string |
| variant | inline, stacked |

### Newsletter Validation (Task 87)
| Field | Rule |
|-------|------|
| Email | Required, valid format |
| Pattern | RFC 5322 regex |
| Error | "Invalid email" |

### Newsletter Success (Task 88)
| Display | Content |
|---------|---------|
| Message | "Thanks for subscribing!" |
| Animation | Check icon + fade |
| Duration | 3 seconds |

### Footer Newsletter (Task 89)
| Location | Footer |
|----------|--------|
| Layout | Email + button inline |
| Text | "Subscribe to updates" |
| Style | Match footer theme |

### Popup Newsletter (Task 90)
| Location | Modal popup |
|----------|-------------|
| Trigger | Exit intent or timer |
| Content | Incentive + form |
| Dismiss | X or outside click |

### Social Share Types (Task 91)
| Type | Fields |
|------|--------|
| ShareData | url, title, text |
| Platform | facebook, whatsapp, copy |

### ShareButtons Component (Task 92)
| Props | Type |
|-------|------|
| url | string |
| title | string |
| platforms | Platform[] |
| size | sm, md, lg |

### Facebook Share (Task 93)
| URL | Format |
|-----|--------|
| Base | https://www.facebook.com/sharer/sharer.php |
| Param | ?u=encoded_url |
| Window | popup |

### WhatsApp Share (Task 94)
| URL | Format |
|-----|--------|
| Base | https://wa.me/ |
| Param | ?text=encoded_message |
| Include | Title + URL |

### Copy Link Share (Task 95)
| Action | Method |
|--------|--------|
| Copy | navigator.clipboard.writeText |
| Feedback | "Link copied!" toast |
| Fallback | document.execCommand |

### Verify Marketing Features (Task 96)
| Test | Verify |
|------|--------|
| Coupons | Apply, remove, discount |
| Flash sales | Timer, prices |
| WhatsApp | All links work |
| Banners | Display, dismiss |
| Popups | Triggers, frequency |
| Newsletter | Subscribe flow |
| Share | All platforms |
