# Tasks 31-38: App Directory, Root Components, and Authentication Layout

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 01 - Next.js Project Setup  
> **Group:** C - App Router Structure  
> **Document:** 01 of 02  
> **Tasks Covered:** 31, 32, 33, 34, 35, 36, 37, 38

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-39-46_Dashboard-API-Shared.md](02_Tasks-39-46_Dashboard-API-Shared.md)

---

## Document Overview

This document covers the foundational structure of the Next.js 14+ App Router, including the app directory creation, root-level components (layout, loading, error, not-found), and the authentication route group with its dedicated layout. These elements establish the core routing infrastructure for the entire ERP dashboard application.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 31 | Create app/ Directory Structure | Medium | 15 min |
| 32 | Create Root Layout Component | Medium | 30 min |
| 33 | Configure Root Metadata | Low | 15 min |
| 34 | Create Root Loading Component | Low | 15 min |
| 35 | Create Root Error Component | Low | 20 min |
| 36 | Create Not Found Page | Low | 15 min |
| 37 | Create (auth) Route Group | Low | 10 min |
| 38 | Create (auth) Layout | Medium | 25 min |

---

## Task 31: Create app/ Directory Structure

### Overview
Create the fundamental app/ directory that serves as the root of the Next.js 14+ App Router. This directory replaces the pages/ directory pattern and introduces a new file-based routing system with enhanced capabilities for layouts, loading states, error boundaries, and server components.

### Dependencies
- Task 16: Frontend project initialization complete
- Next.js 14+ installed
- Project root directory established

### Instructions

1. **Navigate to frontend project root**
   - Locate the frontend/ directory in workspace
   - This is where package.json and next.config.js exist
   - Verify Next.js version is 14.0.0 or higher

2. **Create app directory**
   - Create new directory named `app/` at frontend root
   - This becomes the primary routing directory
   - Replaces traditional pages/ directory approach

3. **Understand App Router conventions**
   - Special files: layout.tsx, page.tsx, loading.tsx, error.tsx
   - Route groups: directories with parentheses (auth), (dashboard)
   - API routes: api/ directory with route.ts files
   - Server Components: default rendering mode

4. **Verify directory creation**
   - Confirm app/ directory exists at frontend root
   - Ensure proper capitalization (lowercase 'app')
   - Check directory is empty and ready for components

### App Router Directory Structure

```
frontend/
├── app/                           ← New App Router directory
│   ├── layout.tsx                 (Task 32 - Root layout)
│   ├── page.tsx                   (Future - Home page)
│   ├── loading.tsx                (Task 34 - Loading state)
│   ├── error.tsx                  (Task 35 - Error boundary)
│   ├── not-found.tsx              (Task 36 - 404 page)
│   ├── (auth)/                    (Task 37 - Auth route group)
│   ├── (dashboard)/               (Future - Dashboard routes)
│   └── api/                       (Future - API routes)
├── components/                    (Future - Shared components)
├── lib/                           (Future - Utilities)
├── public/                        (Existing - Static assets)
└── package.json                   (Existing - Dependencies)
```

### App Router vs Pages Router

| Feature | Pages Router (Old) | App Router (New) |
|---------|-------------------|------------------|
| Routing Directory | pages/ | app/ |
| Default Rendering | Client Components | Server Components |
| Layouts | _app.tsx (global only) | layout.tsx (nested) |
| Loading States | Custom implementation | loading.tsx (built-in) |
| Error Handling | _error.tsx (limited) | error.tsx (per-route) |
| Route Groups | Not supported | Supported with (name) |
| Metadata | next/head per page | Metadata API in layout |

### App Router Key Concepts

#### Server Components (Default)
```
Rendering Flow
═══════════════════════════════════════════

┌─────────────────┐
│  Browser Request│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Next.js Server │  ← Component renders here
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   HTML Response │  ← Sent to browser
└─────────────────┘

Benefits:
• Zero JavaScript to client by default
• Direct database/API access
• Improved performance
• Better SEO
```

#### Client Components (Opt-in)
```
Use "use client" directive when needed:
• Browser APIs (window, localStorage)
• React hooks (useState, useEffect)
• Event handlers (onClick, onChange)
• Third-party libraries requiring browser
```

#### Route Groups
```
Route Groups organize without affecting URL

(auth)/                    ← Group name in parentheses
├── login/
│   └── page.tsx          → URL: /login (no /auth)
├── register/
│   └── page.tsx          → URL: /register (no /auth)
└── layout.tsx            → Applies to login & register

Purpose:
• Organize related routes
• Apply shared layouts
• Keep URLs clean
```

### Special Files in App Router

| File | Purpose | Required | When to Use |
|------|---------|----------|-------------|
| layout.tsx | Wraps child routes, persists across navigation | Yes (root) | Shared UI, navigation |
| page.tsx | Renders route content | Yes (for route) | Actual page content |
| loading.tsx | Loading UI during data fetch | No | Async data loading |
| error.tsx | Error boundary for route | No | Error handling |
| not-found.tsx | 404 page | No | Custom 404 UI |
| route.ts | API endpoint | No | API routes |

### Expected Outcome
- app/ directory created in frontend root
- Understanding of App Router concepts
- Foundation for all routing components
- Prepared for Next.js 14+ development

### Verification Checklist
- [ ] app/ directory exists at frontend root
- [ ] Directory is empty and ready for files
- [ ] Next.js 14+ is installed (verify in package.json)
- [ ] Understanding of Server vs Client Components
- [ ] Familiarity with special file conventions
- [ ] Knowledge of route group syntax

---

## Task 32: Create Root Layout Component

### Overview
Create the root layout component (layout.tsx) in the app/ directory. This is the most critical component in the App Router system, serving as the outermost wrapper for the entire application. It must include the `<html>` and `<body>` tags and wraps all pages throughout the application.

### Dependencies
- Task 31: Create app/ Directory Structure
- Task 19: Tailwind CSS configured
- Font configuration (Inter font from next/font/google)

### Instructions

1. **Create layout.tsx file**
   - Create file at `app/layout.tsx`
   - This is a Server Component by default (no "use client")
   - Must export default a React component

2. **Import required dependencies**
   - Import Inter font from 'next/font/google'
   - Import global CSS file (where Tailwind directives exist)
   - Import { ReactNode } type from 'react'

3. **Configure Inter font**
   - Initialize Inter with subsets array including 'latin'
   - Use variable font feature for optimal loading
   - Apply font to html element via className

4. **Define component props interface**
   - Create interface with children prop
   - Type children as ReactNode
   - This represents all nested pages and layouts

5. **Create RootLayout component**
   - Accept children prop
   - Return JSX with html and body elements
   - Must include these semantic HTML tags (required by Next.js)

6. **Configure html element**
   - Set lang attribute to "en-LK" (English-Sri Lanka)
   - Apply Inter font className
   - Suppress hydration warning if needed

7. **Configure body element**
   - Apply antialiased class for better font rendering
   - Add Inter font className variable
   - Include children within body

8. **Add component documentation**
   - Add JSDoc comment explaining root layout purpose
   - Document that this wraps entire application
   - Note Server Component default behavior

### Root Layout Structure

