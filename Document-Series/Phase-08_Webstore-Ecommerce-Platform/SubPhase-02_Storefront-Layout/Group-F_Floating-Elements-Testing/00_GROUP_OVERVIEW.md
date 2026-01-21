# Group F: Floating Elements & Testing

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 02 - Storefront Layout  
> **Group:** F of F  
> **Tasks Covered:** 83-94  
> **Group Goal:** Create floating WhatsApp button, scroll-to-top, cookie consent, and final testing

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Footer-Components](../Group-E_Footer-Components/)
- **→ Next Group:** None (Last Group) | **Next SubPhase:** [SubPhase-03_Product-Catalog-Pages](../../SubPhase-03_Product-Catalog-Pages/)

---

## Group Overview

This group creates floating elements and final testing. Creates WhatsApp floating button with icon, click handler, and tooltip. Creates scroll-to-top button with visibility logic. Creates floating buttons container. Creates cookie consent banner with accept logic. Creates layout component exports. Creates layout documentation. Performs final verification and testing.

### Key Outcomes

- WhatsApp float button
- WhatsApp icon
- WhatsApp click handler
- WhatsApp tooltip
- Scroll to top button
- Scroll to top logic
- Floating buttons container
- Cookie consent banner
- Cookie consent logic
- Layout component exports
- Layout documentation
- Final verification complete

### Technology Context

- **WhatsApp:** Sri Lankan primary contact
- **GDPR:** Cookie consent compliance
- **Animation:** Framer Motion
- **Storage:** localStorage for consent

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-83-89_WhatsApp-ScrollTop.md` | Create WhatsApp button and scroll-to-top | 83-89 |
| 02 | `02_Tasks-90-94_Cookie-Exports-Testing.md` | Create cookie consent, exports, and final testing | 90-94 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 83 | Create WhatsApp Float Button | Medium | Task 14 |
| 84 | Create WhatsApp Icon | Low | Task 83 |
| 85 | Create WhatsApp Click Handler | Low | Task 83 |
| 86 | Create WhatsApp Tooltip | Low | Task 83 |
| 87 | Create Scroll to Top Button | Low | Task 14 |
| 88 | Create Scroll to Top Logic | Low | Task 87 |
| 89 | Create Floating Buttons Container | Low | Task 88 |
| 90 | Create Cookie Consent Banner | Medium | Task 14 |
| 91 | Create Cookie Consent Logic | Medium | Task 90 |
| 92 | Create Layout Component Exports | Low | Task 91 |
| 93 | Create Layout Documentation | Low | Task 92 |
| 94 | Final Verification & Testing | Low | Task 93 |

---

## Execution Order

```
Task 83: WhatsApp Float Button
    │
    ├──────────┬──────────┬──────────┐
    ▼          ▼          ▼          │
Task 84    Task 85    Task 86       │
(Icon)     (Handler)  (Tooltip)     │
    │          │          │          │
    └──────────┴──────────┘          │
               │                     │
               ▼                     │
         Task 87: Scroll to Top      │
               │                     │
               ▼                     │
         Task 88: Scroll Logic       │
               │                     │
               ▼                     │
         Task 89: Container          │
               │                     │
               └─────────────────────┘
                          │
                          ▼
                    Task 90: Cookie Consent
                          │
                          ▼
                    Task 91: Cookie Logic
                          │
                          ▼
                    Task 92: Exports
                          │
                          ▼
                    Task 93: Documentation
                          │
                          ▼
                    Task 94: Testing
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── storefront/
│       └── layout/
│           ├── Floating/
│           │   ├── WhatsAppButton.tsx
│           │   ├── ScrollToTop.tsx
│           │   ├── FloatingContainer.tsx
│           │   ├── CookieConsent.tsx
│           │   └── index.ts
│           └── index.ts
└── docs/
    └── STOREFRONT_LAYOUT.md
```

---

## Notes for AI Agents

### WhatsApp Float Button (Task 83)
| Feature | Value |
|---------|-------|
| Position | Bottom-right |
| Offset | 20px from edge |
| Size | 56px circle |
| Color | WhatsApp green |
| Z-index | 40 |

### WhatsApp Icon (Task 84)
| Property | Value |
|----------|-------|
| Icon | WhatsApp brand icon |
| Color | White |
| Size | 32px |

### WhatsApp Click Handler (Task 85)
| Feature | Description |
|---------|-------------|
| URL | wa.me/94xxxxxxxxx |
| Message | Pre-filled greeting |
| Target | _blank |
| Analytics | Track click event |

### WhatsApp Tooltip (Task 86)
| Feature | Value |
|---------|-------|
| Text | "Chat with us" |
| Position | Left of button |
| Trigger | Hover |
| Delay | 500ms |

### Scroll to Top Button (Task 87)
| Feature | Value |
|---------|-------|
| Position | Bottom-right (above WhatsApp) |
| Size | 44px circle |
| Icon | ArrowUp |
| Color | Primary |

### Scroll to Top Logic (Task 88)
| Feature | Value |
|---------|-------|
| Show After | 400px scroll |
| Animation | Fade in |
| Behavior | Smooth scroll |
| Speed | 500ms |

### Floating Container (Task 89)
| Feature | Value |
|---------|-------|
| Position | Fixed bottom-right |
| Stack | Vertical |
| Gap | 12px |
| Z-index | 40 |

### Cookie Consent Banner (Task 90)
| Feature | Value |
|---------|-------|
| Position | Bottom of screen |
| Width | Full width |
| Style | Dark background |
| Content | Privacy notice + buttons |

### Cookie Consent Content
| Element | Text |
|---------|------|
| Message | "We use cookies to enhance your experience..." |
| Accept | "Accept All" button |
| Reject | "Reject" button |
| Settings | "Cookie Settings" link |
| Privacy | "Privacy Policy" link |

### Cookie Consent Logic (Task 91)
| Feature | Description |
|---------|-------------|
| Storage | localStorage key |
| Key | lcc-cookie-consent |
| Values | accepted, rejected, custom |
| Expiry | 365 days |
| Hide | After any choice |

### Layout Exports (Task 92)
| Export | Components |
|--------|------------|
| Layout | StoreLayout |
| Header | Header, Logo, Nav, Cart |
| Footer | Footer, Newsletter, Social |
| Mobile | MobileDrawer, MobileNav |
| Floating | WhatsApp, ScrollTop, Cookie |

### Documentation (Task 93)
| Section | Content |
|---------|---------|
| Overview | Layout architecture |
| Components | All component docs |
| Props | Component props |
| Usage | Usage examples |
| Customization | Theme variables |

### Final Testing (Task 94)
| Test | Scenario |
|------|----------|
| Desktop | Header, mega menu, footer |
| Mobile | Drawer, responsive layout |
| Scroll | Sticky header, scroll-to-top |
| Accessibility | Skip links, ARIA |
| WhatsApp | Link opens chat |
| Cookie | Banner shows, accepts, hides |
