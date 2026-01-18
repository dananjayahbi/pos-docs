# SubPhase 02: Storefront Layout - Tasks Summary

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase Index:** 02 of 14  
> **SubPhase Goal:** Create the complete storefront layout with header, footer, navigation, and mobile menu  
> **Total Tasks:** 94 | **Status:** Planning  
> **Estimated Duration:** 10-12 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-01_Webstore-Project-Structure](../SubPhase-01_Webstore-Project-Structure/)
- **→ Next SubPhase:** [SubPhase-03_Product-Catalog-Pages](../SubPhase-03_Product-Catalog-Pages/)

---

## SubPhase Overview

This sub-phase creates the complete storefront layout including header with mega menu, footer with links and social icons, mobile navigation drawer, announcement bar, and floating WhatsApp button.

### Key Outcomes
- Announcement bar (configurable)
- Responsive header with logo and navigation
- Mega menu for categories
- Mobile navigation drawer
- Search bar integration
- Cart icon with count
- Footer with links and social
- Floating WhatsApp button

### Layout Reference
```
┌─────────────────────────────────────────────────────────────┐
│ ANNOUNCEMENT BAR: "Free shipping on orders over ₨5,000"    │
├─────────────────────────────────────────────────────────────┤
│ HEADER                                                      │
│ [Logo]  [Categories ▼]  [Search...]  [Account] [Cart(3)]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                     MAIN CONTENT                            │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ FOOTER                                                      │
│ About | Contact | FAQ | Terms | Privacy                     │
│ © 2026 Store Name. All rights reserved.                     │
│ [WhatsApp Chat Button]                                      │
└─────────────────────────────────────────────────────────────┘
```

### Technology Context
- **Styling:** Tailwind CSS with store theme
- **Icons:** Lucide React icons
- **Animation:** Framer Motion for menu
- **State:** Zustand for UI state

---

## Task Execution Order

```
TASK GROUP A: Layout Shell & Structure (Tasks 01-14)
        │
        ▼
TASK GROUP B: Header Components (Tasks 15-34)
        │
        ▼
TASK GROUP C: Navigation & Mega Menu (Tasks 35-52)
        │
        ▼
TASK GROUP D: Mobile Navigation (Tasks 53-68)
        │
        ▼
TASK GROUP E: Footer Components (Tasks 69-82)
        │
        ▼
TASK GROUP F: Floating Elements & Testing (Tasks 83-94)
```

---

## Task Index

### Group A: Layout Shell & Structure (Tasks 01-14)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create Store Layout Shell** | Main layout wrapper component | SubPhase-01 | 🔴 Not Created |
| 02 | **Create Layout Types** | TypeScript types for layout | Task 01 | 🔴 Not Created |
| 03 | **Create Layout Container** | Responsive container component | Task 01 | 🔴 Not Created |
| 04 | **Create Announcement Bar Component** | Top announcement banner | Task 01 | 🔴 Not Created |
| 05 | **Create Announcement Bar State** | Dismissible state | Task 04 | 🔴 Not Created |
| 06 | **Create Announcement Bar Config** | Configurable message | Task 04 | 🔴 Not Created |
| 07 | **Create Header Placeholder** | Header component slot | Task 01 | 🔴 Not Created |
| 08 | **Create Main Content Wrapper** | Main content area | Task 01 | 🔴 Not Created |
| 09 | **Create Footer Placeholder** | Footer component slot | Task 01 | 🔴 Not Created |
| 10 | **Create Skip to Content Link** | Accessibility skip link | Task 01 | 🔴 Not Created |
| 11 | **Create Layout Scroll Handler** | Scroll position tracking | Task 01 | 🔴 Not Created |
| 12 | **Create Sticky Header Logic** | Header sticky on scroll | Task 11 | 🔴 Not Created |
| 13 | **Create Layout Animation Wrapper** | Page transition wrapper | Task 01 | 🔴 Not Created |
| 14 | **Verify Layout Structure** | Test layout rendering | Task 13 | 🔴 Not Created |