```
┌─────────────────────────────────────────────────┐
│              Root Layout (layout.tsx)            │
│  ┌───────────────────────────────────────────┐  │
│  │  <html lang="en-LK">                      │  │
│  │    <body>                                 │  │
│  │      ┌─────────────────────────────────┐ │  │
│  │      │                                 │ │  │
│  │      │     {children}                  │ │  │
│  │      │                                 │ │  │
│  │      │   (All pages, nested layouts,   │ │  │
│  │      │    route groups rendered here)  │ │  │
│  │      │                                 │ │  │
│  │      └─────────────────────────────────┘ │  │
│  │    </body>                                │  │
│  │  </html>                                  │  │
│  └───────────────────────────────────────────┘  │
│                                                  │
│  Features:                                       │
│  • Font configuration (Inter)                    │
│  • Global styles import                          │
│  • Metadata configuration (Task 33)             │
│  • Wraps entire application                      │
└─────────────────────────────────────────────────┘
```

### Layout Hierarchy

```
Root Layout (app/layout.tsx)
    │
    ├── Auth Layout (app/(auth)/layout.tsx)
    │   └── Login Page (app/(auth)/login/page.tsx)
    │
    ├── Dashboard Layout (app/(dashboard)/layout.tsx)
    │   ├── Dashboard Home (app/(dashboard)/page.tsx)
    │   └── Inventory Page (app/(dashboard)/inventory/page.tsx)
    │
    └── Not Found Page (app/not-found.tsx)

Nesting Behavior:
• Root layout always renders
• Nested layouts compose inside {children}
• Layouts persist during navigation within their segment
• Only page content re-renders on navigation
```

### Root Layout Requirements

| Requirement | Description | Mandatory |
|-------------|-------------|-----------|
| html tag | Must include root html element | Yes |
| body tag | Must include body element | Yes |
| children prop | Must render children prop | Yes |
| Server Component | Default (no "use client") | Recommended |
| Export default | Must be default export | Yes |

### Font Configuration

```
Inter Font Setup
═══════════════════════════════════════

Import:
  import { Inter } from 'next/font/google'

Initialize:
  const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
  })

Apply:
  <html className={inter.variable}>
  <body className={inter.className}>

Benefits:
  • Automatic font optimization
  • Self-hosted (no external requests)
  • Layout shift prevention
  • Variable font support
```

### Global Styles Import

```
Import Location: Top of layout.tsx

import './globals.css'

globals.css contains:
@tailwind base;
@tailwind components;
@tailwind utilities;

Plus custom global styles:
• CSS reset
• Base typography
• Color variables
• Utility classes
```

### Sri Lanka Localization

```
Language Configuration
═══════════════════════════════════════

<html lang="en-LK">
          ↑     ↑
          │     └─ Region: Sri Lanka
          └─ Language: English

Other options:
• "si-LK" - Sinhala
• "ta-LK" - Tamil
• "en-LK" - English (Sri Lanka)

Benefits:
• Proper screen reader behavior
• Search engine localization
• Browser language detection
• Date/number formatting context
```

### Expected Outcome
- Functional root layout component
- Proper HTML structure with html and body tags
- Inter font configured and applied
- Global styles imported
- Foundation for metadata configuration
- Server Component optimization

### Verification Checklist
- [ ] layout.tsx created in app/ directory
- [ ] Inter font imported from next/font/google
- [ ] Font configured with 'latin' subset
- [ ] Global CSS file imported
- [ ] html element includes lang="en-LK"
- [ ] body element includes antialiased class
- [ ] children prop typed as ReactNode
- [ ] children rendered within body element
- [ ] Component exported as default
- [ ] No "use client" directive (Server Component)
- [ ] JSDoc comment added

---

## Task 33: Configure Root Metadata

### Overview
Configure the root metadata for the application using Next.js 14's Metadata API. This includes setting the application title, description, icons, viewport settings, and other meta tags that affect SEO, social sharing, and browser behavior. Root metadata serves as the default for all pages unless overridden.

### Dependencies
- Task 32: Create Root Layout Component
- Understanding of Next.js Metadata API

### Instructions

1. **Import Metadata type**
   - Import { Metadata } type from 'next'
   - This provides TypeScript support for metadata object

2. **Define metadata object**
   - Export const named 'metadata' of type Metadata
   - Place above the RootLayout component
   - This will be automatically detected by Next.js

3. **Configure title**
   - Set title as object with template and default
   - Default: "LankaCommerce Cloud"
   - Template: "%s | LankaCommerce Cloud" for child pages

4. **Configure description**
   - Write comprehensive application description
   - Include key features and target audience
   - Optimize for search engines (150-160 characters)

5. **Configure icons**
   - Set favicon path (/favicon.ico)
   - Configure apple-touch-icon for iOS devices
   - Set icon sizes for various devices

6. **Configure viewport**
   - Set width=device-width for responsive design
   - Set initial-scale=1 for proper zoom behavior
   - Ensure mobile-friendly configuration

7. **Configure Open Graph metadata**
   - Set type as 'website'
   - Configure title and description for social sharing
   - Add locale as 'en_LK' for Sri Lanka
   - Configure image for social previews

8. **Configure Twitter Card metadata**
   - Set card type as 'summary_large_image'
   - Configure title and description
   - Set image for Twitter previews

9. **Configure theme color**
   - Set theme-color for browser chrome (mobile)
   - Match primary brand color
   - Improves mobile web app appearance

10. **Add keywords**
    - List relevant keywords for SEO
    - Include: ERP, POS, inventory, multi-tenant, Sri Lanka
    - Help search engine understanding

### Metadata Structure

```
┌─────────────────────────────────────────────────┐
│            Root Metadata Configuration           │
├─────────────────────────────────────────────────┤
│ Core Meta Tags:                                 │
│  • title (with template)                        │
│  • description                                  │
│  • keywords                                     │
│                                                 │
│ Visual Elements:                                │
│  • icons (favicon, apple-touch-icon)            │
│  • themeColor                                   │
│                                                 │
│ Device Configuration:                           │
│  • viewport (width, initial-scale)              │
│                                                 │
│ Social Sharing:                                 │
│  • openGraph (title, description, image)        │
│  • twitter (card, title, description)           │
└─────────────────────────────────────────────────┘
```

### Metadata Inheritance

```
Metadata Cascade
═══════════════════════════════════════

Root Layout Metadata (app/layout.tsx)
    │
    │  title: "LankaCommerce Cloud"
    │  description: "Multi-tenant ERP..."
    │
    ├── Auth Pages (inherit + override)
    │   │  title: "Login | LankaCommerce Cloud"
    │   └─ description: Same as root
    │
    └── Dashboard Pages (inherit + override)
        │  title: "Dashboard | LankaCommerce Cloud"
        └─ description: Same as root

Override Rules:
• Child metadata merges with parent
• Title template %s replaced with child title
• Explicit values override inherited values
• Arrays and objects replace (not merge)
```

### Metadata Fields Reference

| Field | Type | Purpose | Example |
|-------|------|---------|---------|
| title | string \| object | Page title in browser tab | "LankaCommerce Cloud" |
| description | string | Meta description for SEO | "Multi-tenant ERP system..." |
| keywords | string[] | SEO keywords | ["ERP", "POS", "inventory"] |
| icons | object | Favicon configuration | { icon: '/favicon.ico' } |
| viewport | object | Viewport settings | { width: 'device-width' } |
| themeColor | string | Browser theme color | "#0070f3" |
| openGraph | object | Facebook/LinkedIn preview | { title, description, image } |
| twitter | object | Twitter card preview | { card, title, description } |

