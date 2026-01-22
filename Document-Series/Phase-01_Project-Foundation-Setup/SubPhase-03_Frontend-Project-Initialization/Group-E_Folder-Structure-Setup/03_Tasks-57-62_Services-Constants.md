# Tasks 57-62: Services, Constants, and Setup Files

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 03 - Frontend Project Initialization  
> **Group:** E - Folder Structure Setup  
> **Document:** 03 of 03  
> **Tasks Covered:** 57, 58, 59, 60, 61, 62

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-51-56_Lib-Hooks-Stores.md](02_Tasks-51-56_Lib-Hooks-Stores.md)
- **→ Next Group:** [../Group-F_Path-Aliases-Module-Resolution/00_GROUP_OVERVIEW.md](../Group-F_Path-Aliases-Module-Resolution/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document covers creating the services directory for API clients, constants directory for configuration, public directory setup, and .gitkeep files for empty directories.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 57 | Create services/ Directory | Simple |
| 58 | Create services/api.ts | Medium |
| 59 | Create constants/ Directory | Simple |
| 60 | Create constants/config.ts | Medium |
| 61 | Create public/ Directory Setup | Simple |
| 62 | Create .gitkeep Files | Simple |

---

## Task 57: Create services/ Directory

### Overview
Create the services directory for API clients and external service integrations.

### Dependencies
- Task 14: Create App Layout

### Instructions

1. **Create services directory**
   - Create in src/

2. **Add index.ts barrel**
   - Export all services

3. **Plan service modules**
   - API client, auth, etc.

### File Location

```
frontend/
└── src/
    └── services/
        └── index.ts
```

### Services Planned

| Service | Purpose |
|---------|---------|
| api.ts | Base API client |
| auth.ts | Authentication |
| products.ts | Product API |
| orders.ts | Order API |
| customers.ts | Customer API |
| inventory.ts | Inventory API |
| pos.ts | POS operations |

### Service Pattern

```typescript
// services/products.ts
import { api } from './api'

export const productService = {
  getAll: () => api.get('/products'),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (data: CreateProduct) => api.post('/products', data),
  update: (id: string, data: UpdateProduct) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
}
```

### Initial index.ts

```typescript
// services/index.ts
// API services for backend communication

export { api } from './api'
// export { authService } from './auth'
// export { productService } from './products'
```

### Expected Outcome
- services/ directory exists
- Barrel export ready

### Verification Checklist
- [ ] Directory created at src/services/
- [ ] index.ts file created
- [ ] Service pattern established

---

## Task 58: Create services/api.ts

### Overview
Create the base API client with fetch wrapper and typed responses.

### Dependencies
- Task 57: Create services/ Directory

### Instructions

1. **Create api.ts file**
   - Create in services/

2. **Implement fetch wrapper**
   - Type-safe requests

3. **Add error handling**
   - Custom API errors

4. **Add request interceptors**
   - Auth headers
   - Tenant context

### File Location

```
frontend/
└── src/
    └── services/
        └── api.ts
```

### API Client Structure

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

interface ApiResponse<T> {
  data: T
  message?: string
}

interface ApiError {
  message: string
  code?: string
  details?: Record<string, string[]>
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    }

    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw await this.handleError(response)
    }

    return response.json()
  }

  private getAuthHeaders(): HeadersInit {
    // Get auth token from storage
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('accessToken')
      : null
    
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  private async handleError(response: Response): Promise<ApiError> {
    try {
      const error = await response.json()
      return error
    } catch {
      return { message: 'An unexpected error occurred' }
    }
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  post<T>(endpoint: string, data?: unknown) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  put<T>(endpoint: string, data?: unknown) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  patch<T>(endpoint: string, data?: unknown) {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

export const api = new ApiClient(API_BASE_URL)
```

### Error Handling Pattern

```typescript
try {
  const data = await api.get<Product[]>('/products')
} catch (error) {
  if (error instanceof ApiError) {
    // Handle API error
  }
}
```

### Multi-Tenant Context

```typescript
private getTenantHeaders(): HeadersInit {
  // Tenant subdomain from window location
  const hostname = typeof window !== 'undefined' 
    ? window.location.hostname
    : ''
  return { 'X-Tenant': hostname.split('.')[0] }
}
```

### Expected Outcome
- api.ts with fetch wrapper
- Type-safe methods

### Verification Checklist
- [ ] File created at services/api.ts
- [ ] CRUD methods implemented
- [ ] Error handling added
- [ ] Auth headers support

---

## Task 59: Create constants/ Directory

### Overview
Create the constants directory for application configuration and static values.

### Dependencies
- Task 14: Create App Layout

### Instructions

1. **Create constants directory**
   - Create in src/

2. **Add index.ts barrel**
   - Export all constants

3. **Plan constant modules**
   - Config, routes, enums

### File Location

```
frontend/
└── src/
    └── constants/
        └── index.ts
```

### Constants Planned

| File | Purpose |
|------|---------|
| config.ts | App configuration |
| routes.ts | Route paths |
| enums.ts | Enumeration values |
| srilanka.ts | SL-specific values |

### Initial index.ts

```typescript
// constants/index.ts
// Application constants and configuration

export * from './config'
// export * from './routes'
// export * from './enums'
// export * from './srilanka'
```

### Expected Outcome
- constants/ directory exists
- Barrel export ready

### Verification Checklist
- [ ] Directory created at src/constants/
- [ ] index.ts file created
- [ ] Modules planned

---

## Task 60: Create constants/config.ts

### Overview
Create the application configuration constants file.

### Dependencies
- Task 59: Create constants/ Directory

### Instructions

1. **Create config.ts file**
   - Create in constants/

2. **Define app metadata**
   - Name, version, etc.

3. **Define feature flags**
   - Toggle features

4. **Add Sri Lanka config**
   - Currency, timezone

### File Location

```
frontend/
└── src/
    └── constants/
        └── config.ts
```

### Configuration Content

```typescript
// constants/config.ts

export const APP_CONFIG = {
  name: 'LankaCommerce Cloud',
  shortName: 'LCC',
  version: '1.0.0',
  description: 'Multi-tenant SaaS ERP for Sri Lankan SMEs',
} as const

export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 30000,
} as const

export const AUTH_CONFIG = {
  tokenKey: 'accessToken',
  refreshKey: 'refreshToken',
  expiryBuffer: 60, // seconds
} as const

export const PAGINATION = {
  defaultPageSize: 20,
  pageSizeOptions: [10, 20, 50, 100],
} as const
```

### Sri Lanka Configuration

```typescript
export const SRI_LANKA = {
  currency: {
    code: 'LKR',
    symbol: '₨',
    name: 'Sri Lankan Rupee',
    decimals: 2,
  },
  timezone: 'Asia/Colombo',
  locale: 'en-LK',
  phonePrefix: '+94',
  phoneFormat: '+94 XX XXX XXXX',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: 'HH:mm',
} as const
```

### Feature Flags

```typescript
export const FEATURES = {
  darkMode: true,
  aiRecommendations: false,
  multiLanguage: true,
  smsNotifications: true,
  webstore: true,
  posSystem: true,
} as const
```

### Type Safety

```typescript
// Use 'as const' for literal types
type AppConfig = typeof APP_CONFIG
type SriLankaConfig = typeof SRI_LANKA
```

### Expected Outcome
- config.ts with app settings
- Sri Lanka specifics

### Verification Checklist
- [ ] File created at constants/config.ts
- [ ] APP_CONFIG defined
- [ ] SRI_LANKA config added
- [ ] as const for type safety

---

## Task 61: Create public/ Directory Setup

### Overview
Set up the public directory for static assets like images and fonts.

### Dependencies
- Task 14: Create App Layout

### Instructions

1. **Verify public directory**
   - Next.js creates it

2. **Create subdirectories**
   - images, icons, fonts

3. **Add placeholder files**
   - favicon.ico, robots.txt

### Directory Structure

```
frontend/
└── public/
    ├── images/
    │   ├── logo.svg
    │   └── placeholder.png
    ├── icons/
    │   ├── icon-192.png
    │   └── icon-512.png
    ├── fonts/
    │   └── .gitkeep
    ├── favicon.ico
    ├── robots.txt
    └── manifest.json
```

### Static Assets

| Asset | Purpose |
|-------|---------|
| favicon.ico | Browser tab icon |
| robots.txt | SEO crawling rules |
| manifest.json | PWA manifest |
| logo.svg | App logo |
| og-image.png | Social sharing |

### robots.txt Content

```
User-agent: *
Allow: /

# Sitemap
Sitemap: https://example.com/sitemap.xml
```

### manifest.json Content

```json
{
  "name": "LankaCommerce Cloud",
  "short_name": "LCC",
  "description": "Multi-tenant SaaS ERP",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#006D35",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Expected Outcome
- public/ directory organized
- Static assets ready

### Verification Checklist
- [ ] public/images/ exists
- [ ] public/icons/ exists
- [ ] favicon.ico placeholder
- [ ] robots.txt created

---

## Task 62: Create .gitkeep Files

### Overview
Add .gitkeep files to empty directories for Git tracking.

### Dependencies
- Tasks 46-61 (all directories created)

### Instructions

1. **Identify empty directories**
   - No files yet

2. **Add .gitkeep to each**
   - Empty file

3. **List all locations**
   - Track in document

### Why .gitkeep

Git does not track empty directories.
.gitkeep is a convention (not Git feature).

### Directories Requiring .gitkeep

| Directory | Needs .gitkeep |
|-----------|----------------|
| components/ui/ | If empty |
| components/layout/ | If empty |
| components/forms/ | If empty |
| components/common/ | If empty |
| hooks/ | If only index.ts |
| stores/ | If empty |
| public/images/ | If empty |
| public/icons/ | If empty |
| public/fonts/ | Always empty |

### .gitkeep Content

Empty file or with comment:
```
# This file keeps the directory in Git
```

### Command to Create

```bash
touch frontend/src/components/ui/.gitkeep
touch frontend/src/components/layout/.gitkeep
touch frontend/src/components/forms/.gitkeep
touch frontend/src/components/common/.gitkeep
touch frontend/public/fonts/.gitkeep
```

### Alternative: .gitignore

Some projects use:
```
# Keep this directory
!.gitignore
```

### Expected Outcome
- Empty directories tracked
- Git commits include structure

### Verification Checklist
- [ ] All empty dirs have .gitkeep
- [ ] Git status shows files
- [ ] Structure preserved

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 57 | Create services/ Directory | Services folder |
| 58 | Create services/api.ts | API client |
| 59 | Create constants/ Directory | Constants folder |
| 60 | Create constants/config.ts | App configuration |
| 61 | Create public/ Directory Setup | Static assets |
| 62 | Create .gitkeep Files | Empty dir tracking |

### Files Created

```
frontend/
├── public/
│   ├── fonts/
│   │   └── .gitkeep
│   ├── icons/
│   │   └── .gitkeep
│   ├── images/
│   │   └── .gitkeep
│   ├── favicon.ico
│   ├── manifest.json
│   └── robots.txt
└── src/
    ├── constants/
    │   ├── index.ts
    │   └── config.ts
    └── services/
        ├── index.ts
        └── api.ts
```

### Group E Complete

All folder structure tasks completed:
- Components directories (ui, layout, forms, common)
- Library utilities (utils, cn)
- Custom hooks directory
- Zustand stores directory
- API services with client
- Constants and config
- Public assets setup
- .gitkeep files added

### Next Steps
Proceed to [../Group-F_Path-Aliases-Module-Resolution/00_GROUP_OVERVIEW.md](../Group-F_Path-Aliases-Module-Resolution/00_GROUP_OVERVIEW.md) for path aliases.

---

## Notes for AI Agents

1. **API Client:** Class-based for extensibility
2. **Sri Lanka:** Currency, timezone, phone format
3. **as const:** Use for literal types
4. **.gitkeep:** Empty file to track directories
5. **PWA:** manifest.json for installable app
6. **Git:** Commit after Group E complete
