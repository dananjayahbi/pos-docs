# Tasks 14-18: App Router Setup

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 03 - Frontend Project Initialization  
> **Group:** B - Next.js Project Creation  
> **Document:** 02 of 02  
> **Tasks Covered:** 14, 15, 16, 17, 18

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-09-13_NextJS-Install.md](01_Tasks-09-13_NextJS-Install.md)
- **→ Next Document:** [../Group-C_TypeScript-Configuration/00_GROUP_OVERVIEW.md](../Group-C_TypeScript-Configuration/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document covers creating the App Router directory structure including the root layout, home page, error boundary, and 404 page.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 14 | Create app/ Directory | Simple |
| 15 | Create app/layout.tsx | Medium |
| 16 | Create app/page.tsx | Simple |
| 17 | Create app/error.tsx | Medium |
| 18 | Create app/not-found.tsx | Simple |

---

## Task 14: Create app/ Directory

### Overview
Create the app directory which is the root of the Next.js App Router.

### Dependencies
- Task 09: Install Next.js

### Instructions

1. **Create app directory**
   - Create frontend/app/ directory

2. **Understand App Router**
   - File-based routing
   - Server Components by default
   - Special files (layout, page, error)

### Directory Location

```
frontend/
├── app/
│   └── (files created in next tasks)
├── next.config.js
└── package.json
```

### App Router vs Pages Router

| Feature | App Router | Pages Router |
|---------|-----------|--------------|
| Directory | app/ | pages/ |
| Components | Server by default | Client by default |
| Layouts | Nested layouts | _app.js only |
| Loading | loading.tsx | Manual |
| Error | error.tsx | _error.js |

### Special Files

| File | Purpose |
|------|---------|
| `layout.tsx` | Shared UI wrapper |
| `page.tsx` | Route endpoint |
| `loading.tsx` | Loading UI |
| `error.tsx` | Error boundary |
| `not-found.tsx` | 404 page |
| `template.tsx` | Re-rendered layout |

### Route Organization

| Pattern | Purpose |
|---------|---------|
| `(group)/` | Route groups (no URL) |
| `[param]/` | Dynamic segments |
| `[...slug]/` | Catch-all segments |
| `@slot/` | Parallel routes |

### Expected Outcome
- app/ directory created
- Ready for App Router files

### Verification Checklist
- [ ] app/ directory exists
- [ ] Directory is empty (files added next)

---

## Task 15: Create app/layout.tsx

### Overview
Create the root layout component that wraps all pages in the application.

### Dependencies
- Task 14: Create app/ Directory

### Instructions

1. **Create layout.tsx**
   - Create app/layout.tsx
   - Export RootLayout component

2. **Add HTML structure**
   - html tag with lang attribute
   - body tag with children

3. **Configure metadata**
   - Export metadata object
   - Set title and description

4. **Add font configuration**
   - Import from next/font
   - Apply to body

5. **Prepare for providers**
   - Structure for future context providers

### File Location

```
frontend/app/
└── layout.tsx
```

### Component Structure

| Element | Purpose |
|---------|---------|
| `html` | Root HTML element |
| `body` | Body with fonts and styles |
| `children` | Page content slot |

### Metadata Export

| Field | Value |
|-------|-------|
| `title.default` | LankaCommerce Cloud |
| `title.template` | %s \| LankaCommerce |
| `description` | Multi-tenant ERP for Sri Lankan SMEs |

### Font Configuration

Use Inter font from next/font/google:

| Property | Value |
|----------|-------|
| `subsets` | ['latin'] |
| `display` | 'swap' |
| `variable` | '--font-inter' |

### Props Interface

| Prop | Type | Purpose |
|------|------|---------|
| `children` | React.ReactNode | Page content |

### Sri Lanka Context

| Meta | Value |
|------|-------|
| `lang` | 'en' (primary) |
| `locale` | 'en-LK' |

### Expected Outcome
- Root layout created
- Metadata configured
- Font ready

### Verification Checklist
- [ ] layout.tsx exists
- [ ] RootLayout exported
- [ ] html and body tags present
- [ ] metadata exported
- [ ] Font configured

---

## Task 16: Create app/page.tsx

### Overview
Create the home page component that renders at the root URL ("/").

### Dependencies
- Task 14: Create app/ Directory

### Instructions

1. **Create page.tsx**
   - Create app/page.tsx
   - Export default HomePage component

2. **Add placeholder content**
   - Welcome message
   - Link placeholders for ERP and Webstore

3. **Keep as Server Component**
   - No 'use client' directive
   - Static content for now

### File Location

```
frontend/app/
├── layout.tsx
└── page.tsx
```

### Component Structure

| Element | Purpose |
|---------|---------|
| `main` | Main content wrapper |
| `h1` | Page title |
| `p` | Description text |
| Navigation links | Future ERP/Webstore links |

### Server Component Benefits

| Benefit | Description |
|---------|-------------|
| Zero JS | No client bundle for static |
| SEO | Full HTML rendering |
| Performance | Faster initial load |

### Content Elements

| Section | Content |
|---------|---------|
| Title | LankaCommerce Cloud |
| Subtitle | Multi-tenant ERP Platform |
| Description | For Sri Lankan SMEs |

### Future Integration

Placeholder sections for:
- ERP Dashboard link
- Webstore link
- Admin panel link

### Expected Outcome
- Home page created
- Accessible at "/"

### Verification Checklist
- [ ] page.tsx exists
- [ ] Default export present
- [ ] Server Component (no use client)
- [ ] Basic content rendered

---

## Task 17: Create app/error.tsx

### Overview
Create the error boundary component to handle runtime errors gracefully.

### Dependencies
- Task 14: Create app/ Directory

### Instructions

1. **Create error.tsx**
   - Create app/error.tsx
   - Must be Client Component

2. **Add 'use client' directive**
   - Required for error boundaries

3. **Implement error handling**
   - Display error message
   - Provide retry button

4. **Use error props**
   - error object
   - reset function

### File Location

```
frontend/app/
├── layout.tsx
├── page.tsx
└── error.tsx
```

### Client Component Requirement

Error boundaries require:
- State management
- Event handlers
- Must use 'use client'

### Props Interface

| Prop | Type | Purpose |
|------|------|---------|
| `error` | Error & { digest?: string } | Error object |
| `reset` | () => void | Retry function |

### Component Structure

| Element | Purpose |
|---------|---------|
| Container | Error UI wrapper |
| Title | Error heading |
| Message | Error description |
| Retry button | Calls reset() |

### Error Information

Display:
- Generic error message (user-friendly)
- Retry option
- Optional: Error digest for debugging

### Development vs Production

| Environment | Show |
|-------------|------|
| Development | Full error details |
| Production | Generic message only |

### useEffect for Logging

Report errors to:
- Console (development)
- Error tracking service (production)

### Expected Outcome
- Error boundary created
- Graceful error handling

### Verification Checklist
- [ ] error.tsx exists
- [ ] 'use client' directive present
- [ ] error and reset props used
- [ ] Retry functionality works

---

## Task 18: Create app/not-found.tsx

### Overview
Create the 404 page component for handling missing routes.

### Dependencies
- Task 14: Create app/ Directory

### Instructions

1. **Create not-found.tsx**
   - Create app/not-found.tsx
   - Export default NotFound component

2. **Add 404 content**
   - Clear not found message
   - Link back to home

3. **Keep as Server Component**
   - No client interactivity needed

4. **Style appropriately**
   - Consistent with app design

### File Location

```
frontend/app/
├── layout.tsx
├── page.tsx
├── error.tsx
└── not-found.tsx
```

### Component Structure

| Element | Purpose |
|---------|---------|
| Container | Centered layout |
| 404 Title | Status code display |
| Message | Not found explanation |
| Home Link | Navigation to home |

### Content Elements

| Element | Content |
|---------|---------|
| Code | 404 |
| Title | Page Not Found |
| Message | The page you're looking for doesn't exist |
| Link | Return to Home |

### Server Component Benefits

- Static rendering
- Fast 404 response
- SEO-friendly

### Usage Triggers

not-found.tsx is shown when:
- No matching route
- notFound() function called
- Dynamic segment not found

### Expected Outcome
- 404 page created
- User-friendly navigation

### Verification Checklist
- [ ] not-found.tsx exists
- [ ] Default export present
- [ ] 404 message displayed
- [ ] Home link included

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 14 | Create app/ Directory | App Router root |
| 15 | Create app/layout.tsx | Root layout |
| 16 | Create app/page.tsx | Home page |
| 17 | Create app/error.tsx | Error boundary |
| 18 | Create app/not-found.tsx | 404 page |

### Files Created

```
frontend/app/
├── layout.tsx      # Root layout
├── page.tsx        # Home page (/)
├── error.tsx       # Error boundary (client)
└── not-found.tsx   # 404 page
```

### Component Types

| File | Component Type |
|------|----------------|
| layout.tsx | Server Component |
| page.tsx | Server Component |
| error.tsx | Client Component |
| not-found.tsx | Server Component |

### Git Commit Message
```
feat(frontend): create Next.js 14 project structure

- Install Next.js 14 and React 18
- Configure next.config.js with image domains
- Create App Router structure
- Add root layout with metadata
- Add error and not-found pages

SubPhase-03 Group B complete
```

### Next Steps
Proceed to [Group C](../Group-C_TypeScript-Configuration/00_GROUP_OVERVIEW.md) for TypeScript configuration.

---

## Notes for AI Agents

1. **App Router:** All files in app/ directory
2. **Server Components:** Default for layout, page, not-found
3. **Client Components:** Required for error.tsx
4. **Metadata:** Use metadata export, not Head component
5. **Git:** Commit after completing Group B
