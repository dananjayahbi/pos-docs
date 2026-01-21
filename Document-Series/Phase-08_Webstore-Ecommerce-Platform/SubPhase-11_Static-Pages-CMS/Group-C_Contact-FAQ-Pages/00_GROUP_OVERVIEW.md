# Group C: Contact & FAQ Pages

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 11 - Static Pages & CMS  
> **Group:** C of F  
> **Tasks Covered:** 37-52  
> **Group Goal:** Create Contact page with form and FAQ page with searchable accordion

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Static-Pages](../Group-B_Static-Pages/)
- **→ Next Group:** [Group-D_Policy-Pages](../Group-D_Policy-Pages/)

---

## Group Overview

This group creates Contact and FAQ pages. Creates Contact page with contact information section showing address, phone, and email. Creates WhatsApp quick contact link for Sri Lanka users. Creates contact form with name, email, phone (+94 format), and message fields. Creates form submit handling and success message. Creates FAQ page with accordion component for expandable Q&A items. Creates FAQ categories for grouping questions and FAQ search functionality. Verifies both pages work correctly.

### Key Outcomes

- Contact page
- Contact info section (address, phone, email)
- WhatsApp contact link
- Contact form component
- Name input field
- Email input field
- Phone input (+94 format)
- Message textarea
- Form submit handling
- Form success message
- FAQ page
- FAQ accordion component
- FAQ item component
- FAQ categories
- FAQ search
- Contact & FAQ verified

### Technology Context

- **Forms:** React Hook Form
- **Phone:** +94 Sri Lanka format
- **WhatsApp:** wa.me quick link
- **Accordion:** Radix or custom

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-37-46_Contact-Page-Form.md` | Create Contact page and form | 37-46 |
| 02 | `02_Tasks-47-52_FAQ-Page-Verify.md` | Create FAQ page and verification | 47-52 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 37 | Create Contact Page | Low | Task 36 |
| 38 | Create Contact Info Section | Low | Task 37 |
| 39 | Create WhatsApp Contact | Low | Task 38 |
| 40 | Create Contact Form | Medium | Task 37 |
| 41 | Create Name Input | Low | Task 40 |
| 42 | Create Email Input | Low | Task 40 |
| 43 | Create Phone Input | Low | Task 40 |
| 44 | Create Message Textarea | Low | Task 40 |
| 45 | Create Form Submit | Medium | Task 40 |
| 46 | Create Form Success | Low | Task 45 |
| 47 | Create FAQ Page | Low | Task 36 |
| 48 | Create FAQ Accordion | Medium | Task 47 |
| 49 | Create FAQ Item | Low | Task 48 |
| 50 | Create FAQ Categories | Medium | Task 47 |
| 51 | Create FAQ Search | Medium | Task 47 |
| 52 | Verify Contact & FAQ | Low | Task 51 |

---

## Execution Order

```
Task 37: Contact Page                Task 47: FAQ Page
    │                                     │
    ├────────┐                       ┌────┼────────┬────────┐
    ▼        ▼                       ▼    ▼        ▼        ▼
T-38      T-40                    T-48  T-50     T-51
(Info)   (Form)                 (Accord)(Cats)  (Search)
    │        │                       │    │        │
    ▼        ├────────┬────────┐     ▼    │        │
T-39     T-41     T-42     T-43   T-49   │        │
(WA)   (Name)  (Email)  (Phone)  (Item)  │        │
    │        │        │        │     │    │        │
    │        │        │        ▼     │    │        │
    │        │        │     T-44     │    │        │
    │        │        │   (Message)  │    │        │
    │        │        │        │     │    │        │
    │        └────────┴────────┘     │    │        │
    │               │                │    │        │
    │               ▼                │    │        │
    │          Task 45: Submit       │    │        │
    │               │                │    │        │
    │               ▼                │    │        │
    │          Task 46: Success      │    │        │
    │               │                │    │        │
    └───────────────┴────────────────┴────┴────────┘
                          │
                          ▼
                    Task 52: Verify
```

---

## Expected Deliverables

```
frontend/
├── app/
│   └── (storefront)/
│       ├── contact/
│       │   └── page.tsx
│       └── faq/
│           └── page.tsx
├── components/
│   └── storefront/
│       └── cms/
│           ├── Contact/
│           │   ├── ContactInfo.tsx
│           │   ├── WhatsAppContact.tsx
│           │   ├── ContactForm.tsx
│           │   ├── FormSuccess.tsx
│           │   └── index.ts
│           └── FAQ/
│               ├── FAQAccordion.tsx
│               ├── FAQItem.tsx
│               ├── FAQCategories.tsx
│               ├── FAQSearch.tsx
│               └── index.ts
└── services/
    └── storefront/
        └── cms/
            └── contactService.ts
```

---

## Notes for AI Agents

### Contact Page (Task 37)
| Layout | Description |
|--------|-------------|
| Left | Contact form |
| Right | Contact info |
| Mobile | Stacked |

### Contact Info Section (Task 38)
| Info | Format |
|------|--------|
| Address | Full address with city |
| Phone | +94 XX XXX XXXX |
| Email | info@store.lk |
| Hours | Business hours |

### WhatsApp Contact (Task 39)
| Feature | Value |
|---------|-------|
| URL | wa.me/94XXXXXXXXX |
| Icon | WhatsApp green icon |
| Text | "Chat on WhatsApp" |
| Open | New tab |

### Contact Form (Task 40)
| Field | Required |
|-------|----------|
| Name | Yes |
| Email | Yes |
| Phone | Optional |
| Message | Yes |

### Phone Input (Task 43)
| Feature | Value |
|---------|-------|
| Prefix | +94 (fixed) |
| Format | XX XXX XXXX |
| Validate | Sri Lanka mobile |

### Form Submit (Task 45)
| Step | Action |
|------|--------|
| 1 | Validate fields |
| 2 | Show loading |
| 3 | POST to API |
| 4 | Handle response |
| 5 | Show success/error |

### Form Success (Task 46)
| Element | Content |
|---------|---------|
| Icon | Checkmark |
| Title | "Message Sent!" |
| Text | "We'll get back to you soon" |
| Action | Reset form |

### FAQ Page (Task 47)
| Layout | Description |
|--------|-------------|
| Top | Search bar |
| Left | Categories (optional) |
| Main | Accordion items |

### FAQ Accordion (Task 48)
| Feature | Value |
|---------|-------|
| Component | Radix Accordion |
| Type | Single or multiple |
| Animation | Smooth expand |

### FAQ Item (Task 49)
| Element | Style |
|---------|-------|
| Question | Trigger button |
| Answer | Content panel |
| Icon | Plus/minus or chevron |

### FAQ Categories (Task 50)
| Category | Example |
|----------|---------|
| Orders | Order-related FAQs |
| Shipping | Delivery questions |
| Returns | Return policy |
| Payment | Payment methods |

### FAQ Search (Task 51)
| Feature | Description |
|---------|-------------|
| Input | Search box |
| Filter | Real-time filter |
| Highlight | Match highlight |
| Empty | No results message |
