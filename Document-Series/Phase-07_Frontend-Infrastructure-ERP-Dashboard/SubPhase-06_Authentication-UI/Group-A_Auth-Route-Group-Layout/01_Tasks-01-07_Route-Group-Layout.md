# Tasks 01-07: Route Group and Layout Structure

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 06 - Authentication UI  
> **Group:** A - Auth Route Group & Layout  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-08-14_Auth-Components-Metadata.md](02_Tasks-08-14_Auth-Components-Metadata.md)

---

## Document Overview

This document covers the creation of the authentication route group with a centered layout component. It establishes the foundational structure for all authentication pages, including the (auth) route group setup, layout component creation, brand styling, background patterns, and essential auth UI components like AuthCard, AuthLogo, and AuthFooter.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create (auth) Route Group | Low | 15 min |
| 02 | Create Auth Layout Component | Low | 20 min |
| 03 | Design Auth Layout Styling | Low | 25 min |
| 04 | Add Auth Background Pattern | Low | 20 min |
| 05 | Create Auth Card Component | Low | 20 min |
| 06 | Create Auth Logo Component | Low | 15 min |
| 07 | Create Auth Footer Component | Low | 20 min |

---

## Task 01: Create (auth) Route Group

### Overview
Create the `(auth)` route group in the Next.js App Router. The parentheses notation creates a folder that doesn't add to the URL path but allows for shared layouts. This pattern ensures all authentication pages (login, register, forgot-password) share the same layout without affecting their URL structure.

### Dependencies
- SubPhase-05 (Form Components & Validation) must be complete
- Next.js App Router structure is established
- Frontend project is initialized

### Instructions

1. **Navigate to the app directory**
   - Go to `frontend/app/` directory
   - This is the root of the App Router structure

2. **Create the (auth) route group folder**
   - Create a new directory named `(auth)` (including parentheses)
   - The parentheses indicate this is a route group
   - Files inside will not add `/auth` to URLs

3. **Understand route group behavior**
   - `app/(auth)/login/page.tsx` → `/login` (not `/auth/login`)
   - `app/(auth)/register/page.tsx` → `/register`
   - Route groups organize routes without affecting URL structure

4. **Verify route group creation**
   - Confirm `frontend/app/(auth)/` directory exists
   - Ensure proper naming with parentheses

### Route Group Purpose

| Feature | Benefit |
|---------|---------|
| Shared Layout | All auth pages use same centered layout |
| Clean URLs | No `/auth` prefix in URLs |
| Separation | Isolated from dashboard layout |
| Organization | Groups related pages together |

### Directory Structure
```
frontend/app/
├── (auth)/              # Auth route group
│   └── layout.tsx       # (Created in Task 02)
├── (dashboard)/         # (Created in other SubPhases)
└── layout.tsx           # Root layout
```

### URL Mapping Example

| File Path | URL Path |
|-----------|----------|
| `app/(auth)/login/page.tsx` | `/login` |
| `app/(auth)/register/page.tsx` | `/register` |
| `app/(auth)/forgot-password/page.tsx` | `/forgot-password` |

### Expected Outcome
- Route group folder created with proper naming convention
- Foundation for shared authentication layout
- Organized structure for auth-related pages

### Verification Checklist
- [ ] `frontend/app/(auth)/` directory exists
- [ ] Directory name includes parentheses
- [ ] Located directly under `app/` directory

---

## Task 02: Create Auth Layout Component

### Overview
Create the layout component for the authentication route group. This layout provides a consistent structure for all authentication pages, featuring a centered design with the LCC logo at the top, main content area in the center, and footer links at the bottom.

### Dependencies
- Task 01: Create (auth) Route Group

### Instructions

1. **Create layout.tsx file**
   - Navigate to `frontend/app/(auth)/` directory
   - Create new file named `layout.tsx`
   - This layout wraps all pages in the (auth) route group

2. **Import required dependencies**
   - Import React types (ReactNode)
   - Import components from Step 06 and 07 (AuthLogo, AuthFooter)
   - Import any Tailwind CSS utilities

3. **Define layout metadata**
   - Export metadata object with page title
   - Set title to "Authentication | LankaCommerce Cloud"
   - Configure description for SEO

4. **Create layout component structure**
   - Define default export function `AuthLayout`
   - Accept `children` prop of type `ReactNode`
   - Return JSX structure with main sections

5. **Implement three-section layout**
   - Top section: AuthLogo component
   - Center section: children (page content)
   - Bottom section: AuthFooter component