### Title Configuration

```
Title Template Usage
═══════════════════════════════════════

Root metadata:
  title: {
    template: '%s | LankaCommerce Cloud',
    default: 'LankaCommerce Cloud'
  }

Child page overwrites:
  • Login page: "Login" → "Login | LankaCommerce Cloud"
  • Dashboard: "Dashboard" → "Dashboard | LankaCommerce Cloud"
  • Inventory: "Inventory" → "Inventory | LankaCommerce Cloud"

No title on root:
  • Shows default: "LankaCommerce Cloud"
```

### Open Graph Configuration

```
Open Graph Meta Tags
═══════════════════════════════════════

Purpose: Control how links appear on social media

Facebook/LinkedIn Post Preview:
┌─────────────────────────────────┐
│  [Preview Image]                │
│                                 │
│  LankaCommerce Cloud            │ ← og:title
│  Multi-tenant ERP system for... │ ← og:description
│  lankacommerce.lk               │ ← og:url
└─────────────────────────────────┘

Required Fields:
• type: 'website'
• title: Application name
• description: Brief summary
• locale: 'en_LK' (Sri Lanka English)

Optional but Recommended:
• images: [{ url, width, height }]
• url: Canonical URL
• siteName: Brand name
```

### Twitter Card Configuration

```
Twitter Card Types
═══════════════════════════════════════

summary_large_image (Recommended):
┌─────────────────────────────────────┐
│  [Large Preview Image]              │
│  ────────────────────────────────   │
│                                     │
│  LankaCommerce Cloud                │
│  Multi-tenant ERP system for Sri... │
│  lankacommerce.lk                   │
└─────────────────────────────────────┘

summary (Compact):
┌────────────────┬────────────────────┐
│  [Small Image] │ LankaCommerce Cloud│
│                │ Multi-tenant ERP...│
│                │ lankacommerce.lk   │
└────────────────┴────────────────────┘

Recommended: 'summary_large_image'
• Better visibility
• More engaging
• Higher click-through rate
```

### Viewport Configuration

```
Viewport Settings
═══════════════════════════════════════

viewport: {
  width: 'device-width',    ← Responsive width
  initialScale: 1,          ← No zoom on load
  maximumScale: 5,          ← Allow zoom to 5x
  userScalable: true,       ← Allow user zoom
}

Mobile Behavior:
• Adapts to device screen width
• Prevents desktop layout on mobile
• Enables pinch-to-zoom
• Ensures accessibility compliance

Browser Support:
✓ All modern browsers
✓ iOS Safari
✓ Android Chrome
✓ Desktop browsers
```

### SEO Best Practices

| Practice | Implementation | Benefit |
|----------|----------------|---------|
| Title length | 50-60 characters | Prevents truncation in search results |
| Description length | 150-160 characters | Optimal preview in SERPs |
| Unique descriptions | Per-page override | Better search ranking |
| Keywords | 5-10 relevant terms | Improved discoverability |
| Locale | en_LK for Sri Lanka | Proper regional targeting |
| Schema markup | Future task | Rich snippets in search |

### Expected Outcome
- Comprehensive root metadata configuration
- Proper SEO meta tags
- Social media preview optimization
- Mobile-friendly viewport settings
- Browser theme color configured
- Foundation for page-level metadata overrides

### Verification Checklist
- [ ] Metadata object exported from layout.tsx
- [ ] Title configured with template and default
- [ ] Description added (150-160 characters)
- [ ] Keywords array defined
- [ ] Favicon path configured
- [ ] Apple touch icon configured
- [ ] Viewport settings defined
- [ ] Open Graph metadata configured
- [ ] Twitter Card metadata configured
- [ ] Theme color set
- [ ] Locale set to 'en_LK'
- [ ] All fields typed correctly with Metadata type

---

## Task 34: Create Root Loading Component

### Overview
Create the root loading component (loading.tsx) that displays while pages or route segments are loading data. This component leverages Next.js 14's built-in loading UI feature, automatically showing when Server Components are fetching data or during page transitions. It provides immediate feedback to users during async operations.

### Dependencies
- Task 31: Create app/ Directory Structure
- Task 19: Tailwind CSS configured

### Instructions

1. **Create loading.tsx file**
   - Create file at `app/loading.tsx`
   - This is a Client Component (needs "use client" for animations)
   - Will be shown during loading states automatically

2. **Add "use client" directive**
   - Add at the top of file (first line)
   - Required for animations and transitions
   - Enables browser-side interactivity

3. **Create Loading component**
   - Export default React component named Loading
   - No props required (standalone component)
   - Returns loading UI elements

4. **Design loading skeleton**
   - Use full-screen container with flex centering
   - Include spinner or skeleton loader
   - Apply subtle animations for better UX

5. **Add loading spinner**
   - Create spinning circular loader
   - Use Tailwind animate-spin utility
   - Style with brand colors

6. **Add loading text**
   - Include "Loading..." text below spinner
   - Use appropriate text size and color
   - Apply subtle fade animation if desired

7. **Consider accessibility**
   - Add aria-label for screen readers
   - Use role="status" for loading announcement
   - Ensure sufficient color contrast

8. **Optimize appearance**
   - Match application theme
   - Use consistent spacing
   - Ensure smooth animation performance

### Loading UI Display Behavior

```
Loading State Triggers
═══════════════════════════════════════

Scenario 1: Server Component Data Fetch
┌──────────────────────────────────────┐
│  User navigates to /dashboard        │
│         ↓                            │
│  loading.tsx shows immediately       │
│         ↓                            │
│  Server fetches data                 │
│         ↓                            │
│  page.tsx renders with data          │
│         ↓                            │
│  loading.tsx disappears              │
└──────────────────────────────────────┘

Scenario 2: Route Transition
┌──────────────────────────────────────┐
│  User clicks link to /inventory      │
│         ↓                            │
│  loading.tsx overlays current page   │
│         ↓                            │
│  New page renders                    │
│         ↓                            │
│  loading.tsx removed                 │
└──────────────────────────────────────┘

Auto-triggered on:
• Page navigation
• Route segment changes
• Server Component suspense
• Async data fetching
```

### Loading Component Structure

```
┌─────────────────────────────────────────────────┐
│            Root Loading UI (loading.tsx)         │
│  ┌───────────────────────────────────────────┐  │
│  │  Full Screen Container                    │  │
│  │  (Centered, vh-100)                       │  │
│  │                                           │  │
│  │          ┌─────────────┐                  │  │
│  │          │             │                  │  │
│  │          │   Spinner   │                  │  │
│  │          │  (Animated) │                  │  │
│  │          │             │                  │  │
│  │          └─────────────┘                  │  │
│  │                                           │  │
│  │          Loading...                       │  │
│  │                                           │  │
│  └───────────────────────────────────────────┘  │
│                                                  │
│  Features:                                       │
│  • Centered layout                               │
│  • Animated spinner                              │
│  • Loading text                                  │
│  • Accessible (aria-label, role)                 │
└─────────────────────────────────────────────────┘
```

### Loading Placement Hierarchy

