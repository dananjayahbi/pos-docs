# Tasks 42-46: Frontend Feature Directories

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 01 - Monorepo Structure Setup  
> **Group:** D - Frontend Directory Scaffold  
> **Document:** 02 of 03  
> **Tasks Covered:** 42, 43, 44, 45, 46

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-36-41_Core-Directories.md](01_Tasks-36-41_Core-Directories.md)
- **→ Next Document:** [03_Tasks-47-50_Config-Files.md](03_Tasks-47-50_Config-Files.md)

---

## Document Overview

This document covers the creation of frontend feature directories for static assets, state management, API services, constants, and testing.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 42 | Create frontend/public/ Directory | Simple |
| 43 | Create frontend/stores/ Directory | Simple |
| 44 | Create frontend/services/ Directory | Simple |
| 45 | Create frontend/constants/ Directory | Simple |
| 46 | Create frontend/__tests__/ Directory | Simple |

---

## Task 42: Create frontend/public/ Directory

### Overview
Create the public directory for static assets that are served directly by Next.js without processing.

### Dependencies
- Task 12: Create frontend/ Directory (Group B)

### Instructions

1. **Create the public directory**
   - Create a directory named `public/` inside `frontend/`
   - This holds static assets served at root URL

2. **Add .gitkeep file**
   - Create an empty `.gitkeep` file inside the directory
   - This ensures Git tracks the empty directory

3. **Purpose of this directory**
   - Static images (logos, icons)
   - Favicon and app icons
   - Fonts (if not using CDN)
   - robots.txt and sitemap.xml
   - Any files that need direct URL access

### Planned Subdirectories Reference

| Subdirectory (Future) | Purpose |
|----------------------|---------|
| `images/` | Static images |
| `icons/` | App icons, favicons |
| `fonts/` | Custom font files |

### Static Files Reference

| File (Future) | Purpose | URL |
|---------------|---------|-----|
| `favicon.ico` | Browser tab icon | `/favicon.ico` |
| `logo.svg` | Main logo | `/logo.svg` |
| `robots.txt` | Search engine directives | `/robots.txt` |
| `sitemap.xml` | Site map for SEO | `/sitemap.xml` |
| `manifest.json` | PWA manifest | `/manifest.json` |

### PWA Assets (Planned)

| Asset | Size | Purpose |
|-------|------|---------|
| `icon-192.png` | 192x192 | Android home screen |
| `icon-512.png` | 512x512 | Android splash screen |
| `apple-icon.png` | 180x180 | iOS home screen |

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
├── public/
│   └── .gitkeep
├── styles/
│   └── .gitkeep
├── types/
│   └── .gitkeep
└── .gitkeep
```

### Verification Checklist
- [ ] `frontend/public/` directory exists
- [ ] `.gitkeep` file exists inside `public/`
- [ ] Directory is tracked by Git

---

## Task 43: Create frontend/stores/ Directory

### Overview
Create the stores directory for Zustand state management stores.

### Dependencies
- Task 12: Create frontend/ Directory (Group B)

### Instructions

1. **Create the stores directory**
   - Create a directory named `stores/` inside `frontend/`
   - This holds all Zustand store definitions

2. **Add .gitkeep file**
   - Create an empty `.gitkeep` file inside the directory
   - This ensures Git tracks the empty directory

3. **Purpose of this directory**
   - Global state management stores
   - Feature-specific stores
   - Persisted state stores
   - Store slices and middleware

### Planned Stores Reference

| Store (Future) | Purpose | Persisted |
|----------------|---------|-----------|
| `useAuthStore.ts` | Authentication state | Yes (token) |
| `useUserStore.ts` | User profile data | No |
| `useCartStore.ts` | Shopping cart | Yes |
| `usePOSStore.ts` | POS session state | Yes (offline) |
| `useUIStore.ts` | UI state (sidebar, theme) | Yes |
| `useNotificationStore.ts` | Toast notifications | No |

### Zustand Store Pattern

| Element | Purpose |
|---------|---------|
| State definition | Data structure |
| Actions | State mutations |
| Selectors | Computed values |
| Middleware | Persist, devtools |

### State Categories

| Category | Scope | Persistence |
|----------|-------|-------------|
| **Auth** | Global | Token only |
| **User** | Global | No |
| **Cart** | Per-session | LocalStorage |
| **POS** | Per-session | IndexedDB (offline) |
| **UI** | Global | LocalStorage |

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
├── public/
│   └── .gitkeep
├── stores/
│   └── .gitkeep
├── styles/
│   └── .gitkeep
├── types/
│   └── .gitkeep
└── .gitkeep
```