6. **Add responsive container**
   - Wrap content in container for proper spacing
   - Ensure mobile-first responsive design
   - Center content horizontally and vertically

### Layout Structure

```
┌─────────────────────────────────────┐
│            AuthLogo                 │
│                                     │
│                                     │
│      ┌─────────────────┐           │
│      │                 │           │
│      │    {children}   │           │
│      │   (Auth Pages)  │           │
│      │                 │           │
│      └─────────────────┘           │
│                                     │
│                                     │
│           AuthFooter                │
└─────────────────────────────────────┘
```

### Layout Component Props

| Prop | Type | Description |
|------|------|-------------|
| children | ReactNode | Page content to render |

### Layout Sections

| Section | Component | Position | Purpose |
|---------|-----------|----------|---------|
| Header | AuthLogo | Top | Brand identity |
| Main | children | Center | Page content |
| Footer | AuthFooter | Bottom | Links and info |

### Expected Outcome
- Functional layout component for auth pages
- Three-section structure (logo, content, footer)
- Proper TypeScript typing for props
- Ready to receive page content as children

### Verification Checklist
- [ ] `frontend/app/(auth)/layout.tsx` file created
- [ ] Layout component exports properly
- [ ] Accepts children prop correctly
- [ ] Three sections defined (logo, content, footer)
- [ ] Metadata configured for SEO

---

## Task 03: Design Auth Layout Styling

### Overview
Apply comprehensive styling to the authentication layout using Tailwind CSS and LCC brand colors. Create a visually appealing, centered design that reflects the brand identity while maintaining excellent user experience across all device sizes.

### Dependencies
- Task 02: Create Auth Layout Component

### Instructions