---

### Group B: Header Components (Tasks 15-34)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 15 | **Create Header Component** | Main header container | Task 14 | 🔴 Not Created |
| 16 | **Create Header Types** | Header TypeScript types | Task 15 | 🔴 Not Created |
| 17 | **Create Header Container** | Header inner container | Task 15 | 🔴 Not Created |
| 18 | **Create Logo Component** | Store logo display | Task 15 | 🔴 Not Created |
| 19 | **Create Logo Image Handler** | Logo image with fallback | Task 18 | 🔴 Not Created |
| 20 | **Create Logo Link** | Logo link to homepage | Task 18 | 🔴 Not Created |
| 21 | **Create Header Search** | Search input in header | Task 15 | 🔴 Not Created |
| 22 | **Create Search Icon Button** | Mobile search toggle | Task 21 | 🔴 Not Created |
| 23 | **Create Search Overlay** | Mobile search overlay | Task 22 | 🔴 Not Created |
| 24 | **Create Account Link** | Customer account link | Task 15 | 🔴 Not Created |
| 25 | **Create Account Dropdown** | Account menu dropdown | Task 24 | 🔴 Not Created |
| 26 | **Create Login/Register Links** | Guest user links | Task 25 | 🔴 Not Created |
| 27 | **Create Logged In Menu** | Customer menu options | Task 25 | 🔴 Not Created |
| 28 | **Create Cart Icon Button** | Cart icon with count | Task 15 | 🔴 Not Created |
| 29 | **Create Cart Count Badge** | Item count badge | Task 28 | 🔴 Not Created |
| 30 | **Create Mini Cart Dropdown** | Cart preview dropdown | Task 28 | 🔴 Not Created |
| 31 | **Create Mini Cart Item** | Cart item in dropdown | Task 30 | 🔴 Not Created |
| 32 | **Create Mini Cart Footer** | Subtotal and checkout | Task 30 | 🔴 Not Created |
| 33 | **Create Wishlist Icon** | Wishlist quick access | Task 15 | 🔴 Not Created |
| 34 | **Create Header Actions Group** | Action icons container | Task 33 | 🔴 Not Created |

---

### Group C: Navigation & Mega Menu (Tasks 35-52)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 35 | **Create Desktop Navigation** | Main navigation bar | Task 34 | 🔴 Not Created |
| 36 | **Create Nav Item Component** | Single navigation item | Task 35 | 🔴 Not Created |
| 37 | **Create Nav Link** | Navigation link style | Task 36 | 🔴 Not Created |
| 38 | **Create Has Submenu Indicator** | Dropdown arrow icon | Task 36 | 🔴 Not Created |
| 39 | **Create Mega Menu Container** | Mega menu wrapper | Task 35 | 🔴 Not Created |
| 40 | **Create Mega Menu Panel** | Mega menu content panel | Task 39 | 🔴 Not Created |
| 41 | **Create Mega Menu Categories** | Category columns | Task 40 | 🔴 Not Created |
| 42 | **Create Category Column** | Single category column | Task 41 | 🔴 Not Created |
| 43 | **Create Subcategory Links** | Links within category | Task 42 | 🔴 Not Created |
| 44 | **Create Mega Menu Featured** | Featured product/promo | Task 40 | 🔴 Not Created |
| 45 | **Create Featured Image** | Promotional image | Task 44 | 🔴 Not Created |
| 46 | **Create Mega Menu Animation** | Open/close animation | Task 39 | 🔴 Not Created |
| 47 | **Create Hover Delay Logic** | Prevent menu flicker | Task 46 | 🔴 Not Created |
| 48 | **Create View All Categories Link** | Link to all categories | Task 41 | 🔴 Not Created |
| 49 | **Create Navigation Data Loader** | Fetch navigation data | Task 35 | 🔴 Not Created |
| 50 | **Create Navigation Cache** | Cache navigation data | Task 49 | 🔴 Not Created |
| 51 | **Create Active Nav Indicator** | Current page highlight | Task 36 | 🔴 Not Created |
| 52 | **Verify Desktop Navigation** | Test mega menu | Task 51 | 🔴 Not Created |