### Verification Checklist
- [ ] `frontend/stores/` directory exists
- [ ] `.gitkeep` file exists inside `stores/`
- [ ] Directory is tracked by Git

---

## Task 44: Create frontend/services/ Directory

### Overview
Create the services directory for API client functions and external service integrations.

### Dependencies
- Task 12: Create frontend/ Directory (Group B)

### Instructions

1. **Create the services directory**
   - Create a directory named `services/` inside `frontend/`
   - This holds API client and service functions

2. **Add .gitkeep file**
   - Create an empty `.gitkeep` file inside the directory
   - This ensures Git tracks the empty directory

3. **Purpose of this directory**
   - API endpoint functions
   - HTTP client configuration
   - External service integrations
   - Request/response interceptors

### Planned Service Files Reference

| File (Future) | Purpose |
|---------------|---------|
| `api.ts` | Base API client configuration |
| `auth.service.ts` | Authentication API calls |
| `products.service.ts` | Product CRUD operations |
| `orders.service.ts` | Order management API |
| `customers.service.ts` | Customer data API |
| `payments.service.ts` | Payment processing |
| `reports.service.ts` | Reporting API |

### Service Organization Pattern

| Layer | Responsibility |
|-------|---------------|
| API Client | Base configuration, interceptors |
| Service Functions | Endpoint-specific calls |
| React Query Hooks | Data fetching integration |

### API Client Configuration

