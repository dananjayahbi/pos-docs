# Tasks 78-82: Social Links, Bottom Section, and Payment Icons

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 02 - Storefront Layout  
> **Group:** E - Footer Components  
> **Document:** 02 of 02  
> **Tasks Covered:** 78, 79, 80, 81, 82

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-69-77_Footer-Links-Newsletter.md](01_Tasks-69-77_Footer-Links-Newsletter.md)
- **← Previous Group:** [../Group-D_Mobile-Navigation/](../Group-D_Mobile-Navigation/)
- **→ Next Group:** [../Group-F_Floating-Elements-Testing/](../Group-F_Floating-Elements-Testing/)

---

## Document Overview

This document covers the final components of the footer: social media links, the bottom section containing copyright information, and payment method icons. These elements complete the footer by providing social media engagement opportunities and displaying trust indicators for payment security.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 78 | Create Social Links Section | Low | 25 min |
| 79 | Create Social Icon Link | Low | 20 min |
| 80 | Create Footer Bottom Section | Low | 20 min |
| 81 | Create Copyright Text | Low | 15 min |
| 82 | Create Payment Icons | Low | 30 min |

---

## Task 78: Create Social Links Section

### Overview
Create the FooterSocial component that displays a collection of social media links with icons. This section helps customers connect with the store on various social platforms including Facebook, Instagram, Twitter/X, WhatsApp, and YouTube. The icons are arranged horizontally with proper spacing and hover effects.