```
Loading UI Hierarchy
═══════════════════════════════════════

app/loading.tsx
    │
    │  Applies to all routes by default
    │
    ├── app/(auth)/loading.tsx (optional)
    │   │  Overrides for auth pages
    │   └─ Shown during login/register
    │
    └── app/(dashboard)/loading.tsx (optional)
        │  Overrides for dashboard pages
        └─ Shown during dashboard data fetch

Specificity Rule:
• Closest loading.tsx takes precedence
• Root loading.tsx is fallback
• Each route segment can have its own
```

### Spinner Animation Options

| Style | Description | Use Case |
|-------|-------------|----------|
| Circular Spinner | Rotating circle/ring | Modern, minimal |
| Dots | Bouncing dots | Playful, lightweight |
| Bar | Progress bar | Determinate loading |
| Skeleton | Content placeholders | Structural preview |
| Pulse | Pulsing element | Subtle, ambient |

### Loading Skeleton Example

```
Skeleton Screen Pattern
═══════════════════════════════════════

Instead of spinner, show content structure:

┌─────────────────────────────────────┐
│  ▓▓▓▓▓▓▓▓▓▓▓▓   ▓▓▓▓▓              │  ← Header skeleton
│  ────────────────────────────────   │
│                                     │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓            │  ← Content skeleton
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓                    │
│                                     │
│  ▓▓▓▓▓▓▓▓   ▓▓▓▓▓▓▓▓   ▓▓▓▓▓▓▓▓   │  ← Card skeletons
│  ▓▓▓▓▓▓▓▓   ▓▓▓▓▓▓▓▓   ▓▓▓▓▓▓▓▓   │
└─────────────────────────────────────┘

Benefits:
• Shows expected layout
• Less jarring than spinner
• Perceived faster loading
• Better user experience
```

### Accessibility Considerations

```
Screen Reader Announcement
═══════════════════════════════════════

<div role="status" aria-live="polite">
  <span className="sr-only">
    Loading page content...
  </span>
  <!-- Visual spinner -->
</div>

Properties:
• role="status" → Announces loading state
• aria-live="polite" → Non-intrusive update
• sr-only class → Hidden but readable
• Descriptive text → Context for users

Keyboard Navigation:
• Loading state doesn't trap focus
• Tab navigation still works
• Esc key should remain functional
```

### Performance Considerations

| Aspect | Recommendation | Reason |
|--------|----------------|--------|
| Animation FPS | 60fps | Smooth, non-janky |
| Bundle size | < 5KB | Fast download |
| Render time | < 16ms | Instant display |
| Animation type | CSS-based | GPU-accelerated |
| JavaScript | Minimal | Reduce parsing time |

### Loading Duration Best Practices

```
Loading Duration Guidelines
═══════════════════════════════════════

< 100ms:   Instant (no loading indicator needed)
100-300ms: Brief animation (spinner acceptable)
300ms-1s:  Loading indicator (spinner + text)
1s-3s:     Progress indication (loading bar)
> 3s:      Detailed progress (percentage, steps)

Implementation:
• Show loading.tsx immediately
• No artificial delays
• Remove as soon as content ready
• Prevent flash of loading state (< 100ms)
```

### Expected Outcome
- Functional loading component
- Smooth spinner animation
- Accessible to screen readers
- Consistent with application theme
- Automatic display during page loads
- Good user experience during waits

### Verification Checklist
- [ ] loading.tsx created in app/ directory
- [ ] "use client" directive added
- [ ] Loading component exported as default
- [ ] Full-screen centered container
- [ ] Animated spinner implemented
- [ ] Loading text included
- [ ] role="status" added for accessibility
- [ ] aria-label for screen readers
- [ ] Smooth animation (60fps)
- [ ] Styled with Tailwind classes
- [ ] Matches application theme

---

## Task 35: Create Root Error Component

### Overview
Create the root error boundary component (error.tsx) that catches and handles JavaScript errors in child route segments. This component provides a fallback UI when errors occur, preventing the entire application from crashing and offering users options to recover. It's a Client Component that receives error details and a reset function.

### Dependencies
- Task 31: Create app/ Directory Structure
- Task 19: Tailwind CSS configured
- Understanding of React error boundaries

### Instructions

1. **Create error.tsx file**
   - Create file at `app/error.tsx`
   - Must be a Client Component ("use client")
   - Automatically wraps routes in error boundary

2. **Add "use client" directive**
   - Add at top of file (first line)
   - Required for error boundaries and interactivity
   - Enables access to error object and reset function

3. **Import required dependencies**
   - Import { useEffect } from 'react'
   - Import error logging utilities if available
   - Import any UI components needed

4. **Define component props interface**
   - error prop: Error object with message and stack
   - reset prop: Function to attempt recovery
   - Type appropriately for TypeScript

5. **Create Error component**
   - Accept error and reset props
   - Export default component

6. **Add error logging**
   - Use useEffect to log error on mount
   - Send to error tracking service (future: Sentry)
   - Log to console in development
   - Include error message and stack trace

7. **Design error UI**
   - Show user-friendly error message
   - Avoid exposing technical details to users
   - Include helpful actions (try again, go home)
   - Apply consistent styling

8. **Add reset button**
   - Button that calls reset() function
   - Labeled "Try Again" or "Retry"
   - Re-renders route segment
   - May resolve transient errors

9. **Add navigation options**
   - Link to home page
   - Link to help/support
   - Show error code/reference if applicable

10. **Add error illustration**
    - Include visual element (icon, illustration)
    - Make UI approachable, not alarming
    - Use brand colors and style

11. **Consider error types**
    - Network errors vs. code errors
    - Provide context-specific messages
    - Offer appropriate recovery actions

### Error Boundary Behavior

```
Error Boundary Lifecycle
═══════════════════════════════════════

Normal Rendering:
┌──────────────────────────────────────┐
│  Layout                              │
│    └── Page renders successfully     │
│         └── Child components work    │
└──────────────────────────────────────┘

Error Occurs:
┌──────────────────────────────────────┐
│  Layout (still renders)              │
│    └── error.tsx displays            │  ← Replaces failed route
│         ├── Shows error UI           │
│         ├── Logs error               │
│         └── Offers recovery options  │
└──────────────────────────────────────┘

After Reset:
┌──────────────────────────────────────┐
│  Layout                              │
│    └── Route re-renders              │
│         └── Success OR error.tsx     │
└──────────────────────────────────────┘

Key Points:
• Errors don't crash entire app
• Layout remains functional
• Navigation still works
• Sibling routes unaffected
```

### Error Component Structure

```
┌─────────────────────────────────────────────────┐
│            Error Boundary UI (error.tsx)         │
│  ┌───────────────────────────────────────────┐  │
│  │  Centered Container                       │  │
│  │                                           │  │
│  │          ⚠️  Error Icon                   │  │
│  │                                           │  │
│  │      Something Went Wrong                 │  │
│  │                                           │  │
│  │   We encountered an unexpected error.     │  │
│  │   Please try again or return home.        │  │
│  │                                           │  │
│  │   ┌─────────────┐  ┌─────────────┐       │  │
│  │   │  Try Again  │  │  Go Home    │       │  │
│  │   └─────────────┘  └─────────────┘       │  │
│  │                                           │  │
│  │   Error ID: abc-123-def                   │  │
│  │                                           │  │
│  └───────────────────────────────────────────┘  │
│                                                  │
│  Features:                                       │
│  • User-friendly message                         │
│  • Recovery actions (reset button)               │
│  • Navigation options (home link)                │
│  • Error reference for support                   │
└─────────────────────────────────────────────────┘
```