| Feature | Implementation |
|---------|---------------|
| Base URL | Environment variable |
| Auth headers | Token interceptor |
| Error handling | Global error handler |
| Retry logic | Exponential backoff |
| Tenant context | Subdomain detection |

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
├── public/
│   └── .gitkeep
├── services/
│   └── .gitkeep
├── stores/
│   └── .gitkeep
├── styles/
│   └── .gitkeep
├── types/
│   └── .gitkeep
└── .gitkeep
```

### Verification Checklist
- [ ] `frontend/services/` directory exists
- [ ] `.gitkeep` file exists inside `services/`
- [ ] Directory is tracked by Git

---

## Task 45: Create frontend/constants/ Directory

### Overview
Create the constants directory for application-wide constant values and configuration.

### Dependencies
- Task 12: Create frontend/ Directory (Group B)

### Instructions

1. **Create the constants directory**
   - Create a directory named `constants/` inside `frontend/`
   - This holds constant values and enums

2. **Add .gitkeep file**
   - Create an empty `.gitkeep` file inside the directory
   - This ensures Git tracks the empty directory

3. **Purpose of this directory**
   - Application constants
   - Enum-like objects
   - Configuration values
   - Route paths
   - API endpoints

### Planned Constant Files Reference

| File (Future) | Purpose |
|---------------|---------|
| `routes.ts` | Route path constants |
| `api-endpoints.ts` | API endpoint paths |
| `status.ts` | Status code constants |
| `config.ts` | App configuration |
| `theme.ts` | Theme constants |
| `validation.ts` | Validation rules |

### Sri Lanka-Specific Constants

| Constant | Purpose | Example |
|----------|---------|---------|
| `CURRENCY` | Currency code | `LKR` |
| `CURRENCY_SYMBOL` | Currency symbol | `₨` |
| `TIMEZONE` | Default timezone | `Asia/Colombo` |
| `PHONE_PREFIX` | Phone prefix | `+94` |
| `DISTRICTS` | Sri Lanka districts | `['Colombo', ...]` |
| `PROVINCES` | Sri Lanka provinces | `['Western', ...]` |

### Route Constants Pattern

| Category | Example |
|----------|---------|
| Auth routes | `AUTH.LOGIN = '/login'` |
| Dashboard routes | `DASHBOARD.HOME = '/dashboard'` |
| POS routes | `POS.SALE = '/pos/sale'` |
| Webstore routes | `STORE.PRODUCTS = '/store/products'` |

### Expected Outcome
```
frontend/
├── app/
│   └── .gitkeep
├── components/
│   └── .gitkeep
├── constants/
│   └── .gitkeep
├── hooks/
│   └── .gitkeep
├── lib/
│   └── .gitkeep
├── public/
│   └── .gitkeep
├── services/
│   └── .gitkeep
├── stores/
│   └── .gitkeep
├── styles/
│   └── .gitkeep
├── types/
│   └── .gitkeep
└── .gitkeep
```

### Verification Checklist
- [ ] `frontend/constants/` directory exists
- [ ] `.gitkeep` file exists inside `constants/`
- [ ] Directory is tracked by Git

---

## Task 46: Create frontend/__tests__/ Directory

### Overview
Create the tests directory for frontend unit tests, component tests, and integration tests.

### Dependencies
- Task 12: Create frontend/ Directory (Group B)

### Instructions

1. **Create the __tests__ directory**
   - Create a directory named `__tests__/` inside `frontend/`
   - This holds all frontend test files

2. **Add .gitkeep file**
   - Create an empty `.gitkeep` file inside the directory
   - This ensures Git tracks the empty directory

3. **Purpose of this directory**
   - Component unit tests
   - Hook tests
   - Utility function tests
   - Integration tests
   - Mock files and test utilities

### Planned Test Structure Reference

| Subdirectory (Future) | Purpose |
|----------------------|---------|
| `components/` | Component tests |
| `hooks/` | Custom hook tests |
| `utils/` | Utility function tests |
| `integration/` | Integration tests |
| `__mocks__/` | Mock modules |
| `setup/` | Test setup files |

### Testing Framework Stack

| Tool | Purpose |
|------|---------|
| **Jest** or **Vitest** | Test runner |
| **React Testing Library** | Component testing |
| **MSW** | API mocking |
| **user-event** | User interaction simulation |

### Test File Naming Convention

| Pattern | Example | Purpose |
|---------|---------|---------|
| `*.test.ts` | `utils.test.ts` | Unit tests |
| `*.test.tsx` | `Button.test.tsx` | Component tests |
| `*.spec.ts` | `api.spec.ts` | Integration tests |

### Test Organization Pattern

| Location | Test Type |
|----------|-----------|
| `__tests__/components/` | Shared component tests |
| `components/ui/__tests__/` | Co-located component tests |
| `__tests__/hooks/` | Hook tests |
| `__tests__/integration/` | API integration tests |

### Expected Outcome
```
frontend/
├── app/
│   └── .gitkeep
├── components/
│   └── .gitkeep
├── constants/
│   └── .gitkeep
├── hooks/
│   └── .gitkeep
├── lib/
│   └── .gitkeep
├── public/
│   └── .gitkeep
├── services/
│   └── .gitkeep
├── stores/
│   └── .gitkeep
├── styles/
│   └── .gitkeep
├── types/
│   └── .gitkeep
├── __tests__/
│   └── .gitkeep
└── .gitkeep
```

### Verification Checklist
- [ ] `frontend/__tests__/` directory exists
- [ ] `.gitkeep` file exists inside `__tests__/`
- [ ] Directory is tracked by Git

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 42 | Create frontend/public/ Directory | `frontend/public/` with `.gitkeep` |
| 43 | Create frontend/stores/ Directory | `frontend/stores/` with `.gitkeep` |
| 44 | Create frontend/services/ Directory | `frontend/services/` with `.gitkeep` |
| 45 | Create frontend/constants/ Directory | `frontend/constants/` with `.gitkeep` |
| 46 | Create frontend/__tests__/ Directory | `frontend/__tests__/` with `.gitkeep` |

### Current Frontend Structure
```
frontend/
├── app/
│   └── .gitkeep
├── components/
│   └── .gitkeep
├── constants/
│   └── .gitkeep
├── hooks/
│   └── .gitkeep
├── lib/
│   └── .gitkeep
├── public/
│   └── .gitkeep
├── services/
│   └── .gitkeep
├── stores/
│   └── .gitkeep
├── styles/
│   └── .gitkeep
├── types/
│   └── .gitkeep
├── __tests__/
│   └── .gitkeep
└── .gitkeep
```

### Next Steps
Proceed to [03_Tasks-47-50_Config-Files.md](03_Tasks-47-50_Config-Files.md) to create configuration files.

---

## Notes for AI Agents

1. **Parallel Execution:** Tasks 42-46 can be executed simultaneously
2. **Empty Directories:** Always add `.gitkeep` to ensure Git tracks them
3. **Zustand:** State management uses Zustand (not Redux)
4. **No Code Yet:** These are placeholder directories
5. **Git Commit:** Do NOT commit yet - wait until all Group D tasks are complete
