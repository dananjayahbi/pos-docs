# Tasks 83-89: WhatsApp Button & Scroll to Top

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 02 - Storefront Layout  
> **Group:** F - Floating Elements & Testing  
> **Document:** 01 of 02  
> **Tasks Covered:** 83, 84, 85, 86, 87, 88, 89

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-E_Footer-Components/](../Group-E_Footer-Components/)
- **→ Next Document:** [02_Tasks-90-94_Cookie-Exports-Testing.md](02_Tasks-90-94_Cookie-Exports-Testing.md)

---

## Document Overview

This document covers floating elements: WhatsApp contact button and scroll-to-top functionality. WhatsApp is the primary contact method in Sri Lanka.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 83 | Create WhatsApp Float Button | Medium | 30 min |
| 84 | Create WhatsApp Icon | Low | 15 min |
| 85 | Create WhatsApp Click Handler | Low | 20 min |
| 86 | Create WhatsApp Tooltip | Low | 20 min |
| 87 | Create Scroll to Top Button | Low | 25 min |
| 88 | Create Scroll to Top Logic | Low | 25 min |
| 89 | Create Floating Buttons Container | Low | 20 min |

---

## Task 83: Create WhatsApp Float Button

### Overview
Create fixed-position floating WhatsApp button in bottom-right corner for customer support access.

### Dependencies
- Task 14: Create StoreLayout Component

### Instructions

1. **Create Floating directory**
   - Navigate to `frontend/components/storefront/layout/`
   - Create directory `Floating`

2. **Create WhatsAppButton.tsx**
   - In `components/storefront/layout/Floating/`
   - Set up TypeScript React functional component
   - Import React, useState, useEffect

3. **Define props interface**
   - Create `WhatsAppButtonProps` interface
   - phoneNumber: string (required)
   - message: string (optional, pre-filled text)
   - className: string (optional)

4. **Implement button**
   - Fixed position: bottom-right corner
   - Offset: 20px from edges (mobile: 16px)
   - Size: 56px circle (mobile: 48px)
   - Background: WhatsApp green #25D366
   - Shadow: shadow-xl
   - Z-index: 40

5. **Add styling**
   - Hover: scale(1.05) + brightness(1.1)
   - Transition: 200ms smooth
   - Icon: 32px centered white (mobile: 28px)

6. **Add accessibility**
   - aria-label: "Chat with us on WhatsApp"
   - role="button"
   - tabIndex={0}
   - Visible focus indicators

### Component Props
| Prop | Type | Required | Default |
|------|------|----------|---------|
| phoneNumber | string | Yes | - |
| message | string | No | "Hello! I'm interested in your products." |
| className | string | No | "" |

### Specifications
- Position: Fixed bottom-right
- Desktop: 56px × 56px, 20px offset
- Mobile: 48px × 48px, 16px offset
- Background: #25D366
- Z-index: 40

### Expected Outcome
Circular floating button with WhatsApp branding, fixed in bottom-right, responsive, accessible.

### Verification Checklist
- [ ] WhatsAppButton.tsx created
- [ ] Props interface defined
- [ ] Fixed positioning correct
- [ ] Responsive sizing works
- [ ] Hover effects functional
- [ ] Accessibility attributes present

---

## Task 84: Create WhatsApp Icon

### Overview
Create/integrate WhatsApp icon component for the floating button.

### Dependencies
- Task 83: Create WhatsApp Float Button

### Instructions

1. **Choose icon approach**
   - Recommended: react-icons (FaWhatsapp)
   - Alternative: Custom SVG
   - Alternative: lucide-react

2. **Install/import icon**
   - Ensure react-icons installed
   - Import: `import { FaWhatsapp } from 'react-icons/fa'`
   - Or create custom WhatsAppIcon.tsx with SVG