### Error Hierarchy

```
Error Boundary Hierarchy
═══════════════════════════════════════

app/error.tsx
    │
    │  Catches errors in entire app
    │
    ├── app/(auth)/error.tsx (optional)
    │   │  Catches auth-specific errors
    │   └─ Can provide auth-relevant recovery
    │
    └── app/(dashboard)/error.tsx (optional)
        │  Catches dashboard errors
        └─ Can show dashboard-specific help

Specificity Rule:
• Closest error.tsx catches error
• Root error.tsx is ultimate fallback
• Each route segment can have error boundary
• Errors bubble up if not caught
```

### Error Types and Handling

| Error Type | Example | User Message | Recovery Action |
|------------|---------|--------------|-----------------|
| Network | API fetch failed | "Connection problem" | Retry button |
| Authentication | Token expired | "Session expired" | Redirect to login |
| Authorization | Forbidden resource | "Access denied" | Go to dashboard |
| Not Found | Invalid route | "Page not found" | Go to home |
| Server | 500 response | "Server error" | Retry or contact support |
| Client | JavaScript error | "Unexpected error" | Refresh page |

### Error Logging Strategy

```
Error Logging Flow
═══════════════════════════════════════

1. Error Caught by error.tsx
         ↓
2. useEffect runs on mount
         ↓
3. Log to Console (Development)
   console.error('Error:', error.message)
         ↓
4. Log to Service (Production)
   • Sentry.captureException(error)
   • Include user context
   • Add breadcrumbs
         ↓
5. Generate Error ID
   • Unique reference for support
   • Show to user
   • Include in logs

Benefits:
• Track error frequency
• Debug production issues
• Correlate user reports
• Monitor app health
```

### Reset Function Behavior

```
Reset Function Mechanics
═══════════════════════════════════════

User clicks "Try Again" button
         ↓
reset() function called
         ↓
Next.js re-renders route segment
         ↓
   ┌────────┴────────┐
   │                 │
Success             Error
   │                 │
Page displays    error.tsx shows again
   │                 │
   └─────────────────┘

When Reset Helps:
• Transient network errors
• Temporary server issues
• Race conditions
• Browser state problems

When Reset Doesn't Help:
• Code bugs
• Invalid data
• Missing resources
• Broken dependencies
```

### User-Friendly Error Messages

| Technical Error | User Message |
|----------------|--------------|
| "TypeError: Cannot read property 'name' of undefined" | "We encountered an unexpected error. Please try again." |
| "Network request failed: 500" | "We're having trouble connecting. Please check your internet and try again." |
| "Authentication failed: Invalid token" | "Your session has expired. Please log in again." |
| "API returned 404" | "We couldn't find what you're looking for. Please return to the home page." |

### Accessibility Considerations

```
Screen Reader Support
═══════════════════════════════════════

<div role="alert" aria-live="assertive">
  <h1>Error: Something Went Wrong</h1>
  <p>We encountered an unexpected problem.</p>
</div>

Properties:
• role="alert" → High priority announcement
• aria-live="assertive" → Immediate notification
• Heading structure → Proper hierarchy
• Focus management → Move to error message

Keyboard Navigation:
• Focus on "Try Again" button
• Tab through action buttons
• Escape key behavior (if modal)
• Enter key triggers default action
```

### Expected Outcome
- Functional error boundary
- User-friendly error messages
- Reset functionality working
- Error logging implemented
- Graceful degradation
- Prevents full app crashes
- Recovery options provided

### Verification Checklist
- [ ] error.tsx created in app/ directory
- [ ] "use client" directive added
- [ ] Component accepts error and reset props
- [ ] useEffect logs error on mount
- [ ] User-friendly message displayed
- [ ] Reset button implemented
- [ ] Reset button calls reset() function
- [ ] Home page link included
- [ ] Error icon/illustration added
- [ ] role="alert" for accessibility
- [ ] aria-live for screen readers
- [ ] No technical details exposed to users
- [ ] Error ID/reference generated (optional)
- [ ] Styled with Tailwind classes

---

## Task 36: Create Not Found Page

### Overview
Create the not-found page (not-found.tsx) that displays when users navigate to routes that don't exist. This is the 404 error page, automatically shown by Next.js when no matching route is found. It should be user-friendly, provide navigation options, and maintain brand consistency while helping users find their way.

### Dependencies
- Task 31: Create app/ Directory Structure
- Task 32: Create Root Layout Component
- Task 19: Tailwind CSS configured

### Instructions

1. **Create not-found.tsx file**
   - Create file at `app/not-found.tsx`
   - Can be Server Component (no interactivity required)
   - Automatically used for 404 errors

2. **Import required dependencies**
   - Import Link from 'next/link'
   - Import any icons or illustrations
   - No "use client" needed unless adding interactivity

3. **Create NotFound component**
   - Export default React component
   - No props required (standalone page)
   - Returns full-page UI

4. **Design 404 layout**
   - Use centered container layout
   - Include large "404" display
   - Add helpful heading text
   - Provide explanatory message

5. **Add 404 illustration**
   - Include visual element (404 graphic, icon)
   - Make it friendly and approachable
   - Use brand colors
   - Consider animated illustration

6. **Add primary heading**
   - Use "Page Not Found" or similar
   - Make prominent and clear
   - Use semantic h1 tag

7. **Add descriptive text**
   - Explain what happened
   - "The page you're looking for doesn't exist"
   - Keep tone friendly, not alarming
   - Offer next steps

8. **Add navigation options**
   - Primary: Link to home/dashboard
   - Secondary: Link to help page
   - Tertiary: Search functionality (future)
   - Use Next.js Link component

9. **Add helpful suggestions**
   - List common destinations
   - Link to main sections (Dashboard, Inventory, Sales)
   - Show popular pages
   - Provide search if available

10. **Consider SEO**
    - Add page metadata (optional override)
    - Use noindex for 404 pages
    - Proper HTTP 404 status (automatic)

### 404 Page Trigger Scenarios

```
When not-found.tsx Displays
═══════════════════════════════════════

Scenario 1: Invalid URL
  User navigates to /invalid-page
         ↓
  No matching route found
         ↓
  not-found.tsx displays automatically
  (HTTP 404 status)

Scenario 2: Deleted Resource
  User bookmarked /products/123
         ↓
  Product deleted from database
         ↓
  Page calls notFound() function
         ↓
  not-found.tsx displays

Scenario 3: Typo in URL
  User types /dashbord (missing 'a')
         ↓
  No matching route
         ↓
  not-found.tsx displays

Automatic Detection:
• No page.tsx in route
• Route doesn't exist
• Dynamic route returns null
• notFound() called in component
```

### Not Found Page Structure