### Dependencies
- Task 71: Create Footer Top Section

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/storefront/layout/Footer/` directory
   - Create `FooterSocial.tsx` file

2. **Import required dependencies**
   - Import SocialIconLink component (created in Task 79)
   - Import social media icons from Lucide React
   - Import React types

3. **Define social links configuration**
   - Create array of social media platforms
   - Include platform name, URL, and icon
   - Support Facebook, Instagram, Twitter, WhatsApp, YouTube

4. **Add section title**
   - Display "Follow Us" or "Connect With Us"
   - Use appropriate heading level (h3 or h4)
   - Style: text-sm or text-base, font-semibold, text-white

5. **Create icon container**
   - Use flexbox for horizontal layout
   - Add gap between icons (gap-4)
   - Center or left-align based on design

6. **Render social icon links**
   - Map through social links array
   - Render SocialIconLink for each platform
   - Pass platform data as props

7. **Apply responsive behavior**
   - Horizontal layout on all screen sizes
   - Stack or wrap if too many icons
   - Adjust icon size for mobile (smaller) and desktop (larger)

8. **Add section description (optional)**
   - Include text like "Stay connected for updates"
   - Place below title
   - Style: text-sm, text-gray-400

9. **Style the section**
   - Consistent spacing with other footer sections
   - Proper margin top if in separate row (mt-8)
   - Maintain dark theme colors

10. **Export component**
    - Export FooterSocial as default
    - Export social links configuration
    - Add to index.ts

### Component Structure

```
┌──────────────────────────────────────┐
│  Follow Us                           │
│                                      │
│  Stay connected for latest updates   │
│                                      │
│  [f] [📷] [🐦] [💬] [▶]             │
│  FB   IG    X    WA   YT            │
└──────────────────────────────────────┘
```

### Social Media Platforms

| Platform | Icon | URL Format | Priority |
|----------|------|------------|----------|
| Facebook | Facebook | https://facebook.com/yourstore | High |
| Instagram | Instagram | https://instagram.com/yourstore | High |
| Twitter/X | Twitter | https://twitter.com/yourstore | Medium |
| WhatsApp | MessageCircle | https://wa.me/94771234567 | High (SL) |
| YouTube | Youtube | https://youtube.com/@yourstore | Medium |

### Social Links Configuration

```typescript
{
  name: string;      // Platform name
  href: string;      // Profile URL
  icon: LucideIcon;  // Icon component
  label: string;     // Aria label
}
```

### Layout Structure

| Element | Style | Purpose |
|---------|-------|---------|
| Container | flex flex-col | Vertical layout |
| Title | text-base font-semibold text-white | Section heading |
| Description | text-sm text-gray-400 | Optional subtext |
| Icons Row | flex gap-4 items-center | Horizontal icons |

### Icon Configuration

| Platform | Icon Component | ARIA Label |
|----------|---------------|------------|
| Facebook | `<Facebook />` | "Follow us on Facebook" |
| Instagram | `<Instagram />` | "Follow us on Instagram" |
| Twitter/X | `<Twitter />` | "Follow us on Twitter" |
| WhatsApp | `<MessageCircle />` | "Chat with us on WhatsApp" |
| YouTube | `<Youtube />` | "Subscribe on YouTube" |

### WhatsApp Integration (Sri Lanka Specific)

For Sri Lankan businesses, WhatsApp is crucial for customer communication:

| Element | Value |
|---------|-------|
| Phone Number | +94 77 123 4567 (example) |
| URL Format | https://wa.me/94771234567 |
| Message | Optional pre-filled message |
| Label | "Chat with us on WhatsApp" |

### Responsive Behavior

| Breakpoint | Layout | Icon Size | Gap |
|------------|--------|-----------|-----|
| Mobile (<768px) | Horizontal row | w-5 h-5 | gap-3 |
| Tablet (768-1024px) | Horizontal row | w-5 h-5 | gap-4 |
| Desktop (>1024px) | Horizontal row | w-6 h-6 | gap-4 |

### Section Positioning

The social links section can be positioned in two ways:

**Option 1: In Footer Top Grid (Column 4 or below newsletter)**
```
┌──────┬──────┬──────┬──────────┐
│ Logo │Links │Links │Newsletter│
│      │      │      │          │
│      │      │      │ Social   │
└──────┴──────┴──────┴──────────┘
```

**Option 2: Separate Row Below Grid**
```
┌──────┬──────┬──────┬──────────┐
│ Logo │Links │Links │Newsletter│
└──────┴──────┴──────┴──────────┘
┌──────────────────────────────┐
│     Social Icons (Centered)   │
└──────────────────────────────┘
```

### Expected Outcome
- Social links section with title
- Icons for all major platforms
- WhatsApp integration for Sri Lankan customers
- Horizontal icon layout
- Proper spacing and alignment
- Renders SocialIconLink components

### Verification Checklist
- [ ] `FooterSocial.tsx` created
- [ ] Section title "Follow Us" displayed
- [ ] Social links array configured
- [ ] Facebook, Instagram, Twitter, WhatsApp, YouTube included
- [ ] Maps through links and renders SocialIconLink
- [ ] Icons arranged horizontally
- [ ] Proper gap between icons
- [ ] Responsive icon sizes
- [ ] WhatsApp link uses correct format
- [ ] ARIA labels configured

---

## Task 79: Create Social Icon Link

### Overview
Create the SocialIconLink component that renders individual social media icons with links. This component handles hover effects, accessibility features, and ensures all social links open in new tabs with proper security attributes.

### Dependencies
- Task 78: Create Social Links Section

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/storefront/layout/Footer/` directory
   - Create `SocialIconLink.tsx` file

2. **Import required dependencies**
   - Import Link component from Next.js
   - Import LucideIcon type
   - Import React types

3. **Define component props**
   - Accept href (string) for social profile URL
   - Accept icon (LucideIcon) component
   - Accept label (string) for accessibility
   - Optional size prop for icon dimensions

4. **Create link wrapper**
   - Use Next.js Link or standard anchor tag
   - Set target="_blank" for external links
   - Add rel="noopener noreferrer" for security

5. **Render icon**
   - Display the icon component passed as prop
   - Set icon size (w-5 h-5 default, configurable)
   - Apply icon color (text-gray-400)

6. **Apply base styling**
   - Circular or square background (bg-white/10 or transparent)
   - Padding if using background (p-2 or p-3)
   - Rounded corners if using background (rounded-full or rounded-lg)

7. **Add hover effects**
   - Hover background color (hover:bg-white/20)
   - Hover icon color (hover:text-white)
   - Scale animation (hover:scale-110)
   - Smooth transitions (transition-all duration-200)

8. **Implement accessibility**
   - Add aria-label with platform name
   - Ensure keyboard focusable
   - Visible focus ring (focus:ring-2 focus:ring-white)

