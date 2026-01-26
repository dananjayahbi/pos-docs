# Tasks 90-94: Cookie Consent, Exports & Testing

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 02 - Storefront Layout  
> **Group:** F - Floating Elements & Testing  
> **Document:** 02 of 02  
> **Tasks Covered:** 90, 91, 92, 93, 94

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-83-89_WhatsApp-ScrollTop.md](01_Tasks-83-89_WhatsApp-ScrollTop.md)
- **→ Next SubPhase:** [../../SubPhase-03_Product-Catalog-Pages/](../../SubPhase-03_Product-Catalog-Pages/)

---

## Document Overview

This document covers cookie consent banner, component exports, documentation, and final testing to complete the storefront layout.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 90 | Create Cookie Consent Banner | Medium | 40 min |
| 91 | Create Cookie Consent Logic | Medium | 35 min |
| 92 | Create Layout Component Exports | Low | 20 min |
| 93 | Create Layout Documentation | Low | 45 min |
| 94 | Final Verification & Testing | Low | 60 min |

---

## Task 90: Create Cookie Consent Banner

### Overview
Create GDPR-compliant cookie consent banner at bottom of screen for legal compliance.

### Dependencies
- Task 14: Create StoreLayout Component

### Instructions

1. **Create CookieConsent.tsx**
   - In `frontend/components/storefront/layout/Floating/`
   - Set up functional component
   - Import React, useState, useEffect

2. **Add state**
   - isVisible: boolean (show/hide banner)
   - isLoading: boolean

3. **Define props**
   - privacyPolicyUrl: string (default "/privacy")
   - cookiePolicyUrl: string (default "/cookies")
   - onAccept: callback (optional)
   - onReject: callback (optional)

4. **Implement banner**
   - Position: fixed bottom
   - Width: 100%
   - Background: #1F2937 (dark gray)
   - Text: white/light gray
   - Padding: py-4 px-4 md:px-6
   - Border-top: 1px light
   - Z-index: 50

5. **Create content layout**
   - Flex layout (row on desktop, column on mobile)
   - Left: message text with policy links
   - Right: action buttons
   - Gap for spacing

6. **Add consent message**
   - Text: "We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking 'Accept All', you consent to our use of cookies."
   - Links: Privacy Policy, Cookie Settings

7. **Create action buttons**
   - Accept All: primary style (blue, bold)
   - Reject: outline style (gray border)
   - Cookie Settings: text link
   - Horizontal arrangement with gap

8. **Add accessibility**
   - Semantic HTML
   - ARIA labels
   - Keyboard navigation
   - Focus indicators

9. **Conditional rendering**
   - Show only if no consent stored
   - Hide after choice made

### Banner Layout (Desktop)
```
┌────────────────────────────────────────────────────┐
│ 🍪 Message with links      [Reject] [Accept All]  │
└────────────────────────────────────────────────────┘
```

### Banner Specifications
- Position: Fixed bottom, full width
- Background: #1F2937
- Z-index: 50 (above floating buttons)
- Padding: 16px mobile, 24px desktop

### Component Props
| Prop | Type | Default |
|------|------|---------|
| privacyPolicyUrl | string | "/privacy" |
| cookiePolicyUrl | string | "/cookies" |
| onAccept | () => void | undefined |
| onReject | () => void | undefined |

### Expected Outcome
Banner displays at bottom with message, links, and action buttons. Responsive and accessible.

### Verification Checklist
- [ ] CookieConsent.tsx created
- [ ] Fixed bottom positioning
- [ ] Dark background applied
- [ ] Message and links display
- [ ] Accept/Reject buttons styled
- [ ] Responsive layout works
- [ ] Accessibility attributes added

---

## Task 91: Create Cookie Consent Logic

### Overview
Implement consent storage, checking, and handling user actions with localStorage.

### Dependencies
- Task 90: Create Cookie Consent Banner

### Instructions

1. **Define storage key**
   - Constant: `lcc-cookie-consent`
   - localStorage key for consent data

2. **Create consent interface**
```typescript
interface CookieConsent {
  accepted: boolean;
  categories: {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
    preferences: boolean;
  };
  timestamp: number;
  expiresAt: number;
  version: string;
}
```

3. **Implement checkConsentStatus**
   - Read from localStorage
   - Parse JSON
   - Check if expired
   - Return consent object or null

4. **Add useEffect for init**
   - Check consent on mount
   - Set isVisible based on consent status
   - Hide if valid consent exists

5. **Implement handleAcceptAll**
   - Create consent object (accepted: true, all categories: true)
   - Add timestamp and expiry (365 days)
   - Store in localStorage as JSON
   - Hide banner
   - Call onAccept callback