```
┌─────────────────────────────────────────────────┐
│          404 Page (not-found.tsx)                │
│  ┌───────────────────────────────────────────┐  │
│  │  Centered Container                       │  │
│  │                                           │  │
│  │              ┌─────┐                      │  │
│  │              │ 404 │                      │  │
│  │              └─────┘                      │  │
│  │               Large                       │  │
│  │                                           │  │
│  │        Page Not Found                     │  │
│  │                                           │  │
│  │   The page you're looking for            │  │
│  │   doesn't exist or has been moved.       │  │
│  │                                           │  │
│  │   ┌────────────────┐                      │  │
│  │   │ Back to Home   │                      │  │
│  │   └────────────────┘                      │  │
│  │                                           │  │
│  │   Quick Links:                            │  │
│  │   • Dashboard                             │  │
│  │   • Inventory                             │  │
│  │   • Sales                                 │  │
│  │                                           │  │
│  └───────────────────────────────────────────┘  │
│                                                  │
│  Features:                                       │
│  • Clear 404 message                             │
│  • Primary CTA (home link)                       │
│  • Quick navigation links                        │
│  • Friendly illustration                         │
└─────────────────────────────────────────────────┘
```

### 404 vs Error Page Differences

| Aspect | 404 Page (not-found.tsx) | Error Page (error.tsx) |
|--------|--------------------------|------------------------|
| Trigger | Route doesn't exist | JavaScript error |
| HTTP Status | 404 Not Found | 500 Internal Server Error |
| Component Type | Can be Server Component | Must be Client Component |
| Props | None | error, reset |
| User Action | Navigate away | Try again or navigate |
| Cause | Invalid URL | Code/network failure |

### 404 Page Design Patterns

```
Pattern 1: Minimal (Fast, Clean)
┌────────────────────────────────┐
│                                │
│           404                  │
│                                │
│       Page Not Found           │
│                                │
│    [Back to Home]              │
│                                │
└────────────────────────────────┘

Pattern 2: Helpful (Recommended)
┌────────────────────────────────┐
│           [Icon]               │
│                                │
│           404                  │
│       Page Not Found           │
│                                │
│  The page you're looking for   │
│  doesn't exist.                │
│                                │
│    [Back to Home]              │
│                                │
│  Quick Links:                  │
│  • Dashboard                   │
│  • Help Center                 │
└────────────────────────────────┘

Pattern 3: Playful (Branded)
┌────────────────────────────────┐
│      [Custom Illustration]     │
│                                │
│  Oops! This page took a        │
│  vacation to Galle Beach       │
│                                │
│         404 - Not Found        │
│                                │
│  [Take Me Home]  [Search]      │
│                                │
│  Popular Pages:                │
│  Dashboard | Sales | Inventory │
└────────────────────────────────┘
```

### Quick Links Suggestions

| Link Text | Destination | Purpose |
|-----------|-------------|---------|
| Dashboard | /dashboard | Main app entry |
| Inventory | /dashboard/inventory | Common feature |
| Sales | /dashboard/sales | Common feature |
| Help Center | /help | Support resource |
| Contact Us | /contact | Get assistance |
| View All Products | /dashboard/products | Catalog browsing |

### SEO and HTTP Status

```
404 Status Code Handling
═══════════════════════════════════════

Development:
http://localhost:3000/invalid-page
         ↓
not-found.tsx rendered
         ↓
Browser receives HTTP 404 status
         ↓
Search engines detect 404

Production:
https://app.lankacommerce.lk/invalid
         ↓
Next.js sends 404 header
         ↓
not-found.tsx rendered
         ↓
Search engine logs 404 (won't index)

SEO Impact:
• 404s are normal and expected
• Don't hurt rankings if occasional
• Many 404s indicate broken links
• Custom 404 page improves UX
```

### Dynamic notFound() Function

```
Programmatic 404 Triggering
═══════════════════════════════════════

Use Case: Product page with invalid ID

// app/products/[id]/page.tsx
import { notFound } from 'next/navigation'

async function getProduct(id: string) {
  const product = await fetch(...)
  if (!product) {
    notFound()  ← Triggers not-found.tsx
  }
  return product
}

Flow:
1. User visits /products/999
2. getProduct() fetches data
3. Product not in database
4. notFound() called
5. not-found.tsx displays
6. HTTP 404 status returned
```

### Accessibility Considerations

```
404 Page Accessibility
═══════════════════════════════════════

Semantic Structure:
<main>
  <h1>404 - Page Not Found</h1>
  <p>The page you're looking for doesn't exist.</p>
  <nav aria-label="Quick navigation">
    <Link href="/">Home</Link>
  </nav>
</main>

Requirements:
• Proper heading hierarchy (h1)
• Clear link text
• Sufficient color contrast
• Keyboard navigation works
• Screen reader friendly

Focus Management:
• Focus on h1 on page load (optional)
• Tab order: heading → main CTA → quick links
• Skip to content link if needed
```

### Expected Outcome
- Functional 404 page
- User-friendly messaging
- Clear navigation options
- Helpful quick links
- Matches application branding
- Proper HTTP 404 status
- Accessible to all users

### Verification Checklist
- [ ] not-found.tsx created in app/ directory
- [ ] Component exported as default
- [ ] Large "404" displayed prominently
- [ ] Heading "Page Not Found" added
- [ ] Descriptive text explaining situation
- [ ] Link to home page included
- [ ] Quick links to main sections added
- [ ] Illustration or icon included
- [ ] Semantic HTML (h1, main, nav)
- [ ] Styled with Tailwind classes
- [ ] Color contrast sufficient
- [ ] Navigation links use next/link
- [ ] HTTP 404 status automatic (verify)

---

## Task 37: Create (auth) Route Group

### Overview
Create the (auth) route group directory to organize authentication-related pages (login, register, forgot-password, etc.). Route groups in Next.js 14+ use parentheses notation to organize routes without adding segments to the URL path. This keeps authentication pages separate from dashboard routes while maintaining clean URLs.

### Dependencies
- Task 31: Create app/ Directory Structure
- Understanding of route group concepts

### Instructions

1. **Navigate to app directory**
   - Locate app/ directory in frontend project
   - Prepare to create route group subdirectory

2. **Create (auth) directory**
   - Create directory named exactly `(auth)` with parentheses
   - Parentheses indicate route group (not part of URL)
   - Must be inside app/ directory

3. **Understand route group behavior**
   - Directory name not included in URL paths
   - Pages inside become direct children of root
   - Allows grouping related routes logically
   - Can have its own layout.tsx

4. **Plan authentication pages**
   - Future: login page at /login (not /(auth)/login)
   - Future: register page at /register
   - Future: forgot-password at /forgot-password
   - Future: reset-password at /reset-password
   - Future: verify-email at /verify-email

5. **Verify directory creation**
   - Confirm (auth) directory exists
   - Check parentheses in directory name
   - Ensure proper nesting: app/(auth)/
   - Directory ready for layout.tsx (Task 38)

### Route Group Concepts

```
Route Group Structure
═══════════════════════════════════════

Without Route Groups (Old Pattern):
app/
├── auth/
│   ├── login/
│   │   └── page.tsx          → URL: /auth/login ❌
│   └── register/
│       └── page.tsx          → URL: /auth/register ❌

With Route Groups (New Pattern):
app/
├── (auth)/                    ← Parentheses = Route Group
│   ├── login/
│   │   └── page.tsx          → URL: /login ✓
│   └── register/
│       └── page.tsx          → URL: /register ✓

Key Difference:
• (auth) doesn't appear in URL
• Provides organization without URL nesting
• Keeps URLs clean and short
```

### Route Group Benefits

