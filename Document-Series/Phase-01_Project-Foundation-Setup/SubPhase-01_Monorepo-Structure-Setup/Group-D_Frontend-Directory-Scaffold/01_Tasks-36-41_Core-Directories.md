# Tasks 36-41: Frontend Core Directories

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 01 - Monorepo Structure Setup  
> **Group:** D - Frontend Directory Scaffold  
> **Document:** 01 of 03  
> **Tasks Covered:** 36, 37, 38, 39, 40, 41

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-C_Backend-Directory-Scaffold/](../Group-C_Backend-Directory-Scaffold/)
- **→ Next Document:** [02_Tasks-42-46_Feature-Directories.md](02_Tasks-42-46_Feature-Directories.md)

---

## Document Overview

This document covers the creation of the core frontend directories that form the foundation of the Next.js 14+ application. These directories house the App Router, components, utilities, hooks, types, and styles.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 36 | Create frontend/app/ Directory | Simple |
| 37 | Create frontend/components/ Directory | Simple |
| 38 | Create frontend/lib/ Directory | Simple |
| 39 | Create frontend/hooks/ Directory | Simple |
| 40 | Create frontend/types/ Directory | Simple |
| 41 | Create frontend/styles/ Directory | Simple |

---

## Task 36: Create frontend/app/ Directory

### Overview
Create the app directory for Next.js 14+ App Router, which contains all routes, layouts, and pages.

### Dependencies
- Task 12: Create frontend/ Directory (Group B)

### Instructions

1. **Create the app directory**
   - Create a directory named `app/` inside `frontend/`
   - This is the root of Next.js App Router

2. **Add .gitkeep file**
   - Create an empty `.gitkeep` file inside the directory
   - This ensures Git tracks the empty directory

3. **Purpose of this directory**
   - Route definitions (folder-based routing)
   - Page components (page.tsx files)
   - Layout components (layout.tsx files)
   - Loading states (loading.tsx)
   - Error boundaries (error.tsx)
   - API routes (route.ts files)

### App Router Structure Reference

| File/Folder (Future) | Purpose |
|---------------------|---------|
| `layout.tsx` | Root layout with providers |
| `page.tsx` | Home page |
| `loading.tsx` | Global loading state |
| `error.tsx` | Global error boundary |
| `not-found.tsx` | 404 page |
| `(auth)/` | Authentication route group |
| `(dashboard)/` | Dashboard route group |
| `(pos)/` | POS system routes |
| `(webstore)/` | Webstore routes |
| `api/` | API routes (if needed) |

### Route Groups Strategy