9. **Add platform-specific hover colors (optional)**
   - Facebook: hover:bg-blue-600 hover:text-white
   - Instagram: hover:bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600
   - Twitter: hover:bg-sky-500 hover:text-white
   - WhatsApp: hover:bg-green-500 hover:text-white
   - YouTube: hover:bg-red-600 hover:text-white

10. **Handle icon size variants**
    - Small: w-4 h-4 (mobile)
    - Medium: w-5 h-5 (default)
    - Large: w-6 h-6 (desktop)

11. **Export component**
    - Export SocialIconLink as default
    - Add to index.ts

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| href | string | Yes | - | Social profile URL |
| icon | LucideIcon | Yes | - | Icon component |
| label | string | Yes | - | ARIA label |
| size | 'sm' \| 'md' \| 'lg' | No | 'md' | Icon size |
| className | string | No | - | Additional styles |

### Icon Sizes

| Size | Dimensions | Padding | Use Case |
|------|-----------|---------|----------|
| sm | w-4 h-4 | p-2 | Mobile, compact |
| md | w-5 h-5 | p-2.5 | Default |
| lg | w-6 h-6 | p-3 | Desktop, emphasis |

### Styling States

| State | Background | Icon Color | Scale |
|-------|-----------|-----------|-------|
| Default | bg-white/10 or transparent | text-gray-400 | 1 |
| Hover | bg-white/20 or platform color | text-white | 1.1 |
| Focus | Same as default | text-gray-400 | 1 |
| Focus Ring | - | - | ring-2 ring-white |
| Active | bg-white/30 | text-white | 0.95 |

### Platform-Specific Colors (Optional Enhancement)