| Benefit | Description | Example |
|---------|-------------|---------|
| Organization | Group related routes logically | (auth), (dashboard), (marketing) |
| Layouts | Apply shared layouts per group | Auth layout vs. Dashboard layout |
| Clean URLs | No extra path segments | /login not /auth/login |
| Colocation | Keep related code together | All auth pages in one folder |
| Multiple Groups | Create several groups at same level | (auth), (dashboard), (public) |

### URL Path Mapping

```
Directory Structure → URL Paths
═══════════════════════════════════════

app/
├── (auth)/
│   ├── layout.tsx              → Wraps auth pages
│   ├── login/
│   │   └── page.tsx            → /login
│   ├── register/
│   │   └── page.tsx            → /register
│   ├── forgot-password/
│   │   └── page.tsx            → /forgot-password
│   └── reset-password/
│       └── page.tsx            → /reset-password
│
├── (dashboard)/
│   ├── layout.tsx              → Wraps dashboard pages
│   ├── page.tsx                → /dashboard
│   ├── inventory/
│   │   └── page.tsx            → /dashboard/inventory
│   └── sales/
│       └── page.tsx            → /dashboard/sales
│
└── layout.tsx                  → Root layout (wraps all)

Route Group Rules:
• Parentheses removed from URLs
• Can nest normal routes inside groups
• Each group can have layout.tsx
• Groups don't create route segments
```

### Layout Composition with Route Groups

```
Layout Hierarchy with Route Groups
═══════════════════════════════════════

Root Layout (app/layout.tsx)
    │
    │  HTML, Body, Fonts, Global Styles
    │
    ├─── (auth) Layout (app/(auth)/layout.tsx)
    │        │
    │        │  Auth-specific styling
    │        │  Centered content, logo
    │        │
    │        └─── Login Page (app/(auth)/login/page.tsx)
    │
    └─── (dashboard) Layout (app/(dashboard)/layout.tsx)
             │
             │  Sidebar, Header, Navigation
             │
             └─── Dashboard Page (app/(dashboard)/page.tsx)

Composition Result:
┌────────────────────────────────────────┐
│  Root Layout (HTML, Body)              │
│  ┌──────────────────────────────────┐  │
│  │  Auth Layout (Centered)          │  │
│  │  ┌────────────────────────────┐  │  │
│  │  │  Login Page                │  │  │
│  │  │  (Username, Password)      │  │  │
│  │  └────────────────────────────┘  │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

### Multiple Route Groups Example

```
Multiple Groups at Same Level
═══════════════════════════════════════

app/
├── (auth)/
│   ├── layout.tsx              → Auth layout
│   ├── login/page.tsx          → /login
│   └── register/page.tsx       → /register
│
├── (dashboard)/
│   ├── layout.tsx              → Dashboard layout
│   ├── page.tsx                → /dashboard
│   └── inventory/page.tsx      → /dashboard/inventory
│
├── (marketing)/
│   ├── layout.tsx              → Marketing layout
│   ├── about/page.tsx          → /about
│   └── pricing/page.tsx        → /pricing
│
└── layout.tsx                  → Root layout

Each Group:
• Independent layout
• Separate concerns
• Different styling
• Isolated components
```

### Route Group Use Cases

| Use Case | Route Group | Pages | Shared Layout Features |
|----------|-------------|-------|------------------------|
| Authentication | (auth) | login, register, reset | Centered, minimal nav |
| Dashboard | (dashboard) | all ERP pages | Sidebar, header, breadcrumb |
| Marketing | (marketing) | about, pricing, contact | Public header, footer |
| Admin | (admin) | user management | Admin-only sidebar |
| Onboarding | (onboarding) | steps 1-5 | Progress indicator |

### Route Group Naming Conventions

```
Naming Best Practices
═══════════════════════════════════════

Good Names (Descriptive):
• (auth)         → Authentication pages
• (dashboard)    → Protected dashboard
• (marketing)    → Public marketing pages
• (checkout)     → E-commerce checkout flow
• (onboarding)   → User onboarding steps

Avoid:
• (group1)       → Not descriptive
• (pages)        → Too generic
• (misc)         → Unclear purpose

Rules:
• Use lowercase
• Use hyphens for multiple words
• Be descriptive
• Match feature domain
```

### Expected Outcome
- (auth) route group directory created
- Understanding of route group purpose
- Clean URL structure planned
- Foundation for auth pages
- Ready for auth layout (Task 38)

### Verification Checklist
- [ ] (auth) directory exists in app/
- [ ] Directory name includes parentheses
- [ ] Parentheses are part of folder name, not markdown
- [ ] Directory is direct child of app/
- [ ] Directory is empty (ready for layout and pages)
- [ ] Understanding of route group URL behavior
- [ ] Understanding of layout composition

---

## Task 38: Create (auth) Layout

### Overview
Create the authentication layout component (layout.tsx) inside the (auth) route group. This layout wraps all authentication pages with a consistent design focused on centered content, minimal navigation, and brand identity. It provides a clean, distraction-free environment for users to authenticate.

### Dependencies
- Task 37: Create (auth) Route Group
- Task 32: Create Root Layout Component
- Task 19: Tailwind CSS configured

### Instructions

1. **Create layout.tsx file**
   - Create file at `app/(auth)/layout.tsx`
   - Server Component by default (no "use client")
   - Export default React component

2. **Import required dependencies**
   - Import { ReactNode } from 'react'
   - Import Link from 'next/link' for logo link
   - Import any logo or branding assets

3. **Define component props interface**
   - Create interface with children prop
   - Type children as ReactNode
   - Represents auth pages (login, register, etc.)

4. **Create AuthLayout component**
   - Accept children prop
   - Export default component
   - Return layout structure

5. **Design layout structure**
   - Full-height container (min-h-screen)
   - Two-column or single-column layout
   - Centered content area
   - Optional background pattern/gradient

6. **Add header section**
   - Logo at top (link to home)
   - Application name or tagline
   - Minimal, non-distracting
   - Centered or left-aligned

7. **Create content area**
   - Centered card/container
   - Max-width constraint (sm or md)
   - Padding for mobile
   - Background color (white/card)
   - Shadow or border for elevation

8. **Render children**
   - Place {children} in content area
   - This renders login, register, etc.
   - No additional wrappers needed

9. **Add optional footer**
   - Links to help, privacy, terms
   - Copyright notice
   - Contact information
   - Centered at bottom

10. **Consider responsive design**
    - Mobile-first approach
    - Stack elements on small screens
    - Adjust padding and spacing
    - Ensure touch targets are adequate

11. **Add subtle branding**
    - Background pattern or gradient
    - Brand colors
    - Minimal illustrations
    - Professional appearance

### Auth Layout Structure

```
┌─────────────────────────────────────────────────┐
│         (auth) Layout (app/(auth)/layout.tsx)    │
│  ┌───────────────────────────────────────────┐  │
│  │  Full Page Container (min-h-screen)       │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │  Header                             │  │  │
│  │  │  ┌──────┐                           │  │  │
│  │  │  │ Logo │  LankaCommerce            │  │  │
│  │  │  └──────┘                           │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  │                                           │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │  Content Card (Centered)            │  │  │
│  │  │  ┌───────────────────────────────┐  │  │  │
│  │  │  │                               │  │  │  │
│  │  │  │      {children}               │  │  │  │
│  │  │  │                               │  │  │  │
│  │  │  │  (Login, Register, etc.       │  │  │  │
│  │  │  │   pages render here)          │  │  │  │
│  │  │  │                               │  │  │  │
│  │  │  └───────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  │                                           │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │  Footer                             │  │  │
│  │  │  Help | Privacy | Terms             │  │  │
│  │  │  © 2026 LankaCommerce               │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────┘  │
│                                                  │
│  Features:                                       │
│  • Centered content card                         │
│  • Minimal header with logo                      │
│  • Clean, distraction-free                       │
│  • Consistent across auth pages                  │
└─────────────────────────────────────────────────┘
```

### Layout Nesting with Auth Layout

```
Component Nesting
═══════════════════════════════════════