1. **Define brand color scheme**
   - Use LCC primary blue (#0066CC or equivalent)
   - Use LCC secondary colors for accents
   - Ensure proper contrast ratios for accessibility

2. **Style the main container**
   - Apply `min-h-screen` for full viewport height
   - Use flexbox (`flex flex-col`) for vertical layout
   - Center content with `justify-center items-center`

3. **Apply background styling**
   - Set background color using brand colors
   - Prepare for gradient or pattern overlay (Task 04)
   - Ensure background doesn't interfere with readability

4. **Style the logo section**
   - Add padding for proper spacing
   - Center logo horizontally
   - Ensure visibility against background

5. **Style the content section**
   - Apply flex-grow to center content vertically
   - Add padding for mobile devices
   - Set maximum width for content area

6. **Style the footer section**
   - Position at bottom of viewport
   - Add padding for breathing room
   - Ensure legibility with proper colors

7. **Add responsive adjustments**
   - Define breakpoints (sm, md, lg)
   - Adjust spacing for mobile, tablet, desktop
   - Test on various screen sizes

### Brand Color Palette

| Color | Usage | Tailwind Class |
|-------|-------|----------------|
| Primary Blue | Main brand color | `bg-blue-600` |
| Light Blue | Background tint | `bg-blue-50` |
| Dark Blue | Text, accents | `text-blue-900` |
| White | Cards, forms | `bg-white` |
| Gray | Borders, secondary text | `text-gray-600` |

### Layout Styling Breakdown

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `min-h-screen flex flex-col` | Full height, vertical layout |
| Background | `bg-gradient-to-br from-blue-50 to-blue-100` | Subtle gradient |
| Logo Section | `py-8 flex justify-center` | Spacing and centering |
| Content | `flex-grow flex items-center justify-center px-4` | Centered content |
| Footer | `py-6 text-center` | Bottom spacing |

### Responsive Design Strategy

```
Mobile (< 640px)
├── Padding: px-4, py-6
├── Card Width: 100% (with padding)
└── Font Size: Base

Tablet (640px - 1024px)
├── Padding: px-6, py-8
├── Card Width: max-w-md
└── Font Size: Base

Desktop (> 1024px)
├── Padding: px-8, py-10
├── Card Width: max-w-lg
└── Font Size: Slightly larger
```

### Accessibility Considerations

| Aspect | Implementation |
|--------|----------------|
| Contrast Ratio | Minimum 4.5:1 for text |
| Focus Indicators | Visible focus rings |
| Color Blindness | Don't rely solely on color |
| Screen Readers | Proper semantic HTML |

### Expected Outcome
- Professionally styled authentication layout
- Consistent brand appearance
- Responsive design across all devices
- High contrast and accessibility compliance

### Verification Checklist
- [ ] Brand colors applied correctly
- [ ] Layout centers content vertically and horizontally
- [ ] Responsive on mobile, tablet, and desktop
- [ ] Proper spacing and padding applied
- [ ] Contrast ratios meet accessibility standards
- [ ] Logo, content, and footer sections styled appropriately

---

## Task 04: Add Auth Background Pattern

### Overview
Enhance the authentication layout with a subtle background pattern or gradient to add visual interest while maintaining focus on the authentication forms. The pattern should be non-intrusive, brand-aligned, and improve the overall aesthetic appeal.

### Dependencies
- Task 03: Design Auth Layout Styling

### Instructions

1. **Choose background approach**
   - Option A: CSS gradient (simple, performant)
   - Option B: SVG pattern (more complex, customizable)
   - Option C: Combination of both
   - Consider performance and visual impact

2. **Implement gradient background (Option A)**
   - Use Tailwind gradient utilities
   - Create multi-stop gradient with brand colors
   - Apply to layout container or dedicated background div

3. **Create SVG pattern (Option B)**
   - Design subtle geometric pattern
   - Use brand colors with low opacity
   - Save as inline SVG or external file

4. **Apply pattern to layout**
   - Add as background layer behind content
   - Use CSS `background-image` or pseudo-elements
   - Ensure pattern doesn't interfere with readability

5. **Adjust opacity and scale**
   - Set pattern opacity to 5-15% for subtlety
   - Scale appropriately for different screen sizes
   - Test contrast with overlaying content

6. **Add animation (optional)**
   - Consider subtle CSS animation for pattern
   - Keep animations minimal to avoid distraction
   - Test performance on lower-end devices

### Background Pattern Options

| Pattern Type | Complexity | Performance | Customization |
|--------------|------------|-------------|---------------|
| Solid Color | Very Low | Excellent | Limited |
| Linear Gradient | Low | Excellent | Medium |
| Radial Gradient | Low | Excellent | Medium |
| Geometric Pattern | Medium | Good | High |
| Animated Gradient | Medium | Good | High |

### Gradient Examples

```
Simple Two-Color
└── from-blue-50 to-blue-100

Multi-Stop Gradient
└── bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50

Radial Gradient
└── bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
```

### SVG Pattern Approach

| Step | Description |
|------|-------------|
| 1. Create SVG | Design geometric shapes (circles, lines) |
| 2. Set Dimensions | Define viewBox and pattern repeat |
| 3. Apply Colors | Use brand colors with low opacity |
| 4. Export | Inline in component or separate file |
| 5. Apply | Set as background-image in CSS |

### Pattern Placement

```
┌──────────────────────────────────────┐
│ ░░░░░░░ Background Pattern ░░░░░░░  │
│ ░                                 ░  │
│ ░    ┌─────────────────┐        ░  │
│ ░    │                 │        ░  │
│ ░    │   Auth Card     │        ░  │
│ ░    │   (No Pattern)  │        ░  │
│ ░    │                 │        ░  │
│ ░    └─────────────────┘        ░  │
│ ░                                 ░  │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
└──────────────────────────────────────┘
```

### Performance Considerations

| Concern | Solution |
|---------|----------|
| Large SVG | Optimize with SVGO |
| Animation | Use CSS transforms, not JavaScript |
| Mobile | Simplify pattern for small screens |
| Loading | Inline critical patterns |

### Expected Outcome
- Visually appealing background that enhances layout
- Subtle pattern that doesn't distract from forms
- Brand-consistent colors and styling
- Responsive across all devices

### Verification Checklist
- [ ] Background pattern or gradient applied
- [ ] Pattern uses brand colors
- [ ] Opacity set appropriately (subtle, not overwhelming)
- [ ] Pattern doesn't interfere with form readability
- [ ] Performance tested on various devices
- [ ] Responsive scaling works correctly

---

## Task 05: Create Auth Card Component

### Overview
Create a reusable AuthCard component that wraps authentication form content in a styled card container. This component provides consistent spacing, shadows, borders, and background styling for all authentication forms throughout the application.

### Dependencies
- Task 03: Design Auth Layout Styling

### Instructions

1. **Create auth components directory**
   - Navigate to `frontend/components/` directory
   - Create new directory named `auth`
   - This will house all authentication UI components

2. **Create AuthCard component file**
   - Create `AuthCard.tsx` in `components/auth/` directory
   - Set up TypeScript React functional component structure

3. **Define component props interface**
   - Create `AuthCardProps` interface
   - Include `children` prop (ReactNode)
   - Include optional `className` prop for additional styling

4. **Implement card container**
   - Create styled div as card wrapper
   - Apply white background with shadow
   - Add border radius for rounded corners

5. **Apply card styling**
   - Set padding for internal spacing (p-6 to p-8)
   - Add box shadow (shadow-lg or shadow-xl)
   - Set border with subtle gray color
   - Set maximum width (max-w-md)

6. **Add responsive adjustments**
   - Adjust padding for mobile vs desktop
   - Ensure card scales properly on all screen sizes
   - Test with various content sizes

7. **Implement className merging**
   - Allow custom classes to be passed via props
   - Use `cn()` utility or similar for class merging
   - Ensure custom classes don't override critical styles

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| children | ReactNode | Yes | - | Form content to display |
| className | string | No | "" | Additional CSS classes |

### Card Styling Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Background | `bg-white` | Clean, readable surface |
| Shadow | `shadow-xl` | Elevation effect |
| Border | `border border-gray-200` | Subtle definition |
| Radius | `rounded-lg` | Modern appearance |
| Padding | `p-6 md:p-8` | Breathing room |
| Width | `w-full max-w-md` | Responsive sizing |

### Card Structure

```
┌─────────────────────────────────────┐
│   ┌─────────────────────────────┐  │ ← Outer padding
│   │                             │  │
│   │         {children}          │  │ ← Card content
│   │     (Form components)       │  │
│   │                             │  │
│   └─────────────────────────────┘  │
└─────────────────────────────────────┘
    ← Shadow & border
```

### Usage Example

```
<AuthCard>
  <AuthHeading title="Login" />
  <LoginForm />
</AuthCard>
```

### Expected Outcome
- Reusable card component for auth forms
- Consistent styling across all auth pages
- Proper spacing and visual hierarchy
- Responsive design support

### Verification Checklist
- [ ] `frontend/components/auth/AuthCard.tsx` file created
- [ ] Component accepts children and className props
- [ ] Card has white background with shadow
- [ ] Border and border radius applied
- [ ] Padding and max-width configured
- [ ] Component exports properly
- [ ] TypeScript types defined correctly

---

## Task 06: Create Auth Logo Component

### Overview
Create the AuthLogo component that displays the LankaCommerce Cloud logo in the authentication layout. This component handles logo display with proper sizing, positioning, and optional link back to the homepage.

### Dependencies
- Task 02: Create Auth Layout Component

### Instructions

1. **Create AuthLogo component file**
   - Create `AuthLogo.tsx` in `components/auth/` directory
   - Set up React functional component structure

2. **Import logo asset**
   - Import LCC logo image or SVG
   - Ensure logo file exists in public or assets directory
   - Use appropriate import method (Next.js Image)

3. **Define component props (optional)**
   - Create props interface if customization needed
   - Consider size prop (small, medium, large)
   - Consider link prop (enable/disable homepage link)

4. **Implement logo display**
   - Use Next.js Image component for optimization
   - Set appropriate width and height
   - Add alt text for accessibility ("LankaCommerce Cloud Logo")

5. **Add homepage link (optional)**
   - Wrap logo in Next.js Link component
   - Link to homepage ("/") or landing page
   - Add hover effect for interactivity

6. **Apply logo styling**
   - Center logo horizontally
   - Add margin or padding for spacing
   - Set appropriate dimensions for auth context

7. **Create responsive sizing**
   - Smaller logo on mobile devices
   - Larger logo on desktop
   - Maintain aspect ratio

### Component Props (Optional)

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| size | "sm" \| "md" \| "lg" | No | "md" | Logo size variant |
| withLink | boolean | No | true | Enable homepage link |
| className | string | No | "" | Additional classes |

### Logo Sizing Guide

| Size | Mobile | Tablet | Desktop | Use Case |
|------|--------|--------|---------|----------|
| Small | 80px | 100px | 120px | Compact layout |
| Medium | 100px | 120px | 150px | Standard auth |
| Large | 120px | 150px | 180px | Prominent display |

### Logo Display Structure

```
┌────────────────────────────┐
│                            │
│    ┌──────────────────┐   │
│    │                  │   │
│    │   LCC Logo       │   │
│    │   (Image/SVG)    │   │
│    │                  │   │
│    └──────────────────┘   │
│                            │
└────────────────────────────┘
       ↑ Centered ↑
```

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Alt Text | "LankaCommerce Cloud Logo" |
| Role | `role="img"` if SVG |
| Link | Descriptive aria-label if linked |

### Expected Outcome
- Reusable logo component for auth pages
- Properly optimized and sized logo display
- Optional homepage link functionality
- Responsive sizing across devices

### Verification Checklist
- [ ] `frontend/components/auth/AuthLogo.tsx` file created
- [ ] Logo image imported correctly
- [ ] Next.js Image component used for optimization
- [ ] Alt text provided for accessibility
- [ ] Logo centered horizontally
- [ ] Responsive sizing implemented
- [ ] Component exports properly

---

## Task 07: Create Auth Footer Component

### Overview
Create the AuthFooter component that displays footer content in the authentication layout, including links to privacy policy, terms of service, and copyright information. This component provides consistent footer content across all authentication pages.

### Dependencies
- Task 02: Create Auth Layout Component

### Instructions

1. **Create AuthFooter component file**
   - Create `AuthFooter.tsx` in `components/auth/` directory
   - Set up React functional component structure

2. **Define footer structure**
   - Create container div with proper styling
   - Plan layout for links and copyright text
   - Use flexbox or grid for responsive layout

3. **Add footer links**
   - Privacy Policy link (href: `/privacy`)
   - Terms of Service link (href: `/terms`)
   - Help/Support link (href: `/help`)
   - Use Next.js Link component

4. **Add copyright text**
   - Display current year dynamically
   - Include company name (LankaCommerce Cloud)
   - Format: "© 2026 LankaCommerce Cloud. All rights reserved."

5. **Style footer links**
   - Apply text color (text-gray-600)
   - Add hover effects (hover:text-blue-600)
   - Set proper spacing between links
   - Use separator characters ("|" or "•")

6. **Implement responsive layout**
   - Stack vertically on mobile
   - Display horizontally on tablet and desktop
   - Adjust spacing for different screen sizes

7. **Add accessibility features**
   - Ensure sufficient contrast ratios
   - Add proper focus indicators
   - Use semantic HTML elements

### Component Structure

```
┌─────────────────────────────────────┐
│  Privacy | Terms | Help             │
│  © 2026 LankaCommerce Cloud         │
└─────────────────────────────────────┘
```

### Footer Links

| Link Text | Destination | Purpose |
|-----------|-------------|---------|
| Privacy Policy | `/privacy` | Privacy information |
| Terms of Service | `/terms` | Usage terms |
| Help | `/help` | Support center |

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `text-center py-6 border-t` | Separation and spacing |
| Links Container | `flex gap-4 justify-center mb-2` | Link arrangement |
| Link | `text-sm text-gray-600 hover:text-blue-600` | Link styling |
| Copyright | `text-xs text-gray-500` | Copyright text |

### Responsive Behavior

```
Mobile (< 640px)
├── Links: Vertical stack
├── Spacing: gap-2
└── Alignment: Centered

Desktop (≥ 640px)
├── Links: Horizontal row
├── Spacing: gap-4
└── Alignment: Centered
```

### Dynamic Copyright Year

| Approach | Implementation |
|----------|----------------|
| JavaScript | `new Date().getFullYear()` |
| React | `{new Date().getFullYear()}` |
| Static | Update annually (not recommended) |

### Expected Outcome
- Functional footer component with links and copyright
- Responsive layout for all device sizes
- Proper link styling with hover effects
- Dynamic copyright year display

### Verification Checklist
- [ ] `frontend/components/auth/AuthFooter.tsx` file created
- [ ] Privacy Policy link implemented
- [ ] Terms of Service link implemented
- [ ] Help link implemented
- [ ] Copyright text with dynamic year
- [ ] Links use Next.js Link component
- [ ] Responsive layout on mobile and desktop
- [ ] Proper hover effects applied
- [ ] Component exports properly
- [ ] Accessibility features implemented

---

## Summary

This document established the foundational structure for the authentication UI, including the route group setup, layout component with brand styling, background pattern, and essential reusable components (AuthCard, AuthLogo, AuthFooter). These elements provide a consistent, professional appearance for all authentication pages.

### Completed Tasks
1. ✓ Created (auth) route group for organized routing
2. ✓ Created auth layout component with three-section structure
3. ✓ Designed layout styling with LCC brand colors
4. ✓ Added subtle background pattern/gradient
5. ✓ Created AuthCard component for form wrapping
6. ✓ Created AuthLogo component for brand display
7. ✓ Created AuthFooter component with links and copyright

### Next Steps
Proceed to [02_Tasks-08-14_Auth-Components-Metadata.md](02_Tasks-08-14_Auth-Components-Metadata.md) to create remaining authentication components (AuthHeading, AuthDivider, SocialLoginButtons, AuthAlert, AuthLoading) and configure page metadata.