| Group | Routes | Purpose |
|-------|--------|---------|
| `(auth)` | /login, /register, /forgot-password | Authentication flows |
| `(dashboard)` | /dashboard/* | ERP admin dashboard |
| `(pos)` | /pos/* | Point of Sale system |
| `(webstore)` | /store/* | E-commerce storefront |

### Expected Outcome
```
frontend/
├── app/
│   └── .gitkeep
└── .gitkeep
```

### Verification Checklist
- [ ] `frontend/app/` directory exists
- [ ] `.gitkeep` file exists inside `app/`
- [ ] Directory is tracked by Git

---

## Task 37: Create frontend/components/ Directory

### Overview
Create the components directory that will contain all reusable React components organized by category.

### Dependencies
- Task 12: Create frontend/ Directory (Group B)

### Instructions

1. **Create the components directory**
   - Create a directory named `components/` inside `frontend/`
   - This holds all reusable React components

2. **Add .gitkeep file**
   - Create an empty `.gitkeep` file inside the directory
   - This ensures Git tracks the empty directory

3. **Purpose of this directory**
   - Shadcn/UI components
   - Custom reusable components
   - Layout components
   - Form components
   - Data display components

### Component Organization Strategy

| Subdirectory (Future) | Purpose |
|----------------------|---------|
| `ui/` | Shadcn/UI primitive components |
| `layout/` | Layout components (Header, Footer, Sidebar) |
| `forms/` | Form components and inputs |
| `data-display/` | Tables, cards, lists |
| `feedback/` | Alerts, toasts, modals |
| `navigation/` | Menus, breadcrumbs, tabs |
| `pos/` | POS-specific components |
| `webstore/` | Webstore-specific components |

### Component Naming Convention

| Pattern | Example | Purpose |
|---------|---------|---------|
| PascalCase | `ProductCard.tsx` | Component files |
| index.ts | `index.ts` | Barrel exports |
| kebab-case folders | `data-display/` | Category folders |

### Shadcn/UI Components (Planned)

| Category | Components |
|----------|------------|
| **Form** | Button, Input, Select, Checkbox, Radio |
| **Data Display** | Table, Card, Badge, Avatar |
| **Feedback** | Alert, Toast, Dialog, Progress |
| **Navigation** | Tabs, Breadcrumb, Pagination |
| **Layout** | Sheet, Separator, Scroll Area |

### Expected Outcome
```
frontend/
├── app/
│   └── .gitkeep
├── components/
│   └── .gitkeep
└── .gitkeep
```

### Verification Checklist
- [ ] `frontend/components/` directory exists
- [ ] `.gitkeep` file exists inside `components/`
- [ ] Directory is tracked by Git

---

## Task 38: Create frontend/lib/ Directory

### Overview
Create the lib directory for utility functions, helper modules, and shared functionality.

### Dependencies
- Task 12: Create frontend/ Directory (Group B)

### Instructions

1. **Create the lib directory**
   - Create a directory named `lib/` inside `frontend/`
   - This holds utility functions and helpers

2. **Add .gitkeep file**
   - Create an empty `.gitkeep` file inside the directory
   - This ensures Git tracks the empty directory

3. **Purpose of this directory**
   - Utility functions (formatting, validation)
   - API client configuration
   - Authentication helpers
   - Date/time utilities
   - Currency formatting (LKR)

### Planned Utilities Reference

| File (Future) | Purpose |
|---------------|---------|
| `utils.ts` | General utility functions |
| `cn.ts` | Tailwind class name merger (Shadcn pattern) |
| `api.ts` | API client configuration (fetch/axios) |
| `auth.ts` | Authentication utilities |
| `format.ts` | Formatting functions |
| `validation.ts` | Validation utilities |
| `storage.ts` | LocalStorage/SessionStorage helpers |

### Sri Lanka-Specific Utilities

| Utility | Purpose |
|---------|---------|
| `formatLKR()` | Format currency as LKR (₨) |
| `formatPhone()` | Format Sri Lankan phone (+94) |
| `formatNIC()` | Format/validate NIC number |
| `formatDate()` | Format date for Asia/Colombo |
| `transliterate()` | Sinhaglish to Sinhala conversion |

### Expected Outcome
```
frontend/
├── app/
│   └── .gitkeep
├── components/
│   └── .gitkeep
├── lib/
│   └── .gitkeep
└── .gitkeep
```

### Verification Checklist
- [ ] `frontend/lib/` directory exists
- [ ] `.gitkeep` file exists inside `lib/`
- [ ] Directory is tracked by Git

---

## Task 39: Create frontend/hooks/ Directory

### Overview
Create the hooks directory for custom React hooks that encapsulate reusable stateful logic.

### Dependencies
- Task 12: Create frontend/ Directory (Group B)

### Instructions

1. **Create the hooks directory**
   - Create a directory named `hooks/` inside `frontend/`
   - This holds all custom React hooks

2. **Add .gitkeep file**
   - Create an empty `.gitkeep` file inside the directory
   - This ensures Git tracks the empty directory

3. **Purpose of this directory**
   - Data fetching hooks (React Query wrappers)
   - Form handling hooks
   - Authentication hooks
   - UI state hooks
   - Debounce/throttle hooks

### Planned Hooks Reference

| Hook (Future) | Purpose |
|---------------|---------|
| `useAuth.ts` | Authentication state and actions |
| `useUser.ts` | Current user data |
| `useTenant.ts` | Tenant context data |
| `useCart.ts` | Shopping cart state (POS/Webstore) |
| `useProducts.ts` | Product data fetching |
| `useDebounce.ts` | Debounced value hook |
| `useLocalStorage.ts` | Persistent state hook |
| `useMediaQuery.ts` | Responsive breakpoint hook |
| `useOnlineStatus.ts` | Network connectivity hook |

### Hook Naming Convention
- All hooks start with `use` prefix
- Use camelCase: `useProductSearch`
- One hook per file
- Export as named export

### React Query Integration

| Hook Pattern | Purpose |
|--------------|---------|
| `useQuery` wrappers | GET requests |
| `useMutation` wrappers | POST/PUT/DELETE requests |
| `useInfiniteQuery` wrappers | Paginated lists |
| Prefetch utilities | SSR data prefetching |

### Expected Outcome
```
frontend/
├── app/
│   └── .gitkeep
├── components/
│   └── .gitkeep
├── hooks/
│   └── .gitkeep
├── lib/
│   └── .gitkeep
└── .gitkeep
```

### Verification Checklist
- [ ] `frontend/hooks/` directory exists
- [ ] `.gitkeep` file exists inside `hooks/`
- [ ] Directory is tracked by Git

---

## Task 40: Create frontend/types/ Directory

### Overview
Create the types directory for TypeScript type definitions, interfaces, and type utilities.

### Dependencies
- Task 12: Create frontend/ Directory (Group B)

### Instructions

1. **Create the types directory**
   - Create a directory named `types/` inside `frontend/`
   - This holds TypeScript type definitions

2. **Add .gitkeep file**
   - Create an empty `.gitkeep` file inside the directory
   - This ensures Git tracks the empty directory

3. **Purpose of this directory**
   - API response types
   - Entity types (User, Product, Order)
   - Component prop types
   - Form types
   - Utility types

### Planned Type Files Reference

| File (Future) | Purpose |
|---------------|---------|
| `api.ts` | API response/request types |
| `user.ts` | User and auth types |
| `product.ts` | Product catalog types |
| `order.ts` | Order and cart types |
| `tenant.ts` | Tenant and domain types |
| `common.ts` | Common utility types |
| `forms.ts` | Form data types |

### Type Organization Pattern

| Pattern | Example | Use Case |
|---------|---------|----------|
| Entity types | `interface Product {}` | Data models |
| API types | `type ProductResponse = {}` | API responses |
| Prop types | `interface CardProps {}` | Component props |
| Form types | `type LoginForm = {}` | Form data |

### Shared Types Note
- Some types are shared with backend via `shared/types/`
- Frontend-specific types go here
- API response types should match DRF serializers

### Expected Outcome
```
frontend/
├── app/
│   └── .gitkeep
├── components/
│   └── .gitkeep
├── hooks/
│   └── .gitkeep
├── lib/
│   └── .gitkeep
├── types/
│   └── .gitkeep
└── .gitkeep
```

### Verification Checklist
- [ ] `frontend/types/` directory exists
- [ ] `.gitkeep` file exists inside `types/`
- [ ] Directory is tracked by Git

---

## Task 41: Create frontend/styles/ Directory

### Overview
Create the styles directory for global CSS, Tailwind configuration, and theme customization.

### Dependencies
- Task 12: Create frontend/ Directory (Group B)

### Instructions

1. **Create the styles directory**
   - Create a directory named `styles/` inside `frontend/`
   - This holds global styles and theme files

2. **Add .gitkeep file**
   - Create an empty `.gitkeep` file inside the directory
   - This ensures Git tracks the empty directory

3. **Purpose of this directory**
   - Global CSS styles
   - Tailwind base/component/utility layers
   - CSS custom properties (variables)
   - Font imports
   - Animation definitions

### Planned Style Files Reference

| File (Future) | Purpose |
|---------------|---------|
| `globals.css` | Global styles and Tailwind directives |
| `variables.css` | CSS custom properties |
| `animations.css` | Custom animations |
| `fonts.css` | Font face definitions |
| `print.css` | Print styles (receipts, invoices) |

### Tailwind Configuration Notes

| Aspect | Configuration |
|--------|---------------|
| Theme extension | Custom colors, fonts |
| Dark mode | Class-based dark mode |
| Plugins | Typography, forms, aspect-ratio |
| Content paths | app, components directories |

### CSS Custom Properties (Planned)

| Category | Variables |
|----------|-----------|
| **Colors** | --primary, --secondary, --accent |
| **Spacing** | --spacing-xs, --spacing-sm, etc. |
| **Typography** | --font-sans, --font-mono |
| **Shadows** | --shadow-sm, --shadow-md |
| **Borders** | --radius-sm, --radius-md |

### Expected Outcome
```
frontend/
├── app/
│   └── .gitkeep
├── components/
│   └── .gitkeep
├── hooks/
│   └── .gitkeep
├── lib/
│   └── .gitkeep
├── styles/
│   └── .gitkeep
├── types/
│   └── .gitkeep
└── .gitkeep
```

### Verification Checklist
- [ ] `frontend/styles/` directory exists
- [ ] `.gitkeep` file exists inside `styles/`
- [ ] Directory is tracked by Git

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 36 | Create frontend/app/ Directory | `frontend/app/` with `.gitkeep` |
| 37 | Create frontend/components/ Directory | `frontend/components/` with `.gitkeep` |
| 38 | Create frontend/lib/ Directory | `frontend/lib/` with `.gitkeep` |
| 39 | Create frontend/hooks/ Directory | `frontend/hooks/` with `.gitkeep` |
| 40 | Create frontend/types/ Directory | `frontend/types/` with `.gitkeep` |
| 41 | Create frontend/styles/ Directory | `frontend/styles/` with `.gitkeep` |

### Current Frontend Structure
```
frontend/
├── app/
│   └── .gitkeep
├── components/
│   └── .gitkeep
├── hooks/
│   └── .gitkeep
├── lib/
│   └── .gitkeep
├── styles/
│   └── .gitkeep
├── types/
│   └── .gitkeep
└── .gitkeep
```

### Next Steps
Proceed to [02_Tasks-42-46_Feature-Directories.md](02_Tasks-42-46_Feature-Directories.md) to create feature directories.

---

## Notes for AI Agents

1. **Parallel Execution:** Tasks 36-41 can be executed simultaneously
2. **Empty Directories:** Always add `.gitkeep` to ensure Git tracks them
3. **App Router:** This uses Next.js 14+ App Router (not Pages Router)
4. **No Code Yet:** These are placeholder directories
5. **Git Commit:** Do NOT commit yet - wait until all Group D tasks are complete