6. **Implement handleReject**
   - Create consent object (accepted: false, only necessary: true)
   - Add timestamp and expiry
   - Store in localStorage
   - Hide banner
   - Call onReject callback

7. **Handle expiry**
   - Check if consent expired (365 days)
   - Show banner again if expired
   - Clear expired data

8. **Add analytics integration**
   - Track consent events
   - Send to Google Analytics if accepted
   - Apply consent mode

9. **Connect handlers**
   - Accept button → handleAcceptAll
   - Reject button → handleReject
   - Test both flows

### Consent Categories
| Category | Always Enabled | Purpose |
|----------|----------------|---------|
| Necessary | Yes | Essential functionality |
| Analytics | No | Usage tracking |
| Marketing | No | Advertising |
| Preferences | No | User settings |

### Storage Logic
```
User Action → Create Consent Object → Add Timestamp/Expiry → 
Store in localStorage → Hide Banner → Trigger Callback
```

### Expiry
- Standard: 365 days (31,536,000,000 ms)
- Check on mount, clear if expired

### Expected Outcome
User choices persist, banner shows only when needed, consent expires after 365 days.

### Verification Checklist
- [ ] Consent interface defined
- [ ] localStorage key defined
- [ ] checkConsentStatus implemented
- [ ] useEffect checks on mount
- [ ] handleAcceptAll works
- [ ] handleReject works
- [ ] Data stored correctly
- [ ] Banner hides after choice
- [ ] Expiry checked
- [ ] Analytics integration added

---

## Task 92: Create Layout Component Exports

### Overview
Create index.ts export files for all layout component directories.

### Dependencies
- Task 91: Create Cookie Consent Logic

### Instructions

1. **Create Header/index.ts**
   - Navigate to `frontend/components/storefront/layout/Header/`
   - Create index.ts
   - Export: Header, Logo, Navigation, SearchBar, CartButton, UserMenu, AnnouncementBar

2. **Create MobileNav/index.ts**
   - Navigate to `MobileNav/` directory
   - Export: MobileDrawer, MobileMenu, MobileMenuHeader, MobileCategories

3. **Create MegaMenu/index.ts**
   - Navigate to `MegaMenu/` directory
   - Export: MegaMenu, MegaMenuCategories, MegaMenuFeatured, MegaMenuBrands

4. **Create Footer/index.ts**
   - Navigate to `Footer/` directory
   - Export: Footer, FooterLinks, NewsletterSignup, SocialLinks

5. **Create Floating/index.ts**
   - Navigate to `Floating/` directory
   - Export: WhatsAppButton, ScrollToTop, FloatingContainer, CookieConsent

6. **Update layout/index.ts**
   - Main export file for all layout components
   - Export StoreLayout
   - Re-export all subdirectory exports

7. **Use named exports**
   - Format: `export { ComponentName } from './ComponentName'`
   - Or: `export * from './SubDirectory'`

8. **Add comments**
   - Header comment describing exports
   - Group related exports

9. **Verify imports**
   - Test imports work
   - Check TypeScript compilation
   - No circular dependencies

### Export File Structure
```
layout/
├── Header/index.ts
├── MobileNav/index.ts
├── MegaMenu/index.ts
├── Footer/index.ts
├── Floating/index.ts
└── index.ts (main)
```

### Header Index Example
```typescript
/**
 * Header Components
 */
export { Header } from './Header';
export { Logo } from './Logo';
export { Navigation } from './Navigation';
export { SearchBar } from './SearchBar';
export { CartButton } from './CartButton';
export { UserMenu } from './UserMenu';
export { AnnouncementBar } from './AnnouncementBar';
```

### Main Layout Index
```typescript
/**
 * Storefront Layout Components
 */
export { StoreLayout } from './StoreLayout';
export * from './Header';
export * from './MobileNav';
export * from './MegaMenu';
export * from './Footer';
export * from './Floating';
```

### Import Usage
```typescript
// Before
import { Header } from '@/components/storefront/layout/Header/Header';

// After
import { Header } from '@/components/storefront/layout';
```

### Expected Outcome
Centralized exports, clean imports, organized structure.

### Verification Checklist
- [ ] Header/index.ts created
- [ ] MobileNav/index.ts created
- [ ] MegaMenu/index.ts created
- [ ] Footer/index.ts created
- [ ] Floating/index.ts created
- [ ] Main layout/index.ts updated
- [ ] All components exported
- [ ] Comments added
- [ ] Test imports work
- [ ] TypeScript compiles

---

## Task 93: Create Layout Documentation

### Overview
Create comprehensive documentation for storefront layout components.

### Dependencies
- Task 92: Create Layout Component Exports

### Instructions

