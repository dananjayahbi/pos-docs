# Group A: Portal Routes & Layout

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 09 - Customer Portal  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Create customer portal route structure with sidebar navigation and mobile drawer

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_Dashboard-Orders](../Group-B_Dashboard-Orders/)

---

## Group Overview

This group creates the customer portal route structure and layout. Creates portal directory under account. Creates portal layout with sidebar and main content area. Creates routes for dashboard, orders, order detail, addresses, wishlist, reviews, and settings pages. Creates portal sidebar with navigation items and active indicator. Creates mobile navigation drawer. Creates portal header with customer greeting. Creates logout button. Verifies all portal routes are accessible and protected.

### Key Outcomes

- Portal directory
- Portal layout
- Dashboard route
- Orders route
- Order detail route (dynamic)
- Addresses route
- Wishlist route
- Reviews route
- Settings route
- Portal sidebar
- Sidebar nav item
- Active nav indicator
- Mobile nav drawer
- Portal header
- Logout button
- Portal routes verified

### Technology Context

- **Routes:** Nested under /account/
- **Layout:** Sidebar + main area
- **Mobile:** Drawer navigation
- **Protected:** Auth guard required

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-08_Routes-Setup.md` | Create routes for all portal pages | 01-08 |
| 02 | `02_Tasks-09-16_Layout-Navigation.md` | Create layout, sidebar, and verification | 09-16 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create Portal Directory | Low | SubPhase-08 |
| 02 | Create Portal Layout | Medium | Task 01 |
| 03 | Create Dashboard Route | Low | Task 01 |
| 04 | Create Orders Route | Low | Task 01 |
| 05 | Create Order Detail Route | Low | Task 01 |
| 06 | Create Addresses Route | Low | Task 01 |
| 07 | Create Wishlist Route | Low | Task 01 |
| 08 | Create Reviews Route | Low | Task 01 |
| 09 | Create Settings Route | Low | Task 01 |
| 10 | Create Portal Sidebar | Medium | Task 02 |
| 11 | Create Sidebar Nav Item | Low | Task 10 |
| 12 | Create Active Nav Indicator | Low | Task 11 |
| 13 | Create Mobile Nav Drawer | Medium | Task 10 |
| 14 | Create Portal Header | Low | Task 02 |
| 15 | Create Logout Button | Low | Task 10 |
| 16 | Verify Portal Routes | Low | Task 15 |

---

## Execution Order

```
Task 01: Portal Directory
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 02: Portal Layout                                 │
    │                                                  │
    ├────────┬────────┐                                │
    ▼        ▼        │                                │
T-10     T-14        │                                │
(Sidebar)(Header)    │                                │
    │        │        │                                │
    ▼        │        │                                │
T-11        │        │                                │
(NavItem)   │        │                                │
    │        │        │                                │
    ▼        │        │                                │
T-12        │        │                                │
(Active)    │        │                                │
    │        │        │                                │
    ├────────┤        │                                │
    ▼        │        │                                │
T-13     T-15        │                                │
(Mobile)(Logout)     │                                │
    │        │        │                                │
    └────────┘        │                                │
         │            │                                │
    ┌────┴────┬────────┬────────┬────────┬────────┬────┤
    ▼         ▼        ▼        ▼        ▼        ▼    │
T-03      T-04     T-05     T-06     T-07     T-08  T-09
(Dash)   (Orders) (Detail)(Addr)  (Wish)  (Rev)  (Set)
    │         │        │        │        │        │    │
    └─────────┴────────┴────────┴────────┴────────┴────┘
                              │
                              ▼
                        Task 16: Verify
```

---

## Expected Deliverables

```
frontend/
├── app/
│   └── (storefront)/
│       └── account/
│           ├── layout.tsx
│           ├── dashboard/
│           │   └── page.tsx
│           ├── orders/
│           │   ├── page.tsx
│           │   └── [id]/
│           │       └── page.tsx
│           ├── addresses/
│           │   └── page.tsx
│           ├── wishlist/
│           │   └── page.tsx
│           ├── reviews/
│           │   └── page.tsx
│           └── settings/
│               └── page.tsx
└── components/
    └── storefront/
        └── portal/
            └── Layout/
                ├── PortalLayout.tsx
                ├── PortalSidebar.tsx
                ├── SidebarNavItem.tsx
                ├── MobileNavDrawer.tsx
                ├── PortalHeader.tsx
                ├── LogoutButton.tsx
                └── index.ts
```

---

## Notes for AI Agents

### Portal Directory (Task 01)
| Route | Path |
|-------|------|
| Dashboard | /account/dashboard |
| Orders | /account/orders |
| Order Detail | /account/orders/[id] |
| Addresses | /account/addresses |
| Wishlist | /account/wishlist |
| Reviews | /account/reviews |
| Settings | /account/settings |

### Portal Layout (Task 02)
| Area | Content |
|------|---------|
| Sidebar | Navigation (desktop) |
| Header | Greeting, mobile menu |
| Main | Page content |
| Width | Sidebar 250px, main fluid |

### Portal Sidebar (Task 10)
| Nav Item | Icon |
|----------|------|
| Dashboard | LayoutDashboard |
| Orders | Package |
| Addresses | MapPin |
| Wishlist | Heart |
| Reviews | Star |
| Settings | Settings |

### Sidebar Nav Item (Task 11)
| Feature | Description |
|---------|-------------|
| Icon | Left side icon |
| Label | Navigation text |
| Link | Next.js Link |
| Hover | Background highlight |

### Active Nav Indicator (Task 12)
| State | Style |
|-------|-------|
| Active | Background fill + accent border |
| Inactive | No background |
| Detection | usePathname() |

### Mobile Nav Drawer (Task 13)
| Feature | Description |
|---------|-------------|
| Trigger | Hamburger in header |
| Animation | Slide from left |
| Overlay | Dim background |
| Close | X button or outside click |

### Portal Header (Task 14)
| Element | Content |
|---------|---------|
| Greeting | "Hello, [FirstName]" |
| Mobile | Hamburger menu button |
| Desktop | May hide if sidebar shows |

### Logout Button (Task 15)
| Feature | Description |
|---------|-------------|
| Position | Bottom of sidebar |
| Style | Text button with icon |
| Action | Clear tokens, redirect |