3. **Configure in button**
   - Replace icon placeholder in Task 83
   - Size: 32px (mobile: 28px)
   - Color: white (#FFFFFF)
   - Center within button

4. **Test rendering**
   - Icon displays correctly
   - Scales on mobile
   - High contrast against green background

### Icon Specifications
- Library: react-icons (FaWhatsapp)
- Size: 32px desktop, 28px mobile
- Color: White #FFFFFF
- Position: Centered in button

### Expected Outcome
WhatsApp logo icon displays in button, properly sized and colored.

### Verification Checklist
- [ ] Icon imported/created
- [ ] Displays in WhatsAppButton
- [ ] Correct size (32px/28px)
- [ ] White color applied
- [ ] Centered in button

---

## Task 85: Create WhatsApp Click Handler

### Overview
Implement click handler to open WhatsApp with business number and pre-filled message.

### Dependencies
- Task 83: Create WhatsApp Float Button

### Instructions

1. **Create handler function**
   - Define `handleWhatsAppClick` inside component
   - Accept phoneNumber and message parameters

2. **Format phone number**
   - Remove non-digit characters
   - Add country code +94 if missing
   - Format: 94XXXXXXXXX (no + or spaces)
   - Handle: 0771234567 → 94771234567

3. **Construct WhatsApp URL**
   - Base: `https://wa.me/`
   - Add formatted phone
   - Add message: `?text=URL_ENCODED_MESSAGE`
   - Use encodeURIComponent() for message

4. **Open WhatsApp**
   - Use window.open(url, '_blank')
   - Add noopener, noreferrer for security
   - Opens Web or mobile app

5. **Add analytics (optional)**
   - Track button click event
   - Log interaction

6. **Connect to button**
   - Set onClick handler
   - Test functionality

### WhatsApp URL Format
```
https://wa.me/94771234567?text=Hello!%20I'm%20interested%20in%20your%20products.
```

### Phone Formatting
| Input | Output |
|-------|--------|
| 0771234567 | 94771234567 |
| +94771234567 | 94771234567 |
| 771234567 | 94771234567 |

### Expected Outcome
Click opens WhatsApp with correct number and pre-filled message in new tab.

### Verification Checklist
- [ ] Handler function created
- [ ] Phone formatting works
- [ ] URL constructed correctly
- [ ] Message URL encoded
- [ ] Opens in new tab
- [ ] Security attributes added

---

## Task 86: Create WhatsApp Tooltip

### Overview
Create tooltip showing "Chat with us" on hover over WhatsApp button.

### Dependencies
- Task 83: Create WhatsApp Float Button

### Instructions

1. **Add state management**
   - useState for showTooltip (boolean, default false)
   - useRef for timeout ID

2. **Add hover handlers**
   - onMouseEnter: show tooltip after 500ms delay
   - onMouseLeave: hide immediately, clear timeout

3. **Create tooltip element**
   - Conditional render based on showTooltip
   - Position: absolute, left of button
   - Right offset: calc(100% + 12px)
   - Vertically centered

4. **Style tooltip**
   - Background: #1F2937 (dark gray)
   - Text: white
   - Padding: px-3 py-2
   - Border radius: rounded
   - Font: text-sm
   - Arrow pointing right

5. **Add animation**
   - Fade in: opacity 0 → 1
   - Slide: translateX(10px) → 0
   - Duration: 200ms

6. **Add accessibility**
   - role="tooltip"
   - aria-describedby on button
   - Show on keyboard focus

### Tooltip Specifications
- Text: "Chat with us"
- Position: Left of button, 12px gap
- Background: #1F2937
- Delay: 500ms
- Animation: Fade + slide, 200ms

### Expected Outcome
Tooltip appears after hover delay, positioned left of button, with smooth animation.

### Verification Checklist
- [ ] State management added
- [ ] 500ms delay works
- [ ] Tooltip positioned correctly
- [ ] Styled with dark background
- [ ] Arrow present
- [ ] Animation smooth
- [ ] Hides on mouse leave

---

## Task 87: Create Scroll to Top Button

### Overview
Create scroll-to-top button appearing when user scrolls down, positioned above WhatsApp button.

### Dependencies
- Task 14: Create StoreLayout Component

### Instructions

1. **Create ScrollToTop.tsx**
   - In `components/storefront/layout/Floating/`
   - Set up functional component
   - Import React, useState, useEffect

2. **Add state**
   - isVisible: boolean (default false)
   - Controls button visibility

3. **Define props**
   - showAfter: number (default 400, scroll pixels)
   - className: string (optional)

4. **Implement button**
   - Circular button: 44px × 44px (mobile: 40px)
   - Primary blue background
   - Shadow: shadow-lg
   - Arrow up icon: 20px white (mobile: 18px)

5. **Style button**
   - Hover: scale(1.05) + brightness(1.1)
   - Transition: 200ms
   - Conditional render based on isVisible

6. **Add accessibility**
   - aria-label: "Scroll to top"
   - role="button"
   - Keyboard accessible
   - Focus indicators

### Button Specifications
- Size: 44px × 44px (mobile: 40px)
- Background: Primary blue
- Icon: Arrow up, 20px white
- Show after: 400px scroll
- Position: Above WhatsApp in container

### Expected Outcome
Circular button with arrow icon, hidden by default, accessible.

### Verification Checklist
- [ ] ScrollToTop.tsx created
- [ ] Props interface defined
- [ ] 44px circle styled
- [ ] Arrow up icon added
- [ ] Hover effects work
- [ ] Conditional rendering ready
- [ ] Accessibility attributes added

---

## Task 88: Create Scroll to Top Logic

### Overview
Implement scroll detection to show/hide button and smooth scroll-to-top functionality.

### Dependencies
- Task 87: Create Scroll to Top Button

### Instructions

1. **Add scroll listener**
   - useEffect with scroll event listener
   - Create handleScroll function
   - Clean up on unmount

2. **Implement handleScroll**
   - Get window.pageYOffset
   - Compare with showAfter (400px)
   - Update isVisible: true if > 400px, false otherwise
   - Use functional state update

3. **Optimize performance**
   - Throttle scroll checks (every 100ms)
   - Use requestAnimationFrame
   - useCallback for handler

4. **Create scrollToTop function**
   - window.scrollTo({ top: 0, behavior: 'smooth' })
   - Smooth animation to page top

5. **Connect to button**
   - Set onClick to scrollToTop
   - Test smooth scrolling

6. **Add animations**
   - Fade in when visible: opacity 0 → 1
   - Slide up: translateY(10px) → 0
   - Duration: 300ms

### Scroll Logic
```
Scroll > 400px → Show button (fade in)
Scroll < 400px → Hide button (fade out)
Click button → Smooth scroll to top
```

### Performance Optimization
- Throttle: Check every 100ms
- requestAnimationFrame for smooth updates
- Memoize handler with useCallback

### Expected Outcome
Button appears after 400px scroll, disappears near top, clicking scrolls smoothly to top.

### Verification Checklist
- [ ] Scroll listener added
- [ ] handleScroll updates isVisible
- [ ] Shows after 400px scroll
- [ ] Hides when near top
- [ ] Listener cleaned up
- [ ] scrollToTop function works
- [ ] Smooth scroll behavior
- [ ] Animations functional
- [ ] Performance optimized

---

## Task 89: Create Floating Buttons Container

### Overview
Create container managing positioning and layout of WhatsApp and ScrollToTop buttons.

### Dependencies
- Task 88: Create Scroll to Top Logic

### Instructions

1. **Create FloatingContainer.tsx**
   - In `components/storefront/layout/Floating/`
   - Import WhatsAppButton and ScrollToTop

2. **Define props**
   - whatsappNumber: string (required)
   - whatsappMessage: string (optional)
   - scrollThreshold: number (default 400)
   - className: string (optional)

3. **Implement container**
   - Position: fixed
   - Right: 20px (mobile: 16px)
   - Bottom: 20px (mobile: 16px)
   - Display: flex
   - Flex-direction: column
   - Gap: 12px (mobile: 10px)
   - Align-items: flex-end
   - Z-index: 40

4. **Render children**
   - ScrollToTop (renders first, appears above)
   - WhatsAppButton (renders second, appears below)
   - Pass appropriate props to each

5. **Add responsive adjustments**
   - Mobile: reduced offsets and gap
   - Hide on print media

### Container Structure
```
┌────────────┐
│  ┌──┐      │  ← ScrollToTop
│  │↑ │      │
│  └──┘      │
│    ↕ 12px  │
│  ┌──┐      │  ← WhatsApp
│  │WA│      │
│  └──┘      │
└────────────┘
  ↑ 20px from edges
```

### Component Props
| Prop | Type | Required | Default |
|------|------|----------|---------|
| whatsappNumber | string | Yes | - |
| whatsappMessage | string | No | Default message |
| scrollThreshold | number | No | 400 |

### Specifications
- Position: Fixed bottom-right
- Desktop: 20px offset, 12px gap
- Mobile: 16px offset, 10px gap
- Stack: Vertical (column)
- Z-index: 40

### Expected Outcome
Container manages both buttons, proper spacing, fixed positioning, responsive.

### Verification Checklist
- [ ] FloatingContainer.tsx created
- [ ] Props interface defined
- [ ] Fixed positioning correct
- [ ] Flex column layout
- [ ] 12px gap between buttons
- [ ] ScrollToTop above WhatsApp
- [ ] Responsive adjustments work
- [ ] Hidden in print media
- [ ] Component exports properly

---

## Summary

This document established floating UI elements: WhatsApp button with icon, tooltip, click handler, and scroll-to-top with visibility logic and smooth scrolling. Container manages layout and positioning.

### Completed Tasks
1. ✓ WhatsApp floating button (fixed, responsive, accessible)
2. ✓ WhatsApp icon component
3. ✓ WhatsApp click handler (wa.me URL for Sri Lanka)
4. ✓ Tooltip with hover effect
5. ✓ Scroll-to-top button component
6. ✓ Scroll detection and smooth scroll logic
7. ✓ Floating container managing both buttons

### Next Steps
Proceed to [02_Tasks-90-94_Cookie-Exports-Testing.md](02_Tasks-90-94_Cookie-Exports-Testing.md) for cookie consent, exports, documentation, and final testing.