1. **Create STOREFRONT_LAYOUT.md**
   - Navigate to `frontend/docs/`
   - Create Markdown file
   - Structure with clear headings

2. **Add sections**
   - Overview: Introduction, architecture, features
   - Layout Structure: StoreLayout component, hierarchy
   - Header Components: Docs for each (props, usage)
   - Mobile Navigation: MobileDrawer, menu behavior
   - Mega Menu: Components, hover behavior
   - Footer Components: Footer, links, newsletter, social
   - Floating Elements: WhatsApp, ScrollToTop, Cookie
   - Props Reference: Tables for all components
   - Usage Examples: Basic and advanced
   - Customization: Theme, colors, breakpoints
   - Accessibility: Keyboard, screen reader, ARIA
   - Troubleshooting: Common issues

3. **Document each component**
   - Component name and purpose
   - Props table (name, type, required, default, description)
   - Usage example
   - Customization notes
   - Accessibility features

4. **Add architecture diagram**
```
┌─────────────────────────────────┐
│    AnnouncementBar (optional)   │
├─────────────────────────────────┤
│    Header (Logo, Nav, Search)   │
│    MegaMenu (on hover)          │
├─────────────────────────────────┤
│    Main Content {children}      │
├─────────────────────────────────┤
│    Footer (Links, Newsletter)   │
├─────────────────────────────────┤
│ Floating: ScrollTop, WhatsApp   │
│ CookieConsent (bottom)          │
└─────────────────────────────────┘
```

5. **Add usage examples**
   - Basic StoreLayout usage
   - With custom props
   - Without announcement/header/footer
   - Component imports

6. **Add customization guide**
   - Theme colors (Tailwind config)
   - Layout spacing
   - Breakpoints (sm, md, lg, xl)
   - Logo replacement
   - Navigation configuration

7. **Add accessibility notes**
   - Keyboard navigation (Tab, Enter, Escape)
   - Screen reader support (ARIA labels, landmarks)
   - Focus management
   - Skip to main content

8. **Add troubleshooting**
   - Common issues and solutions
   - Performance tips
   - Debug suggestions

### Documentation Structure
```markdown
# Storefront Layout Documentation

## Table of Contents
1. Overview
2. Architecture
3. Layout Structure
4. Components
   - Header
   - MobileNav
   - MegaMenu
   - Footer
   - Floating
5. Props Reference
6. Usage Examples
7. Customization
8. Accessibility
9. Troubleshooting
```

### Component Documentation Template
```markdown
## ComponentName

### Props
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|

### Usage
```tsx
import { ComponentName } from '@/components/storefront/layout';
<ComponentName prop="value" />
```

### Customization
...

### Accessibility
...
```

### Expected Outcome
Comprehensive documentation covering all components, usage, customization, and accessibility.

### Verification Checklist
- [ ] STOREFRONT_LAYOUT.md created
- [ ] Table of contents added
- [ ] Overview section complete
- [ ] All components documented
- [ ] Props tables included
- [ ] Usage examples added
- [ ] Customization guide complete
- [ ] Accessibility section added
- [ ] Troubleshooting included
- [ ] Well-formatted and readable

---

## Task 94: Final Verification & Testing

### Overview
Comprehensive testing of complete storefront layout across devices, browsers, and scenarios.

### Dependencies
- Task 93: Create Layout Documentation

### Instructions

1. **Test desktop header**
   - Logo links to homepage
   - Navigation links work
   - Search bar functional
   - Cart button correct
   - User menu works
   - Announcement bar displays
   - Hover effects functional

2. **Test mega menu**
   - Appears on hover
   - Smooth animation
   - All links work
   - Featured content displays
   - Closes correctly
   - Keyboard navigation

3. **Test mobile navigation**
   - Hamburger opens drawer
   - Close button works
   - All links accessible
   - Categories expand
   - Drawer closes on overlay click
   - Smooth animations

4. **Test sticky header**
   - Becomes sticky on scroll
   - Smooth transition
   - Correct z-index
   - No layout shift

5. **Test footer**
   - All links work
   - Newsletter signup functional
   - Social links open correctly
   - Mobile layout stacks
   - Copyright year dynamic

6. **Test WhatsApp button**
   - Visible and positioned correctly
   - Tooltip on hover
   - Click opens WhatsApp (correct number)
   - Pre-filled message correct
   - Mobile responsive

7. **Test scroll to top**
   - Hidden initially
   - Appears after 400px scroll
   - Click scrolls smoothly to top
   - Disappears near top

8. **Test cookie consent**
   - Shows on first visit
   - Doesn't show if consent given
   - Accept/Reject work
   - Choices persist
   - Expires correctly