| Platform | Hover Background | Hover Text |
|----------|-----------------|------------|
| Facebook | bg-[#1877F2] | text-white |
| Instagram | bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] | text-white |
| Twitter/X | bg-[#1DA1F2] | text-white |
| WhatsApp | bg-[#25D366] | text-white |
| YouTube | bg-[#FF0000] | text-white |

### Link Security Attributes

| Attribute | Value | Purpose |
|-----------|-------|---------|
| target | _blank | Opens in new tab |
| rel | noopener noreferrer | Security: prevents access to window.opener |

### Accessibility Requirements

| Requirement | Implementation |
|-------------|----------------|
| ARIA Label | aria-label="Follow us on [Platform]" |
| Focus State | Visible focus ring |
| Keyboard Nav | Native link tab order |
| Screen Reader | Announces platform and action |

### Animation Specifications

| Animation | Property | Duration | Easing |
|-----------|----------|----------|--------|
| Hover Scale | transform: scale(1.1) | 200ms | ease-in-out |
| Color Transition | background-color, color | 200ms | ease-in-out |
| Focus Ring | box-shadow | 150ms | ease |

### Usage Examples

**Basic Usage (Neutral Style):**
```typescript
<SocialIconLink 
  href="https://facebook.com/yourstore"
  icon={Facebook}
  label="Follow us on Facebook"
/>
```

**With Platform Colors:**
```typescript
<SocialIconLink 
  href="https://instagram.com/yourstore"
  icon={Instagram}
  label="Follow us on Instagram"
  className="hover:bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600"
/>
```

### Expected Outcome
- Reusable social icon link component
- Smooth hover animations
- Platform-specific styling (optional)
- Opens links in new tab
- Accessible with ARIA labels
- Keyboard navigable with focus states
- Scale animation on hover

### Verification Checklist
- [ ] `SocialIconLink.tsx` created
- [ ] Accepts href, icon, and label props
- [ ] Renders icon component
- [ ] Link opens in new tab (target="_blank")
- [ ] Security attributes added (rel="noopener noreferrer")
- [ ] ARIA label configured
- [ ] Hover effects working (background and color change)
- [ ] Scale animation on hover
- [ ] Focus ring visible
- [ ] Smooth transitions applied
- [ ] Platform-specific colors (optional)
- [ ] Icon size variants supported

---

## Task 80: Create Footer Bottom Section

### Overview
Create the FooterBottom component that contains the copyright text and payment method icons. This section uses a slightly lighter background than the footer top, creating visual separation. The layout is responsive, stacking vertically on mobile and displaying in a row on desktop.

### Dependencies
- Task 69: Create Footer Component

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/storefront/layout/Footer/` directory
   - Create `FooterBottom.tsx` file

2. **Import required components**
   - Import FooterContainer
   - Import Copyright component (created in Task 81)
   - Import PaymentIcons component (created in Task 82)
   - Import React types

3. **Create section wrapper**
   - Use semantic HTML (div or section)
   - Apply background color slightly lighter than footer top (bg-gray-800 vs bg-gray-900)
   - Add border-top for subtle separation (border-t border-gray-700)

4. **Set up responsive layout**
   - Mobile: flex-col (stacked vertically)
   - Desktop: flex-row (side by side)
   - Use Tailwind breakpoints (flex flex-col md:flex-row)

5. **Arrange child components**
   - Left side: Copyright component
   - Right side: PaymentIcons component
   - Center align vertically (items-center)

6. **Add spacing and alignment**
   - Space between elements (justify-between)
   - Gap on mobile (gap-4)
   - Padding using FooterContainer (py-4 or py-6)

7. **Apply text alignment**
   - Mobile: center align (text-center)
   - Desktop: left align for copyright, right align for payment icons

8. **Ensure consistent styling**
   - Text size: text-sm
   - Text color: text-gray-400
   - Maintain footer theme

9. **Add responsive padding**
   - Smaller padding than footer top (py-4 vs py-12)
   - Consistent with footer bottom's compact nature

10. **Export component**
    - Export FooterBottom as default
    - Add to index.ts

### Layout Structure

**Desktop Layout:**
```
┌────────────────────────────────────────────────────────┐
│                                                        │
│  © 2026 LankaCommerce.     [VISA] [MC] [PayHere] [💵] │
│  All rights reserved.                                  │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Mobile Layout:**
```
┌──────────────────────────┐
│                          │
│  © 2026 LankaCommerce.   │
│  All rights reserved.    │
│                          │
│  [VISA] [MC] [PayHere]   │
│  [💵] [Bank]             │
│                          │
└──────────────────────────┘
```

### Component Structure

| Element | Position | Alignment | Content |
|---------|----------|-----------|---------|
| Container | Full width | - | FooterContainer wrapper |
| Inner Wrapper | Flex container | justify-between items-center | Copyright + Payment |
| Copyright | Left (desktop), center (mobile) | Left/Center | Copyright component |
| Payment Icons | Right (desktop), center (mobile) | Right/Center | PaymentIcons component |

### Styling Specifications

| Element | Background | Border | Padding |
|---------|-----------|--------|---------|
| Section | bg-gray-800 | border-t border-gray-700 | py-4 md:py-6 |
| Container | - | - | px-4 md:px-8 |
| Inner Flex | - | - | gap-4 |

### Responsive Behavior

| Breakpoint | Layout Direction | Text Align | Gap |
|------------|-----------------|------------|-----|
| Mobile (<768px) | column | center | gap-4 |
| Tablet (768-1024px) | row | left/right | gap-0 |
| Desktop (>1024px) | row | left/right | gap-0 |

### Background Color Hierarchy

| Section | Background | Purpose |
|---------|-----------|---------|
| Footer Top | bg-gray-900 | Main footer content |
| Footer Bottom | bg-gray-800 | Lighter separation for legal info |
| Site Background | bg-white or bg-gray-50 | Main content area |

### Expected Outcome
- Footer bottom section with lighter background
- Responsive layout (stacked on mobile, row on desktop)
- Copyright text on left
- Payment icons on right
- Subtle border separation from footer top
- Compact padding compared to footer top

### Verification Checklist
- [ ] `FooterBottom.tsx` created
- [ ] Uses FooterContainer for width constraints
- [ ] Background color applied (bg-gray-800)
- [ ] Border-top added (border-gray-700)
- [ ] Responsive flex layout (flex-col md:flex-row)
- [ ] Copyright component included
- [ ] PaymentIcons component included
- [ ] Justify-between for spacing
- [ ] Items-center for vertical alignment
- [ ] Works on mobile and desktop
- [ ] Compact padding (py-4 or py-6)

---

## Task 81: Create Copyright Text

### Overview
Create the Copyright component that displays the copyright notice with the current year and company name. This component dynamically updates the year to always show the current year, ensuring the copyright information stays accurate without manual updates.

### Dependencies
- Task 80: Create Footer Bottom Section

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/storefront/layout/Footer/` directory
   - Create `Copyright.tsx` file

2. **Import required dependencies**
   - Import React
   - No external dependencies needed (pure component)

3. **Get current year dynamically**
   - Use JavaScript Date object to get current year
   - Create constant: `const currentYear = new Date().getFullYear()`
   - This ensures year updates automatically

4. **Create copyright text**
   - Format: "© [Year] [Company Name]. All rights reserved."
   - Example: "© 2026 LankaCommerce. All rights reserved."
   - Use semantic HTML (paragraph or span)

5. **Add company name prop (optional)**
   - Accept company name as prop for flexibility
   - Default to "LankaCommerce" if not provided
   - Makes component reusable

6. **Apply text styling**
   - Text size: text-sm
   - Text color: text-gray-400
   - Font weight: normal (not bold)

7. **Add hover effect (optional)**
   - Hover color: text-gray-300
   - Smooth transition
   - Subtle feedback

8. **Include additional links (optional)**
   - Privacy Policy link
   - Terms of Service link
   - Separated by vertical bars (|) or bullets (•)

9. **Ensure responsive text**
   - Mobile: Smaller text or same size
   - Desktop: Standard size
   - Center align on mobile, left align on desktop

10. **Export component**
    - Export Copyright as default
    - Add to index.ts

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| companyName | string | No | "LankaCommerce" | Company name in copyright |
| className | string | No | - | Additional styles |
| showLinks | boolean | No | false | Show privacy/terms links |

### Copyright Formats

**Basic Format:**
```
© 2026 LankaCommerce. All rights reserved.
```

**With Additional Text:**
```
© 2026 LankaCommerce Cloud. All rights reserved.
```

**With Links:**
```
© 2026 LankaCommerce. All rights reserved. | Privacy Policy | Terms of Service
```

### Dynamic Year Implementation

The year should be generated dynamically:

```typescript
const currentYear = new Date().getFullYear();
// Always shows current year: 2026, 2027, etc.
```

### Text Styling

| Property | Value | Purpose |
|----------|-------|---------|
| Size | text-sm | Compact legal text |
| Color | text-gray-400 | Subtle, not prominent |
| Weight | font-normal | Standard weight |
| Hover | hover:text-gray-300 | Subtle feedback |

### Additional Links (Optional)

If `showLinks` prop is true, include:

| Link | Route | Text |
|------|-------|------|
| Privacy Policy | /privacy | "Privacy Policy" |
| Terms of Service | /terms | "Terms of Service" |
| Cookies | /cookies | "Cookie Policy" |

**Format with links:**
```
© 2026 LankaCommerce. All rights reserved. | Privacy Policy | Terms of Service
```

### Responsive Behavior

| Breakpoint | Alignment | Size |
|------------|-----------|------|
| Mobile | text-center | text-xs or text-sm |
| Desktop | text-left | text-sm |

### Accessibility

| Feature | Implementation |
|---------|----------------|
| Semantic HTML | Use `<p>` or `<small>` |
| Copyright Symbol | Use © entity or Unicode |
| Link Accessibility | Underline on focus |

### International Considerations

For multi-language support (future):

| Language | Copyright Text |
|----------|---------------|
| English | "All rights reserved." |
| Sinhala | "සියලු හිමිකම් ඇවිරිණි." |

### Expected Outcome
- Copyright component with dynamic year
- Company name displayed
- "All rights reserved" text
- Optional links to legal pages
- Proper styling and color
- Responsive alignment

### Verification Checklist
- [ ] `Copyright.tsx` created
- [ ] Current year generated dynamically
- [ ] Company name displayed (LankaCommerce)
- [ ] "All rights reserved" text included
- [ ] Text-sm size applied
- [ ] Text-gray-400 color applied
- [ ] Optional links implemented (if needed)
- [ ] Responsive alignment (center on mobile, left on desktop)
- [ ] Hover effect added
- [ ] Component accepts optional props

---

## Task 82: Create Payment Icons

### Overview
Create the PaymentIcons component that displays accepted payment method logos including credit cards (Visa, Mastercard), local payment gateways (PayHere), cash on delivery, and bank transfer options. This builds trust by showing customers the available payment options upfront. Special emphasis on Sri Lankan payment methods like PayHere.

### Dependencies
- Task 80: Create Footer Bottom Section

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/storefront/layout/Footer/` directory
   - Create `PaymentIcons.tsx` file

2. **Import required dependencies**
   - Import Image component from Next.js
   - Import icons from Lucide React (Banknote, Building2, CreditCard)
   - Import React types

3. **Define payment methods array**
   - Create array of payment method objects
   - Include name, logo/icon, and type
   - Support both image logos and icon components

4. **Add international payment methods**
   - Visa (logo image)
   - Mastercard (logo image)
   - American Express (optional)

5. **Add Sri Lankan payment methods**
   - PayHere (logo image - prominently displayed)
   - Cash on Delivery (COD icon)
   - Bank Transfer (bank icon)

6. **Create payment icons container**
   - Use flexbox for horizontal layout
   - Add gap between icons (gap-3 or gap-4)
   - Wrap icons if needed (flex-wrap)

7. **Render image-based logos**
   - Use Next.js Image component
   - Set appropriate width and height (h-6 or h-8)
   - Add grayscale filter by default
   - Remove filter on hover (hover:grayscale-0)

8. **Render icon-based payment methods**
   - Use Lucide icons for COD and bank transfer
   - Apply gray color (text-gray-400)
   - Add background (bg-white/10) and padding
   - Rounded corners (rounded)

9. **Add hover effects**
   - Image logos: remove grayscale, slight scale
   - Icon buttons: lighter background, white color
   - Smooth transitions

10. **Apply responsive behavior**
    - Mobile: smaller icons (h-5)
    - Desktop: larger icons (h-6 or h-8)
    - Stack or wrap if too many icons

11. **Add section label (optional)**
    - Display "We Accept" or "Payment Methods"
    - Position above icons
    - Style: text-xs text-gray-500

12. **Ensure accessibility**
    - Alt text for logo images
    - ARIA labels for icon buttons
    - Descriptive text for screen readers

13. **Export component**
    - Export PaymentIcons as default
    - Export payment methods configuration
    - Add to index.ts

### Payment Methods Structure

**Sri Lankan E-Commerce Context:**
| Method | Type | Priority | Display |
|--------|------|----------|---------|
| PayHere | Gateway | High | Logo image |
| Visa | Card | High | Logo image |
| Mastercard | Card | High | Logo image |
| Cash on Delivery (COD) | Cash | High | Icon |
| Bank Transfer | Banking | Medium | Icon |

### Payment Methods Array

```typescript
{
  name: string;           // "Visa", "PayHere", "COD"
  type: 'image' | 'icon'; // Display type
  src?: string;           // Image path (for logos)
  icon?: LucideIcon;      // Icon component (for COD, bank)
  alt: string;            // Alt text / ARIA label
}
```

### Layout Structure

**Desktop:**
```
┌─────────────────────────────────────────────┐
│ We Accept:                                  │
│                                             │
│ [VISA] [MC] [PayHere] [💵 COD] [🏦 Bank]   │
└─────────────────────────────────────────────┘
```

**Mobile:**
```
┌──────────────────────┐
│    We Accept:        │
│                      │
│ [VISA] [MC] [PayHere]│
│ [💵 COD] [🏦 Bank]   │
└──────────────────────┘
```

### Icon Specifications

| Payment Method | Type | Size | Filter | Hover |
|----------------|------|------|--------|-------|
| Visa Logo | Image | h-6 | grayscale | grayscale-0 scale-105 |
| Mastercard Logo | Image | h-6 | grayscale | grayscale-0 scale-105 |
| PayHere Logo | Image | h-7 | none | scale-105 |
| COD Icon | Lucide | w-8 h-6 | text-gray-400 | text-white bg-white/20 |
| Bank Icon | Lucide | w-8 h-6 | text-gray-400 | text-white bg-white/20 |

### PayHere Integration (Sri Lanka Specific)

PayHere is the leading payment gateway in Sri Lanka:

| Feature | Value |
|---------|-------|
| Logo Position | Prominent (slightly larger) |
| Logo Size | h-7 (slightly larger than others) |
| Filter | No grayscale (show in color) |
| Priority | Display first or second |

### Icon-Based Payments

For COD and Bank Transfer, use icon buttons:

| Element | Style |
|---------|-------|
| Container | bg-white/10 rounded px-2 py-1 |
| Icon | w-5 h-5 text-gray-400 |
| Hover | bg-white/20 text-white |
| Transition | transition-all duration-200 |

### Logo Image Sources

Payment logos should be stored in:
```
public/images/payment/
├── visa.svg
├── mastercard.svg
├── payhere.svg
└── amex.svg (optional)
```

### Accessibility Requirements

| Element | Attribute | Value |
|---------|-----------|-------|
| Image | alt | "Visa", "Mastercard", "PayHere" |
| Icon | aria-label | "Cash on Delivery", "Bank Transfer" |
| Container | role | "list" or "img" |
| Section | aria-label | "Accepted payment methods" |

### Responsive Behavior

| Breakpoint | Icon Height | Gap | Wrap |
|------------|------------|-----|------|
| Mobile | h-5 | gap-2 | flex-wrap |
| Tablet | h-6 | gap-3 | flex-wrap |
| Desktop | h-6 or h-7 | gap-4 | no-wrap |

### Hover Animation

| Property | Default | Hover |
|----------|---------|-------|
| Grayscale (logos) | grayscale(100%) | grayscale(0%) |
| Scale | scale(1) | scale(1.05) |
| Background (icons) | bg-white/10 | bg-white/20 |
| Color (icons) | text-gray-400 | text-white |
| Duration | - | 200ms |

### Label Options

If including a label above icons:

| Label Text | Style |
|-----------|-------|
| "We Accept" | text-xs text-gray-500 mb-2 |
| "Payment Methods" | text-xs text-gray-500 mb-2 |
| "Secure Payments" | text-xs text-gray-500 mb-2 |

### Trust Indicators

Consider adding:
- "Secure Checkout" badge
- SSL padlock icon
- "100% Secure" text

### Expected Outcome
- Payment icons component with multiple methods
- International cards (Visa, Mastercard)
- Sri Lankan payment gateway (PayHere - prominent)
- Cash on Delivery option
- Bank transfer option
- Grayscale effect with hover to color
- Responsive icon sizing
- Proper accessibility labels

### Verification Checklist
- [ ] `PaymentIcons.tsx` created
- [ ] Payment methods array configured
- [ ] Visa and Mastercard logos included
- [ ] PayHere logo included (slightly larger)
- [ ] COD icon included (Banknote)
- [ ] Bank transfer icon included (Building2)
- [ ] Image logos use Next.js Image component
- [ ] Grayscale filter applied by default
- [ ] Hover removes grayscale and scales
- [ ] Icon-based payments have background
- [ ] Responsive icon sizing
- [ ] Flexbox layout with gap
- [ ] Alt text for images
- [ ] ARIA labels for icons
- [ ] Optional "We Accept" label
- [ ] Logos stored in public/images/payment/

---

## Summary

This document completed the footer components with:

- **Social Links Section** (Task 78): Social media links container with title
- **Social Icon Link** (Task 79): Individual social icon with hover effects and accessibility
- **Footer Bottom Section** (Task 80): Bottom container with lighter background
- **Copyright Text** (Task 81): Dynamic copyright with current year
- **Payment Icons** (Task 82): Payment method logos including PayHere for Sri Lankan customers

Together with Document 01, the complete footer is now implemented with:
- Main footer structure and container
- Logo, description, and address
- Organized navigation link columns
- Newsletter subscription form
- Social media links
- Copyright and legal information
- Payment method trust indicators

The footer provides comprehensive navigation, engagement opportunities, and trust signals for the e-commerce storefront.