Root Layout (app/layout.tsx)
    │  <html><body>
    │
    └── Auth Layout (app/(auth)/layout.tsx)
            │  <div centered container>
            │
            └── Login Page (app/(auth)/login/page.tsx)
                    │  <form> login fields
                    │
                    └── Rendered content

Final DOM Structure:
<html>
  <body>
    <!-- Root Layout content -->
    <div class="min-h-screen centered">
      <!-- Auth Layout content -->
      <div class="card">
        <!-- Login Page content -->
        <form>...</form>
      </div>
    </div>
  </body>
</html>
```

### Auth Layout Design Patterns

```
Pattern 1: Centered Card (Recommended)
┌────────────────────────────────────┐
│                                    │
│         [Logo]                     │
│                                    │
│    ┌────────────────────┐          │
│    │                    │          │
│    │  Login Form        │          │
│    │  • Email           │          │
│    │  • Password        │          │
│    │  [Login Button]    │          │
│    │                    │          │
│    └────────────────────┘          │
│                                    │
│         Help | Privacy             │
└────────────────────────────────────┘

Pattern 2: Split Screen
┌─────────────────┬──────────────────┐
│                 │                  │
│  Brand Image    │  Login Form      │
│  • Logo         │  • Email         │
│  • Tagline      │  • Password      │
│  • Features     │  [Login Button]  │
│                 │                  │
└─────────────────┴──────────────────┘

Pattern 3: Minimal (Mobile-First)
┌────────────────────────────────────┐
│                                    │
│         [Logo]                     │
│     LankaCommerce                  │
│                                    │
│  Login Form                        │
│  ──────────────────────────        │
│  Email: [____________]             │
│  Pass:  [____________]             │
│  [Login]                           │
│                                    │
│  Don't have an account? Register   │
└────────────────────────────────────┘
```

### Auth Layout vs Dashboard Layout

| Aspect | Auth Layout | Dashboard Layout |
|--------|-------------|------------------|
| Navigation | Minimal (logo only) | Full sidebar + header |
| Content Width | Narrow (max-w-md) | Full width |
| Background | Decorative pattern | Neutral background |
| Header | Logo + app name | Header with user menu |
| Footer | Help links | Optional |
| Sidebar | None | Yes, collapsible |
| Purpose | Authentication | Application features |

### Responsive Considerations

```
Mobile Layout (< 640px)
┌──────────────────┐
│                  │
│      [Logo]      │
│                  │
│  ┌────────────┐  │
│  │            │  │
│  │  Form      │  │
│  │  Fields    │  │
│  │            │  │
│  └────────────┘  │
│                  │
│     Links        │
└──────────────────┘

Tablet Layout (640px - 1024px)
┌────────────────────────┐
│                        │
│       [Logo]           │
│                        │
│    ┌──────────┐        │
│    │          │        │
│    │  Form    │        │
│    │          │        │
│    └──────────┘        │
│                        │
│       Links            │
└────────────────────────┘

Desktop Layout (> 1024px)
┌─────────────────────────────┐
│                             │
│         [Logo]              │
│                             │
│       ┌───────────┐         │
│       │           │         │
│       │   Form    │         │
│       │           │         │
│       └───────────┘         │
│                             │
│          Links              │
└─────────────────────────────┘

Key Points:
• Full-width on mobile
• Centered with padding on tablet
• Max-width constraint on desktop
• Touch-friendly spacing on mobile
```

### Auth Layout Styling

```
Tailwind Classes Example
═══════════════════════════════════════

Container:
  className="min-h-screen bg-gray-50 flex flex-col"

Header:
  className="p-6 text-center"

Logo Link:
  className="inline-flex items-center gap-2 text-2xl font-bold"

Content Card:
  className="flex-1 flex items-center justify-center p-4"

Card:
  className="w-full max-w-md bg-white rounded-lg shadow-lg p-8"

Footer:
  className="p-6 text-center text-sm text-gray-600"

Responsive:
  className="p-4 md:p-6 lg:p-8"
```

### Brand Elements in Auth Layout

| Element | Purpose | Placement |
|---------|---------|-----------|
| Logo | Brand recognition | Top center or top left |
| App Name | Identity reinforcement | Next to logo |
| Tagline | Value proposition | Below logo |
| Color Scheme | Brand consistency | Background, buttons |
| Illustration | Visual interest | Background or sidebar |
| Pattern | Subtle decoration | Page background |

### Expected Outcome
- Functional auth layout component
- Centered content design
- Minimal, distraction-free interface
- Logo and branding present
- Consistent styling for auth pages
- Responsive across devices
- Professional appearance

### Verification Checklist
- [ ] layout.tsx created in app/(auth)/ directory
- [ ] Component exported as default
- [ ] children prop typed as ReactNode
- [ ] Full-height container (min-h-screen)
- [ ] Logo and app name in header
- [ ] Content area centered
- [ ] Max-width constraint applied (max-w-md or sm)
- [ ] Card or container for content
- [ ] children rendered inside content area
- [ ] Footer with help links (optional)
- [ ] Responsive design (mobile-first)
- [ ] Styled with Tailwind classes
- [ ] Background styling applied
- [ ] Matches brand identity

---

## Summary

This document established the foundational App Router structure for the Next.js 14+ ERP dashboard:

### Completed Infrastructure
- ✅ app/ directory created (Task 31)
- ✅ Root layout with HTML structure (Task 32)
- ✅ Root metadata configuration (Task 33)
- ✅ Root loading component (Task 34)
- ✅ Root error boundary (Task 35)
- ✅ Not found (404) page (Task 36)
- ✅ (auth) route group (Task 37)
- ✅ (auth) layout for authentication pages (Task 38)

### Key Achievements

1. **App Router Foundation**
   - Modern file-based routing
   - Server Components by default
   - Special files for loading/error states
   - Route groups for organization

2. **Root Components**
   - Root layout with HTML/Body
   - Inter font configuration
   - Global styles import
   - Comprehensive metadata

3. **Error Handling**
   - Loading states with loading.tsx
   - Error boundaries with error.tsx
   - 404 pages with not-found.tsx
   - Graceful degradation

4. **Auth Infrastructure**
   - (auth) route group for organization
   - Dedicated auth layout
   - Centered, minimal design
   - Ready for login/register pages

### Next Steps

Proceed to [02_Tasks-39-46_Dashboard-API-Shared.md](02_Tasks-39-46_Dashboard-API-Shared.md) to implement:
- (dashboard) route group and layout
- API routes with health check endpoint
- Shared directories (components, lib, hooks, types)
- Complete frontend structure foundation

---

**Document Status:** ✅ Complete  
**Total Tasks:** 8  
**Total Lines:** ~950