9. **Test responsive breakpoints**
   - 320px (small mobile)
   - 375px (iPhone)
   - 768px (tablet)
   - 1024px (desktop)
   - 1920px (large desktop)
   - No horizontal scroll

10. **Test accessibility**
    - Keyboard navigation (Tab, Enter, Escape)
    - Focus indicators visible
    - Skip to main content
    - Screen reader compatibility
    - Color contrast (4.5:1 minimum)
    - ARIA labels present

11. **Test cross-browser**
    - Chrome, Firefox, Safari, Edge
    - Mobile Safari, Chrome Mobile
    - Check for layout/JS errors

12. **Test performance**
    - Lighthouse score > 90
    - FCP < 1.8s
    - LCP < 2.5s
    - TTI < 3.8s
    - CLS < 0.1
    - Test on slow 3G

13. **Test user flows**
    - Homepage → Category navigation
    - Search products
    - Add to cart
    - Access account menu
    - Newsletter signup
    - WhatsApp contact
    - Mobile menu navigation

14. **Document issues**
    - List bugs found
    - Prioritize (critical, high, medium, low)
    - Note performance issues
    - Document accessibility violations

15. **Verify requirements**
    - All components implemented
    - All features functional
    - Responsive on all devices
    - Accessible (WCAG 2.1 AA)
    - Cross-browser compatible
    - Documentation complete

16. **Create test report**
    - Executive summary
    - Tests performed
    - Issues found
    - Performance results
    - Recommendations
    - Production-ready sign-off

### Testing Checklist

| Component | Desktop | Mobile | Keyboard | Screen Reader | Status |
|-----------|---------|--------|----------|---------------|--------|
| Header | ☐ | ☐ | ☐ | ☐ | |
| Navigation | ☐ | ☐ | ☐ | ☐ | |
| Mega Menu | ☐ | N/A | ☐ | ☐ | |
| Mobile Drawer | N/A | ☐ | ☐ | ☐ | |
| Footer | ☐ | ☐ | ☐ | ☐ | |
| WhatsApp | ☐ | ☐ | ☐ | ☐ | |
| Scroll to Top | ☐ | ☐ | ☐ | ☐ | |
| Cookie Consent | ☐ | ☐ | ☐ | ☐ | |

### Responsive Breakpoints
| Width | Device | Layout | Interactions | Status |
|-------|--------|--------|--------------|--------|
| 320px | iPhone SE | ☐ | ☐ | |
| 768px | iPad | ☐ | ☐ | |
| 1024px | Desktop | ☐ | ☐ | |
| 1920px | Large | ☐ | ☐ | |

### Accessibility Checklist
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Skip to content link
- [ ] Screen reader compatible
- [ ] ARIA labels present
- [ ] Color contrast sufficient
- [ ] Semantic HTML used
- [ ] Form labels present

### Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari
- [ ] Chrome Mobile

### Performance Targets
- [ ] Lighthouse > 90
- [ ] FCP < 1.8s
- [ ] LCP < 2.5s
- [ ] TTI < 3.8s
- [ ] CLS < 0.1

### Test Report Template
```markdown
# SubPhase-02 Final Test Report

**Date:** [Date]
**Status:** Pass/Fail
**Production Ready:** Yes/No

## Tests Performed
- Desktop: Pass/Fail
- Mobile: Pass/Fail
- Responsive: Pass/Fail
- Accessibility: Pass/Fail
- Performance: Pass/Fail
- Cross-browser: Pass/Fail

## Issues Found
[List by priority]

## Performance
- Lighthouse: [Score]
- FCP: [Time]
- LCP: [Time]

## Recommendations
[List improvements]

## Sign-off
Production-ready: Yes/No
Approved by: [Name]
```

### Expected Outcome
All components tested, functional, responsive, accessible, performant, and production-ready.

### Verification Checklist
- [ ] All components tested
- [ ] Responsive on all sizes
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] All browsers tested
- [ ] Performance metrics measured
- [ ] User flows completed
- [ ] Issues documented
- [ ] Test report created
- [ ] Production-ready determined

---

## Summary

This document completed the storefront layout with cookie consent, organized exports, comprehensive documentation, and thorough testing. Layout is production-ready.

### Completed Tasks
1. ✓ Cookie consent banner (GDPR-compliant)
2. ✓ Cookie consent logic (localStorage, expiry)
3. ✓ Component exports (all directories)
4. ✓ Comprehensive documentation
5. ✓ Final verification and testing

### SubPhase-02 Complete
Storefront layout includes responsive header, mega menu, mobile navigation, footer, floating elements (WhatsApp, scroll-to-top), cookie consent, complete documentation, and testing.

### Next Steps
Proceed to **SubPhase-03 Product Catalog Pages** for product listings, category pages, product details, filtering, sorting, and search.