---

### Group D: Mobile Navigation (Tasks 53-68)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 53 | **Create Mobile Menu Button** | Hamburger menu toggle | Task 34 | 🔴 Not Created |
| 54 | **Create Hamburger Icon** | Animated hamburger icon | Task 53 | 🔴 Not Created |
| 55 | **Create Mobile Nav Drawer** | Slide-in navigation drawer | Task 53 | 🔴 Not Created |
| 56 | **Create Drawer Backdrop** | Dark overlay behind drawer | Task 55 | 🔴 Not Created |
| 57 | **Create Drawer Header** | Logo and close button | Task 55 | 🔴 Not Created |
| 58 | **Create Close Drawer Button** | Close X button | Task 57 | 🔴 Not Created |
| 59 | **Create Mobile Nav List** | Navigation items list | Task 55 | 🔴 Not Created |
| 60 | **Create Mobile Nav Item** | Single nav item | Task 59 | 🔴 Not Created |
| 61 | **Create Mobile Submenu** | Expandable submenu | Task 60 | 🔴 Not Created |
| 62 | **Create Submenu Toggle** | Expand/collapse button | Task 61 | 🔴 Not Created |
| 63 | **Create Submenu Items** | Submenu links | Task 61 | 🔴 Not Created |
| 64 | **Create Mobile Search** | Search in drawer | Task 55 | 🔴 Not Created |
| 65 | **Create Mobile Account Links** | Login/Account links | Task 55 | 🔴 Not Created |
| 66 | **Create Mobile Contact Info** | Phone, WhatsApp | Task 55 | 🔴 Not Created |
| 67 | **Create Drawer Animation** | Slide animation | Task 55 | 🔴 Not Created |
| 68 | **Verify Mobile Navigation** | Test on mobile | Task 67 | 🔴 Not Created |

---

### Group E: Footer Components (Tasks 69-82)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 69 | **Create Footer Component** | Main footer container | Task 14 | 🔴 Not Created |
| 70 | **Create Footer Container** | Footer inner wrapper | Task 69 | 🔴 Not Created |
| 71 | **Create Footer Top Section** | Main footer content | Task 69 | 🔴 Not Created |
| 72 | **Create Footer Logo Section** | Logo and description | Task 71 | 🔴 Not Created |
| 73 | **Create Footer Links Section** | Link columns | Task 71 | 🔴 Not Created |
| 74 | **Create Footer Link Column** | Single link column | Task 73 | 🔴 Not Created |
| 75 | **Create Footer Link** | Individual footer link | Task 74 | 🔴 Not Created |
| 76 | **Create Footer Newsletter** | Newsletter signup form | Task 71 | 🔴 Not Created |
| 77 | **Create Newsletter Form** | Email input and submit | Task 76 | 🔴 Not Created |
| 78 | **Create Social Links Section** | Social media icons | Task 71 | 🔴 Not Created |
| 79 | **Create Social Icon Link** | Individual social link | Task 78 | 🔴 Not Created |
| 80 | **Create Footer Bottom Section** | Copyright and payment | Task 69 | 🔴 Not Created |
| 81 | **Create Copyright Text** | Copyright notice | Task 80 | 🔴 Not Created |
| 82 | **Create Payment Icons** | Accepted payment methods | Task 80 | 🔴 Not Created |

---

### Group F: Floating Elements & Testing (Tasks 83-94)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 83 | **Create WhatsApp Float Button** | Floating WhatsApp chat | Task 14 | 🔴 Not Created |
| 84 | **Create WhatsApp Icon** | WhatsApp brand icon | Task 83 | 🔴 Not Created |
| 85 | **Create WhatsApp Click Handler** | Open WhatsApp chat | Task 83 | 🔴 Not Created |
| 86 | **Create WhatsApp Tooltip** | Hover tooltip | Task 83 | 🔴 Not Created |
| 87 | **Create Scroll to Top Button** | Scroll to top float | Task 14 | 🔴 Not Created |
| 88 | **Create Scroll to Top Logic** | Show on scroll down | Task 87 | 🔴 Not Created |
| 89 | **Create Floating Buttons Container** | Container for floats | Task 88 | 🔴 Not Created |
| 90 | **Create Cookie Consent Banner** | Cookie notice (GDPR) | Task 14 | 🔴 Not Created |
| 91 | **Create Cookie Consent Logic** | Accept and remember | Task 90 | 🔴 Not Created |
| 92 | **Create Layout Component Exports** | Export all components | Task 91 | 🔴 Not Created |
| 93 | **Create Layout Documentation** | Document all layout | Task 92 | 🔴 Not Created |
| 94 | **Final Verification & Testing** | Test complete layout | Task 93 | 🔴 Not Created |

---

## Expected Final Structure

```
frontend/
├── components/
│   └── storefront/
│       └── layout/
│           ├── StoreLayout.tsx
│           ├── AnnouncementBar/
│           │   ├── AnnouncementBar.tsx
│           │   └── index.ts
│           ├── Header/
│           │   ├── Header.tsx
│           │   ├── Logo.tsx
│           │   ├── HeaderSearch.tsx
│           │   ├── AccountMenu.tsx
│           │   ├── CartIcon.tsx
│           │   ├── MiniCart.tsx
│           │   ├── HeaderActions.tsx
│           │   └── index.ts
│           ├── Navigation/
│           │   ├── DesktopNav.tsx
│           │   ├── NavItem.tsx
│           │   ├── MegaMenu.tsx
│           │   ├── MegaMenuPanel.tsx
│           │   └── index.ts
│           ├── MobileNav/
│           │   ├── MobileMenuButton.tsx
│           │   ├── MobileDrawer.tsx
│           │   ├── MobileNavList.tsx
│           │   ├── MobileNavItem.tsx
│           │   └── index.ts
│           ├── Footer/
│           │   ├── Footer.tsx
│           │   ├── FooterLinks.tsx
│           │   ├── FooterNewsletter.tsx
│           │   ├── FooterSocial.tsx
│           │   ├── FooterBottom.tsx
│           │   └── index.ts
│           ├── Floating/
│           │   ├── WhatsAppButton.tsx
│           │   ├── ScrollToTop.tsx
│           │   ├── CookieConsent.tsx
│           │   └── index.ts
│           └── index.ts
└── types/
    └── store/
        └── layout.ts
```

---

## Responsive Breakpoints

| Breakpoint | Size | Layout Behavior |
|------------|------|-----------------|
| mobile | < 640px | Mobile drawer, stacked |
| tablet | 640-1024px | Condensed header |
| desktop | > 1024px | Full mega menu |

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 94 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 94 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Notes for AI Agents

1. **Execution Order:** Tasks must be executed in numerical order within each group
2. **Mobile First:** Build for mobile first, enhance for desktop
3. **WhatsApp:** Sri Lankan primary contact method
4. **Sticky Header:** Header sticks on scroll
5. **Mega Menu:** Rich navigation with categories and featured
6. **Cart Preview:** Mini cart in header dropdown
7. **Dependencies:** This sub-phase depends on SubPhase-01
8. **No Code Snippets in Tasks:** Individual task documents should focus on descriptions, not implementation code
9. **Accessibility:** Include skip links and ARIA labels
10. **Animation:** Use Framer Motion for smooth transitions
11. **Cookie Consent:** GDPR/CCPA compliance
12. **LKR Currency:** Display cart total in Rupees
