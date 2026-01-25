# Tasks 39-46: Dashboard, API, and Shared Directories

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 01 - Next.js Project Setup  
> **Group:** C - App Router Structure  
> **Document:** 02 of 02  
> **Tasks Covered:** 39, 40, 41, 42, 43, 44, 45, 46

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-31-38_App-Root-Auth.md](01_Tasks-31-38_App-Root-Auth.md)

---

## Document Overview

This document covers the creation of the dashboard route group with its protected layout, API routes for backend communication, and shared directories for components, utilities, hooks, and types. These elements establish the structure for the protected ERP dashboard area and reusable code organization patterns.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 39 | Create (dashboard) Route Group | Low | 10 min |
| 40 | Create (dashboard) Layout | Medium | 40 min |
| 41 | Create api/ Route Directory | Low | 5 min |
| 42 | Create Health Check API Route | Low | 15 min |
| 43 | Create components/ Directory | Low | 10 min |
| 44 | Create lib/ Directory | Low | 15 min |
| 45 | Create hooks/ Directory | Low | 10 min |
| 46 | Create types/ Directory | Low | 10 min |

---

## Task 39: Create (dashboard) Route Group

### Overview
Create the (dashboard) route group directory within the app/ folder. This route group will contain all protected ERP dashboard pages including inventory, sales, purchasing, accounting, and reports. The parentheses notation creates a layout boundary without affecting the URL structure.

### Dependencies
- Task 31: Create app/ Directory Structure
- Root layout must exist

### Instructions

1. **Navigate to app directory**
   - Open the `frontend/app/` directory
   - Prepare to create route group folder

2. **Create (dashboard) directory**
   - Create new folder named `(dashboard)` with parentheses
   - Parentheses indicate this is a route group
   - Will not appear in URL paths

3. **Verify directory naming**
   - Ensure exact spelling: `(dashboard)` with parentheses
   - Case-sensitive on Linux/Unix systems
   - No spaces or extra characters

4. **Understand route group purpose**
   - Groups routes under shared layout
   - Does not add URL segment
   - All dashboard pages will use this layout

### Route Group URL Behavior

```
Directory Structure              URL Path
═════════════════════════════════════════════════════════

app/(dashboard)/                 (no URL segment added)
├── page.tsx                 →   /dashboard
├── inventory/
│   └── page.tsx            →   /inventory
├── sales/
│   └── page.tsx            →   /sales
└── reports/
    └── page.tsx            →   /reports
```

### Route Group vs Regular Directory

| Aspect | Route Group (dashboard) | Regular Directory dashboard/ |
|--------|------------------------|------------------------------|
| Syntax | `(dashboard)` | `dashboard` |
| URL Impact | No segment added | Adds /dashboard segment |
| Layout Scope | Isolated layout | Standard nested layout |
| Use Case | Shared layout without URL | Feature organization with URL |

### Dashboard Route Group Purpose

```
┌─────────────────────────────────────────────────────────┐
│            (dashboard) Route Group                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Purpose:                                               │
│  • Protected ERP pages                                  │
│  • Shared sidebar navigation                            │
│  • Consistent header/footer                             │
│  • Authentication boundary                              │
│                                                         │
│  Contains:                                              │
│  • Dashboard homepage                                   │
│  • Inventory module pages                               │
│  • Sales module pages                                   │
│  • Purchasing module pages                              │
│  • Accounting module pages                              │
│  • Reports module pages                                 │
│  • Settings pages                                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Expected Outcome
- (dashboard) directory created in app/
- Ready for layout component
- Foundation for all ERP pages
- Clean URL structure without /dashboard prefix

### Verification Checklist
- [ ] `frontend/app/(dashboard)/` directory exists
- [ ] Directory name includes parentheses
- [ ] Directory is empty (no files yet)
- [ ] Directory is at same level as (auth)/

---

## Task 40: Create (dashboard) Layout

### Overview
Create the layout component for the (dashboard) route group. This layout wraps all protected ERP dashboard pages with a consistent structure including sidebar navigation, top header with user menu, breadcrumbs, and main content area. It serves as the primary shell for the entire ERP application interface.

### Dependencies
- Task 39: Create (dashboard) Route Group
- React and Next.js understanding
- TypeScript knowledge

### Instructions

1. **Create layout.tsx file**
   - Navigate to `frontend/app/(dashboard)/` directory
   - Create new file named `layout.tsx`
   - This will be a Server Component by default

2. **Define layout component interface**
   - Create interface for component props
   - Include children prop of type React.ReactNode
   - Add proper TypeScript typing

3. **Create DashboardLayout function component**
   - Export as default function
   - Accept children prop with proper typing
   - Add JSX structure for dashboard shell

4. **Add layout wrapper structure**
   - Create outer container for full page layout
   - Use flex layout for sidebar and content area
   - Ensure responsive behavior

5. **Add sidebar navigation section**
   - Create sidebar container element
   - Position fixed or sticky on left side
   - Include logo/branding area at top
   - Add navigation menu structure

6. **Plan sidebar navigation items**
   - Dashboard/Home link
   - Inventory module link
   - Sales module link
   - Purchasing module link
   - Accounting module link
   - Reports module link
   - Settings link
   - User profile section at bottom

7. **Add main content wrapper**
   - Create main content area beside sidebar
   - Include top header section
   - Add breadcrumb navigation area
   - Create scrollable content region

8. **Add top header section**
   - Create header element at top of main area
   - Include page title area
   - Add search functionality placeholder
   - Include notification icon
   - Add user menu dropdown trigger

9. **Add breadcrumb navigation**
   - Create breadcrumb container below header
   - Placeholder for dynamic breadcrumb trail
   - Home > Current Section > Current Page format

10. **Add main content render area**
    - Create content container for children
    - Apply padding for comfortable spacing
    - Ensure scrollable if content overflows

11. **Add comment documentation**
    - Document layout structure
    - Explain sidebar vs main area
    - Note future enhancements (collapsible sidebar)

### Dashboard Layout Structure

```
┌───────────────────────────────────────────────────────────────┐
│                   Dashboard Layout                            │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┬───────────────────────────────────────┐    │
│  │   Sidebar    │         Main Content Area             │    │
│  │              │                                        │    │
│  │  [Logo]      │  ┌──────────────────────────────────┐ │    │
│  │              │  │  Top Header                       │ │    │
│  │  ┌─────────┐ │  │  • Page Title                    │ │    │
│  │  │Dashboard│ │  │  • Search                        │ │    │
│  │  └─────────┘ │  │  • Notifications                 │ │    │
│  │  ┌─────────┐ │  │  • User Menu                     │ │    │
│  │  │Inventory│ │  └──────────────────────────────────┘ │    │
│  │  └─────────┘ │                                        │    │
│  │  ┌─────────┐ │  ┌──────────────────────────────────┐ │    │
│  │  │ Sales   │ │  │  Breadcrumbs                     │ │    │
│  │  └─────────┘ │  │  Home > Inventory > Products     │ │    │
│  │  ┌─────────┐ │  └──────────────────────────────────┘ │    │
│  │  │Purchase │ │                                        │    │
│  │  └─────────┘ │  ┌──────────────────────────────────┐ │    │
│  │  ┌─────────┐ │  │                                  │ │    │
│  │  │Accounts │ │  │                                  │ │    │
│  │  └─────────┘ │  │         Page Content             │ │    │
│  │  ┌─────────┐ │  │         (children)               │ │    │
│  │  │Reports  │ │  │                                  │ │    │
│  │  └─────────┘ │  │                                  │ │    │
│  │  ┌─────────┐ │  │                                  │ │    │
│  │  │Settings │ │  └──────────────────────────────────┘ │    │
│  │  └─────────┘ │                                        │    │
│  │              │                                        │    │
│  │  [User]      │                                        │    │
│  │              │                                        │    │
│  └──────────────┴───────────────────────────────────────┘    │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### Sidebar Navigation Structure

```
┌──────────────────────────┐
│      Sidebar (240px)     │
├──────────────────────────┤
│                          │
│  ┌────────────────────┐  │
│  │  LankaCommerce    │  │  ← Logo/Brand
│  │      Cloud        │  │
│  └────────────────────┘  │
│                          │
│  ═══════════════════════ │  ← Divider
│                          │
│  🏠 Dashboard            │  ← Active link
│  📦 Inventory            │
│  💰 Sales                │
│  🛒 Purchasing           │
│  📊 Accounting           │
│  📈 Reports              │
│  ⚙️  Settings            │
│                          │
│  ═══════════════════════ │
│                          │
│  👤 John Doe             │  ← User section
│     john@example.lk      │
│     [Logout]             │
│                          │
└──────────────────────────┘
```

### Top Header Components

| Component | Purpose | Position |
|-----------|---------|----------|
| Page Title | Current page name | Left |
| Search Bar | Global search | Center |
| Notifications | Alert icon with badge | Right |
| User Menu | Avatar with dropdown | Far Right |

### Header Layout Example

```
┌───────────────────────────────────────────────────────────────┐
│  Dashboard              [Search...]         🔔 (3)    👤 JD ▼│
└───────────────────────────────────────────────────────────────┘
```

### Breadcrumb Navigation Pattern

```
Home > Inventory > Products > Edit Product #123
  ↓       ↓          ↓              ↓
Link    Link       Link         Current (not linked)
```

### Responsive Behavior Considerations

| Breakpoint | Sidebar Behavior | Main Content |
|------------|------------------|--------------|
| Desktop (≥1024px) | Fixed visible | Full width beside sidebar |
| Tablet (768-1023px) | Collapsible overlay | Full width, toggle sidebar |
| Mobile (<768px) | Hidden, hamburger menu | Full width, slide-in sidebar |

### Layout Styling Guidelines

#### Container Structure
- Outer wrapper: full viewport height
- Display: flex row
- Sidebar: fixed width (240px desktop)
- Main area: flex-grow to fill remaining space

#### Sidebar Styling
- Background: Neutral dark (slate-900 or similar)
- Text: Light contrast (white/gray-100)
- Links: Hover states with background change
- Active link: Highlighted with accent color
- Padding: Comfortable spacing (1rem)

#### Main Content Styling
- Background: Light neutral (gray-50 or white)
- Header: Sticky top position
- Header background: White with subtle shadow
- Content padding: Generous (2rem)
- Max width: Comfortable reading (none or 100%)

#### Color Recommendations
- Sidebar background: `bg-slate-900`
- Sidebar text: `text-gray-100`
- Active link: `bg-primary text-white`
- Header background: `bg-white shadow-sm`
- Content background: `bg-gray-50`

### Accessibility Considerations

1. **Semantic HTML**
   - Use `<aside>` for sidebar
   - Use `<nav>` for navigation
   - Use `<header>` for top header
   - Use `<main>` for content area

2. **Keyboard Navigation**
   - All navigation items keyboard accessible
   - Logical tab order (sidebar → header → content)
   - Skip to main content link

3. **Screen Reader Support**
   - ARIA labels for icon-only buttons
   - Landmark regions properly labeled
   - Current page indication in navigation

4. **Focus Management**
   - Visible focus indicators
   - Focus trap in mobile menu
   - Return focus after modal close

### Future Enhancement Placeholders

#### Collapsible Sidebar
- Add toggle button in header
- Collapse sidebar to icons only
- Persist state in localStorage
- Smooth animation transition

#### Dark Mode Support
- Toggle in user menu
- Apply dark theme classes
- Persist preference
- System preference detection

#### Notification System
- Badge count display
- Dropdown panel for notifications
- Mark as read functionality
- Real-time updates via WebSocket

#### User Menu Dropdown
- Profile link
- Account settings
- Tenant switcher (multi-tenant)
- Theme toggle
- Logout action

### Expected Outcome
- Functional dashboard layout component
- Sidebar navigation structure in place
- Top header with key UI elements
- Breadcrumb navigation area ready
- Main content area renders children
- Clean, professional appearance
- Foundation for future enhancements

### Verification Checklist
- [ ] layout.tsx file created in (dashboard)/
- [ ] Component exports as default
- [ ] Props interface with children defined
- [ ] Sidebar section implemented
- [ ] Navigation links structure added
- [ ] Top header section created
- [ ] Breadcrumb area included
- [ ] Main content area renders children
- [ ] Proper TypeScript typing throughout
- [ ] Comments explaining structure
- [ ] Semantic HTML elements used
- [ ] Responsive considerations noted

---

## Task 41: Create api/ Route Directory

### Overview
Create the api/ directory within the app/ folder to house Next.js API routes. These routes provide backend functionality including health checks, proxy endpoints to Django backend, authentication endpoints, and client-side data fetching helpers.

### Dependencies
- Task 31: Create app/ Directory Structure
- Next.js 14+ App Router knowledge

### Instructions

1. **Navigate to app directory**
   - Open the `frontend/app/` directory
   - Prepare to create API route folder

2. **Create api directory**
   - Create new folder named `api`
   - No parentheses (this will appear in URLs)
   - Must be exactly named `api` (lowercase)

3. **Understand API routes purpose**
   - Backend endpoints accessible via /api/*
   - Server-side execution
   - Can proxy to Django backend
   - Client-side fetch targets

4. **Plan API route organization**
   - Each subdirectory represents an endpoint
   - route.ts files handle HTTP methods
   - Can have nested routes for versions
   - Middleware can be applied

### API Route Directory Structure

```
app/api/
├── health/                    # Health check endpoint
│   └── route.ts              # GET /api/health
├── auth/                     # Authentication endpoints (future)
│   ├── login/
│   │   └── route.ts          # POST /api/auth/login
│   ├── logout/
│   │   └── route.ts          # POST /api/auth/logout
│   └── refresh/
│       └── route.ts          # POST /api/auth/refresh
├── proxy/                    # Django backend proxy (future)
│   └── [...path]/
│       └── route.ts          # GET/POST/PUT/DELETE /api/proxy/*
└── [future-endpoints]/       # Other API routes as needed
```

### API Routes vs Django Backend

```
┌────────────────────────────────────────────────────────────┐
│               API Architecture                             │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Client (Browser)                                          │
│         ↓                                                  │
│  Next.js API Routes (/api/*)                               │
│         ↓                                                  │
│    ┌────────────┬─────────────────────┐                   │
│    ↓            ↓                     ↓                    │
│  Direct      Proxy to              Server-side             │
│  Handler     Django                Processing              │
│             Backend                                        │
│                ↓                                           │
│        Django REST API                                     │
│        (Backend Services)                                  │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### API Route Use Cases

| Use Case | Implementation | Example Route |
|----------|----------------|---------------|
| Health Check | Direct handler | /api/health |
| Authentication | Direct + session | /api/auth/login |
| Data Fetching | Proxy to Django | /api/proxy/inventory |
| File Upload | Direct handler + forward | /api/upload |
| Webhooks | Direct handler | /api/webhooks/stripe |
| Server Actions | Alternative pattern | (use Server Actions instead) |

### API Route URL Mapping

```
Directory                          URL Path
═════════════════════════════════════════════════════════

app/api/                       →   /api (no route here)
app/api/health/route.ts        →   GET /api/health
app/api/auth/login/route.ts    →   POST /api/auth/login
app/api/proxy/[...path]/       →   /api/proxy/* (catch-all)
```

### API Route File Naming Rules

| File Name | Purpose |
|-----------|---------|
| route.ts | API endpoint handler |
| middleware.ts | Route-level middleware |
| error.ts | API error boundary (if needed) |

### HTTP Methods in Route Handlers

```typescript
// route.ts can export these functions:

export async function GET(request: Request) {
  // Handle GET requests
}

export async function POST(request: Request) {
  // Handle POST requests
}

export async function PUT(request: Request) {
  // Handle PUT requests
}

export async function DELETE(request: Request) {
  // Handle DELETE requests
}

export async function PATCH(request: Request) {
  // Handle PATCH requests
}
```

### Expected Outcome
- api/ directory created in app/
- Ready for route handler files
- Foundation for backend communication
- Clean URL structure for API endpoints

### Verification Checklist
- [ ] `frontend/app/api/` directory exists
- [ ] Directory name is lowercase `api`
- [ ] Directory is at same level as (auth)/ and (dashboard)/
- [ ] Directory is currently empty (no files yet)

---

## Task 42: Create Health Check API Route

### Overview
Create a health check API endpoint that returns the application status and timestamp. This endpoint is used by monitoring systems, load balancers, and container orchestration platforms to verify the Next.js frontend is running and responsive.

### Dependencies
- Task 41: Create api/ Route Directory
- Understanding of Next.js route handlers

### Instructions

1. **Create health directory**
   - Navigate to `frontend/app/api/` directory
   - Create new folder named `health`

2. **Create route.ts file**
   - Inside `health/` directory
   - Create file named `route.ts`
   - This will handle /api/health endpoint

3. **Import necessary modules**
   - Import NextResponse from 'next/server'
   - This provides the response helper

4. **Create GET handler function**
   - Export async function named GET
   - Accept request parameter of type Request
   - Return NextResponse with JSON

5. **Define response structure**
   - Create object with status field
   - Set status value to "ok" or "healthy"
   - Add timestamp field with current date/time

6. **Add optional build information**
   - Include Node environment (development/production)
   - Add Next.js version if available
   - Include build timestamp or commit hash (if set)

7. **Return JSON response**
   - Use NextResponse.json() to return data
   - Set HTTP status code to 200
   - Add appropriate headers (Content-Type automatic)

8. **Add error handling consideration**
   - Note: If this endpoint fails, the entire app likely has issues
   - Could wrap in try-catch for edge cases
   - Return 500 status if unexpected error

9. **Add documentation comments**
   - Explain health check purpose
   - Document response format
   - Note usage by load balancers

### Health Check Response Format

```json
{
  "status": "ok",
  "timestamp": "2026-01-25T14:30:00.000Z",
  "environment": "production",
  "version": "1.0.0"
}
```

### Health Check Response Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| status | string | Yes | Always "ok" if responding |
| timestamp | string (ISO 8601) | Yes | Current server time |
| environment | string | No | development/production |
| version | string | No | Application version |
| uptime | number | No | Seconds since startup |

### Health Check Usage Scenarios

#### Load Balancer Configuration
```
Health Check Settings
─────────────────────
Protocol: HTTP
Path: /api/health
Port: 3000
Interval: 30 seconds
Timeout: 5 seconds
Healthy threshold: 2 consecutive successes
Unhealthy threshold: 3 consecutive failures
```

#### Docker Healthcheck
```dockerfile
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1
```

#### Kubernetes Liveness Probe
```yaml
livenessProbe:
  httpGet:
    path: /api/health
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3
```

#### Monitoring System Check
```
Uptime Monitor Configuration
────────────────────────────
URL: https://erp.example.lk/api/health
Method: GET
Expected Status: 200
Expected Body: "status": "ok"
Check Interval: 1 minute
Alert after: 3 failed checks
```

### HTTP Response Codes

| Status Code | Scenario | Response |
|-------------|----------|----------|
| 200 OK | Application healthy | JSON with status ok |
| 500 Internal Server Error | Unexpected error | JSON with error details |
| 503 Service Unavailable | Degraded mode (optional) | JSON with warnings |

### Enhanced Health Check (Future)

```json
{
  "status": "ok",
  "timestamp": "2026-01-25T14:30:00.000Z",
  "environment": "production",
  "version": "1.0.0",
  "uptime": 86400,
  "checks": {
    "database": "connected",
    "redis": "connected",
    "django_backend": "reachable"
  }
}
```

### Degraded Status Response (Optional)

```json
{
  "status": "degraded",
  "timestamp": "2026-01-25T14:30:00.000Z",
  "warnings": [
    "Redis connection slow",
    "High memory usage"
  ]
}
```

### Error Response Format

```json
{
  "status": "error",
  "timestamp": "2026-01-25T14:30:00.000Z",
  "message": "Unexpected error occurred",
  "details": "Error details here"
}
```

### Testing the Health Check

#### cURL Command
```bash
curl http://localhost:3000/api/health
```

#### Browser Access
```
http://localhost:3000/api/health
```

#### Expected Response
```json
{"status":"ok","timestamp":"2026-01-25T14:30:00.000Z"}
```

### Security Considerations

1. **Public Endpoint**
   - No authentication required
   - Safe for public access
   - Minimal information exposure

2. **Information Disclosure**
   - Avoid revealing sensitive system details
   - Don't expose internal errors publicly
   - Version info is generally safe

3. **Rate Limiting (Future)**
   - Consider rate limiting if heavily polled
   - Prevent abuse from monitoring tools
   - Whitelist known IP addresses

### Expected Outcome
- Functional health check endpoint
- Returns JSON response with status
- Accessible at /api/health
- Ready for monitoring integration
- Provides server timestamp

### Verification Checklist
- [ ] health/ directory created in api/
- [ ] route.ts file created
- [ ] GET function exported
- [ ] Returns JSON with status field
- [ ] Includes timestamp in response
- [ ] Response structure documented
- [ ] HTTP 200 status returned
- [ ] Accessible via browser at /api/health
- [ ] Returns valid JSON format

---

## Task 43: Create components/ Directory

### Overview
Create the components/ directory with subdirectories for UI components and feature-specific modules. This establishes the organization pattern for all React components used across the application, separating generic UI elements from business logic components.

### Dependencies
- Task 16: Initialize Next.js Project
- Frontend project structure exists

### Instructions

1. **Navigate to frontend root**
   - Open `frontend/` directory
   - At same level as app/, public/, etc.

2. **Create components directory**
   - Create new folder named `components`
   - This will house all shared components

3. **Create ui subdirectory**
   - Inside components/, create `ui/` folder
   - Will contain generic UI components
   - Shadcn/UI components will be installed here

4. **Create modules subdirectory**
   - Inside components/, create `modules/` folder
   - Will contain feature-specific components
   - Business logic components

5. **Add .gitkeep to ui/**
   - Create `.gitkeep` file in ui/ directory
   - Ensures empty directory is tracked by git
   - Will be removed once components added

6. **Add .gitkeep to modules/**
   - Create `.gitkeep` file in modules/ directory
   - Maintains directory in version control
   - Placeholder until module components added

7. **Plan component organization**
   - Document intended structure
   - Define naming conventions
   - Establish import patterns

### Components Directory Structure

```
frontend/components/
├── ui/                           # Generic UI components
│   ├── button.tsx               # (Shadcn/UI components)
│   ├── input.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── table.tsx
│   ├── form.tsx
│   └── [other-ui-components]
├── modules/                      # Feature-specific components
│   ├── inventory/
│   │   ├── product-list.tsx
│   │   ├── product-form.tsx
│   │   └── stock-indicator.tsx
│   ├── sales/
│   │   ├── invoice-list.tsx
│   │   ├── payment-form.tsx
│   │   └── receipt-viewer.tsx
│   ├── auth/
│   │   ├── login-form.tsx
│   │   └── register-form.tsx
│   └── dashboard/
│       ├── stats-card.tsx
│       ├── recent-sales.tsx
│       └── quick-actions.tsx
└── shared/                       # Shared complex components (future)
    ├── data-table.tsx
    ├── form-builder.tsx
    └── chart-wrapper.tsx
```

### Component Organization Principles

| Directory | Purpose | Examples |
|-----------|---------|----------|
| ui/ | Generic, reusable UI primitives | Button, Input, Card, Dialog |
| modules/ | Feature-specific business components | ProductList, InvoiceForm |
| shared/ | Complex shared components (future) | DataTable, FormBuilder, ChartWrapper |

### UI Components (Shadcn/UI)

```
Shadcn/UI Component Library
═══════════════════════════

Installation creates components in ui/:

npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog

Each command creates a file in components/ui/
```

### Module Components Organization

```
modules/[feature]/
└── Feature-specific components
    ├── List components (display data)
    ├── Form components (input/edit)
    ├── Detail components (single item)
    └── Utility components (feature-specific)
```

### Component Naming Conventions

#### File Naming
| Pattern | Example | Usage |
|---------|---------|-------|
| kebab-case.tsx | product-list.tsx | Component files |
| PascalCase | ProductList | Component name |
| use-hook-name.ts | use-inventory.ts | Custom hooks |

#### Component Exports
```typescript
// Named export (for UI components)
export function Button({ ...props }) { }

// Default export (for page components)
export default function ProductList() { }
```

### Import Path Patterns

```typescript
// UI components (Shadcn/UI)
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Module components
import { ProductList } from "@/components/modules/inventory/product-list"
import { InvoiceForm } from "@/components/modules/sales/invoice-form"

// Shared components
import { DataTable } from "@/components/shared/data-table"
```

### Component Structure Guidelines

#### Simple UI Component
```
Purpose: Generic, reusable, no business logic
Size: Small (50-150 lines)
Props: Flexible, well-typed
Examples: Button, Input, Badge
```

#### Module Component
```
Purpose: Feature-specific, contains business logic
Size: Medium (150-300 lines)
Props: Domain-specific
Examples: ProductForm, InvoiceList
```

#### Shared Component
```
Purpose: Complex, reusable across features
Size: Large (300+ lines)
Props: Configurable, generic
Examples: DataTable, FormBuilder
```

### Component Best Practices

1. **Single Responsibility**
   - Each component does one thing well
   - Split large components into smaller ones
   - Compose components for complex UI

2. **TypeScript Typing**
   - Define prop interfaces
   - Export types for reuse
   - Use generic types where appropriate

3. **Client vs Server Components**
   - Default to Server Components
   - Add "use client" only when needed
   - Minimize client-side JavaScript

4. **Accessibility**
   - Semantic HTML elements
   - ARIA attributes where needed
   - Keyboard navigation support
   - Screen reader friendly

### Future Component Categories

#### Form Components
- FormField wrappers
- Validation displays
- Multi-step forms
- Dynamic form builders

#### Data Display Components
- Tables with sorting/filtering
- Charts and graphs
- Lists with pagination
- Cards and grids

#### Layout Components
- Containers and sections
- Grid systems
- Responsive wrappers
- Spacing utilities

#### Feedback Components
- Loading states
- Error messages
- Success notifications
- Toast alerts

### Expected Outcome
- Organized components directory
- Clear separation of UI and module components
- Ready for Shadcn/UI installation
- Foundation for component development
- Scalable organization pattern

### Verification Checklist
- [ ] `frontend/components/` directory exists
- [ ] `components/ui/` subdirectory created
- [ ] `components/modules/` subdirectory created
- [ ] `.gitkeep` file in ui/ directory
- [ ] `.gitkeep` file in modules/ directory
- [ ] Directory structure documented

---

## Task 44: Create lib/ Directory

### Overview
Create the lib/ directory with utility functions for the Next.js application. This directory houses helper functions, utility modules, API client configurations, and shared business logic. The initial setup includes a utils.ts file with the cn() function for className merging.

### Dependencies
- Task 16: Initialize Next.js Project
- Tailwind CSS configured

### Instructions

1. **Navigate to frontend root**
   - Open `frontend/` directory
   - At same level as app/, components/, etc.

2. **Create lib directory**
   - Create new folder named `lib`
   - Short for "library" utilities

3. **Create utils.ts file**
   - Inside lib/, create `utils.ts`
   - Will contain utility functions

4. **Install required dependencies**
   - Ensure clsx package is installed
   - Ensure tailwind-merge package is installed
   - These enable className merging

5. **Define cn function**
   - Import clsx from 'clsx'
   - Import twMerge from 'tailwind-merge'
   - Create cn() function that combines both
   - Export function for use across app

6. **Add function documentation**
   - Explain cn() function purpose
   - Document usage examples
   - Note Tailwind CSS conflict resolution

7. **Plan additional utilities**
   - Note future utility categories
   - Document organizational pattern
   - Establish file naming conventions

### lib/ Directory Structure

```
frontend/lib/
├── utils.ts                      # General utilities, cn() function
├── api/                          # API client utilities (future)
│   ├── client.ts                # Fetch wrapper, error handling
│   ├── auth.ts                  # Authentication helpers
│   └── endpoints.ts             # API endpoint constants
├── validations/                  # Validation schemas (future)
│   ├── auth.ts                  # Auth form validation
│   ├── inventory.ts             # Inventory validation
│   └── common.ts                # Common validators
├── formatters/                   # Data formatting (future)
│   ├── currency.ts              # LKR formatting
│   ├── date.ts                  # Date/time formatting
│   └── number.ts                # Number formatting
├── constants/                    # Application constants (future)
│   ├── routes.ts                # Route path constants
│   ├── permissions.ts           # Permission constants
│   └── config.ts                # App configuration
└── helpers/                      # Helper functions (future)
    ├── storage.ts               # localStorage helpers
    ├── url.ts                   # URL manipulation
    └── array.ts                 # Array utilities
```

### The cn() Function

#### Purpose
Merges multiple className strings and resolves Tailwind CSS conflicts intelligently. Ensures later classes override earlier ones correctly.

#### Function Signature
```typescript
function cn(...inputs: ClassValue[]): string
```

#### Implementation
Combines clsx (conditional classes) with tailwind-merge (conflict resolution).

### cn() Function Usage Examples

#### Basic Usage
```typescript
import { cn } from "@/lib/utils"

// Merge multiple classes
<div className={cn("text-base", "font-bold", "text-blue-500")} />
// Result: "text-base font-bold text-blue-500"
```

#### Conditional Classes
```typescript
// Apply classes conditionally
<button 
  className={cn(
    "px-4 py-2 rounded",
    isActive && "bg-blue-500",
    isDisabled && "opacity-50 cursor-not-allowed"
  )}
/>
```

#### Tailwind Conflict Resolution
```typescript
// Later classes override earlier ones correctly
<div className={cn("text-red-500", "text-blue-500")} />
// Result: "text-blue-500" (not both)

// Without cn(), both would apply (incorrect)
<div className="text-red-500 text-blue-500" />
// Result: "text-red-500 text-blue-500" (conflict!)
```

#### Component Variants
```typescript
// Merge base classes with variant classes
const buttonVariants = {
  base: "px-4 py-2 rounded font-medium",
  primary: "bg-blue-500 text-white",
  secondary: "bg-gray-200 text-gray-800"
}

<button className={cn(buttonVariants.base, buttonVariants.primary)} />
// Result: "px-4 py-2 rounded font-medium bg-blue-500 text-white"
```

#### Props className Merging
```typescript
// Allow parent components to override styles
interface ButtonProps {
  className?: string
  variant?: "primary" | "secondary"
}

function Button({ className, variant = "primary" }: ButtonProps) {
  return (
    <button 
      className={cn(
        "px-4 py-2 rounded",
        variant === "primary" && "bg-blue-500",
        variant === "secondary" && "bg-gray-200",
        className // Parent can override
      )}
    />
  )
}

// Usage
<Button className="mt-4 shadow-lg" variant="primary" />
```

### Utility Categories (Future)

#### API Client Utilities
```
lib/api/client.ts
─────────────────
• Fetch wrapper with error handling
• Request/response interceptors
• Token refresh logic
• Base URL configuration
```

#### Validation Utilities
```
lib/validations/
────────────────
• Zod schema definitions
• Form validation helpers
• Custom validators
• Error message formatting
```

#### Formatters
```
lib/formatters/
───────────────
• Currency: formatLKR("1000") → "Rs. 1,000.00"
• Date: formatDate(date, "DD/MM/YYYY")
• Number: formatNumber(1234567) → "1,234,567"
• Phone: formatPhone("+94771234567") → "+94 77 123 4567"
```

#### Constants
```
lib/constants/
──────────────
• Route paths: ROUTES.DASHBOARD, ROUTES.INVENTORY
• Permission keys: PERMISSIONS.INVENTORY.VIEW
• Config values: API_BASE_URL, APP_NAME
```

#### Helper Functions
```
lib/helpers/
────────────
• Local storage: getItem(), setItem(), clearAll()
• URL params: buildQueryString(), parseQueryString()
• Arrays: groupBy(), sortBy(), uniqueBy()
• Debounce/throttle functions
```

### Utility Function Naming Conventions

| Convention | Example | Usage |
|------------|---------|-------|
| camelCase | formatCurrency | Function names |
| UPPER_SNAKE_CASE | API_BASE_URL | Constants |
| PascalCase | ValidationSchema | Classes/Types |

### Import Alias Configuration

```typescript
// Use @ alias for clean imports
import { cn } from "@/lib/utils"
import { apiClient } from "@/lib/api/client"
import { formatLKR } from "@/lib/formatters/currency"

// Instead of relative paths
import { cn } from "../../lib/utils"
```

### Utility Testing Approach

#### Pure Functions
- Easy to test in isolation
- No side effects
- Predictable outputs

#### Test Categories
- Unit tests for formatters
- Integration tests for API client
- Validation schema tests

### Sri Lanka-Specific Utilities (Future)

#### Currency Formatting
```typescript
formatLKR(1000)           // "Rs. 1,000.00"
formatLKR(1000, { compact: true })  // "Rs. 1K"
parseLKR("Rs. 1,000.00")  // 1000
```

#### Phone Number Formatting
```typescript
formatPhone("0771234567")     // "+94 77 123 4567"
validatePhone("+94771234567") // true
isValidMobile("0771234567")   // true
```

#### Address Formatting
```typescript
formatAddress({
  street: "123 Galle Road",
  city: "Colombo 03",
  district: "Colombo"
})
// "123 Galle Road, Colombo 03, Colombo District"
```

#### Tax Calculations
```typescript
calculateVAT(1000, 0.08)      // 80 (8% VAT)
calculateNBT(1000, 0.02)      // 20 (2% NBT)
calculateTotalWithTax(1000)   // 1100 (includes VAT+NBT)
```

### Expected Outcome
- lib/ directory with utils.ts
- cn() function for className merging
- Organized structure for future utilities
- Clean import patterns established
- Foundation for shared functionality

### Verification Checklist
- [ ] `frontend/lib/` directory created
- [ ] `lib/utils.ts` file created
- [ ] clsx package installed
- [ ] tailwind-merge package installed
- [ ] cn() function defined and exported
- [ ] Function properly imports dependencies
- [ ] Function documented with comments
- [ ] Can import with @/lib/utils alias

---

## Task 45: Create hooks/ Directory

### Overview
Create the hooks/ directory for custom React hooks. This directory organizes reusable stateful logic, side effects, and component behavior patterns. The initial setup includes an index.ts file that will export all custom hooks for convenient importing.

### Dependencies
- Task 16: Initialize Next.js Project
- React hooks knowledge

### Instructions

1. **Navigate to frontend root**
   - Open `frontend/` directory
   - At same level as app/, components/, lib/, etc.

2. **Create hooks directory**
   - Create new folder named `hooks`
   - Will contain all custom React hooks

3. **Create index.ts file**
   - Inside hooks/, create `index.ts`
   - Will serve as central export point
   - Allows barrel exports for clean imports

4. **Add initial documentation**
   - Add comment explaining hooks directory purpose
   - Note barrel export pattern
   - Document hook naming conventions

5. **Add placeholder export comment**
   - Comment showing future hook exports
   - Example: export { useAuth } from './use-auth'
   - Demonstrates import/export pattern

6. **Plan custom hooks organization**
   - Document hook categories
   - Establish naming conventions (use- prefix)
   - Note file naming pattern

### hooks/ Directory Structure

```
frontend/hooks/
├── index.ts                      # Barrel exports
├── use-auth.ts                   # Authentication hook (future)
├── use-tenant.ts                 # Tenant context hook (future)
├── use-api.ts                    # API fetching hook (future)
├── use-debounce.ts               # Debounce hook (future)
├── use-local-storage.ts          # Local storage hook (future)
├── use-media-query.ts            # Responsive breakpoint hook (future)
├── use-toast.ts                  # Toast notification hook (future)
└── [feature-hooks]/              # Feature-specific hooks
    ├── use-inventory.ts
    ├── use-sales.ts
    └── use-reports.ts
```

### Custom Hooks Categories

| Category | Purpose | Examples |
|----------|---------|----------|
| Authentication | User session, permissions | use-auth, use-permissions |
| Data Fetching | API calls, caching | use-api, use-query |
| Form Handling | Form state, validation | use-form, use-field |
| UI State | Modals, drawers, toasts | use-modal, use-toast |
| Browser APIs | localStorage, media queries | use-local-storage, use-media-query |
| Feature Logic | Business logic hooks | use-inventory, use-checkout |

### Hook Naming Conventions

#### Convention Rules
1. Must start with "use" prefix
2. camelCase after prefix
3. Descriptive verb or noun
4. File name matches hook name in kebab-case

#### Examples
| File Name | Hook Name | Purpose |
|-----------|-----------|---------|
| use-auth.ts | useAuth | Authentication state |
| use-local-storage.ts | useLocalStorage | localStorage helper |
| use-debounce.ts | useDebounce | Debounced values |
| use-inventory.ts | useInventory | Inventory operations |

### Barrel Export Pattern

#### index.ts Structure
```typescript
// Export all hooks from single file
export { useAuth } from './use-auth'
export { useTenant } from './use-tenant'
export { useApi } from './use-api'
export { useDebounce } from './use-debounce'

// Usage in components
import { useAuth, useTenant } from '@/hooks'
// Instead of
import { useAuth } from '@/hooks/use-auth'
import { useTenant } from '@/hooks/use-tenant'
```

### Future Custom Hooks

#### useAuth Hook
```
Purpose: Manage user authentication state
Returns:
  • user: Current user object
  • isAuthenticated: Boolean status
  • login: Login function
  • logout: Logout function
  • loading: Loading state
```

#### useTenant Hook
```
Purpose: Manage current tenant context
Returns:
  • tenant: Current tenant object
  • switchTenant: Function to change tenant
  • loading: Loading state
```

#### useApi Hook
```
Purpose: Generic data fetching with loading/error states
Parameters:
  • endpoint: API endpoint URL
  • options: Fetch options
Returns:
  • data: Fetched data
  • loading: Loading boolean
  • error: Error object
  • refetch: Refetch function
```

#### useDebounce Hook
```
Purpose: Debounce rapid value changes
Parameters:
  • value: Value to debounce
  • delay: Delay in milliseconds
Returns:
  • debouncedValue: Debounced value
```

#### useLocalStorage Hook
```
Purpose: Sync state with localStorage
Parameters:
  • key: Storage key
  • initialValue: Default value
Returns:
  • [value, setValue]: State tuple
```

#### useMediaQuery Hook
```
Purpose: Responsive breakpoint detection
Parameters:
  • query: Media query string
Returns:
  • matches: Boolean if query matches
```

#### useToast Hook
```
Purpose: Show toast notifications
Returns:
  • toast: Function to show toast
  • dismiss: Function to dismiss toast
```

### Hook Usage Examples

#### Authentication Hook Usage
```typescript
function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth()
  
  if (!isAuthenticated) {
    return <Redirect to="/login" />
  }
  
  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

#### Debounce Hook Usage
```typescript
function SearchInput() {
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearch = useDebounce(searchTerm, 500)
  
  useEffect(() => {
    // API call only fires after 500ms of no typing
    if (debouncedSearch) {
      searchProducts(debouncedSearch)
    }
  }, [debouncedSearch])
  
  return <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
}
```

#### Local Storage Hook Usage
```typescript
function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage("theme", "light")
  
  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      Current: {theme}
    </button>
  )
}
```

### Hook Best Practices

#### 1. Rules of Hooks
- Only call at top level
- Only call from React functions
- Don't call in loops or conditions
- Use ESLint plugin to enforce

#### 2. Hook Composition
- Compose complex hooks from simpler ones
- Extract common patterns
- Keep hooks focused and single-purpose

#### 3. TypeScript Typing
- Define parameter types
- Define return types
- Export types for consumers
- Use generics where appropriate

#### 4. Side Effect Management
- Use useEffect for side effects
- Clean up effects properly
- Handle async operations safely
- Prevent memory leaks

### Hook Testing Approach

#### React Testing Library
```
• Use renderHook from @testing-library/react
• Test hook behavior in isolation
• Test with different inputs
• Verify state updates
```

#### Test Cases
- Initial state correct
- State updates on actions
- Side effects execute
- Cleanup functions run

### Feature-Specific Hooks

#### Inventory Module
```
use-inventory.ts
────────────────
• useProductList: Fetch products with filters
• useProduct: Single product CRUD
• useStockLevels: Real-time stock data
```

#### Sales Module
```
use-sales.ts
────────────
• useInvoiceList: Fetch invoices
• useCreateInvoice: Invoice creation flow
• usePaymentMethods: Available payments
```

#### Reports Module
```
use-reports.ts
──────────────
• useReportData: Fetch report data
• useReportFilters: Filter state management
• useReportExport: Export functionality
```

### Expected Outcome
- hooks/ directory created
- index.ts barrel export file ready
- Clear organization pattern established
- Foundation for custom hooks
- Naming conventions documented

### Verification Checklist
- [ ] `frontend/hooks/` directory exists
- [ ] `hooks/index.ts` file created
- [ ] index.ts has documentation comments
- [ ] Barrel export pattern documented
- [ ] Hook naming conventions noted
- [ ] Directory ready for custom hooks

---

## Task 46: Create types/ Directory

### Overview
Create the types/ directory for TypeScript type definitions, interfaces, and type utilities. This directory centralizes all shared types used across the application, ensuring type consistency and reusability. The initial setup includes an index.ts file for barrel exports.

### Dependencies
- Task 16: Initialize Next.js Project
- TypeScript configured

### Instructions

1. **Navigate to frontend root**
   - Open `frontend/` directory
   - At same level as app/, components/, lib/, hooks/

2. **Create types directory**
   - Create new folder named `types`
   - Will contain all TypeScript type definitions

3. **Create index.ts file**
   - Inside types/, create `index.ts`
   - Will serve as central export point
   - Allows barrel exports for types

4. **Add initial documentation**
   - Add comment explaining types directory purpose
   - Note organizational structure
   - Document naming conventions

5. **Define common types section**
   - Add comment for common types
   - Placeholder for User, Tenant, etc.
   - Will be expanded in future tasks

6. **Plan type organization**
   - Document type file structure
   - Establish naming conventions
   - Note when to create new type files

### types/ Directory Structure

```
frontend/types/
├── index.ts                      # Barrel exports, common types
├── api.ts                        # API-related types (future)
├── auth.ts                       # Authentication types (future)
├── inventory.ts                  # Inventory module types (future)
├── sales.ts                      # Sales module types (future)
├── accounting.ts                 # Accounting types (future)
├── reports.ts                    # Reports types (future)
├── forms.ts                      # Form-related types (future)
├── ui.ts                         # UI component prop types (future)
└── utils.ts                      # Utility types (future)
```

### Type Categories

| Category | File | Purpose |
|----------|------|---------|
| Common | index.ts | User, Tenant, ID types |
| API | api.ts | Request/Response, Pagination |
| Domain | [feature].ts | Business entity types |
| Forms | forms.ts | Form data, validation |
| UI | ui.ts | Component props, variants |
| Utilities | utils.ts | Helper types, mapped types |

### Common Types (index.ts)

#### Base Entity Types
```
ID Types
────────
• UUID: string (UUID format)
• NumericID: number
• StringID: string
```

#### User Types
```
User Interface
──────────────
• id: UUID
• email: string
• name: string
• role: UserRole
• tenant_id: UUID
• is_active: boolean
• created_at: string (ISO 8601)
```

#### Tenant Types
```
Tenant Interface
────────────────
• id: UUID
• name: string
• domain: string
• is_active: boolean
• plan: "starter" | "professional" | "enterprise"
• settings: TenantSettings
```

#### Pagination Types
```
PaginatedResponse<T>
────────────────────
• results: T[]
• count: number
• next: string | null
• previous: string | null
```

### Type Naming Conventions

| Convention | Example | Usage |
|------------|---------|-------|
| PascalCase | User, ProductList | Interfaces and types |
| PascalCase + Props | ButtonProps | Component prop types |
| PascalCase + Type | UserRole | Type aliases |
| PascalCase + Enum | OrderStatus | Enums |

### Interface vs Type Alias

#### Use Interface When
- Defining object shapes
- Need declaration merging
- Creating OOP-style contracts
- Public API types

#### Use Type When
- Union/intersection types
- Mapped types
- Conditional types
- Utility type compositions

### Future Type Definitions

#### API Types (api.ts)
```
ApiResponse<T>
──────────────
• success: boolean
• data: T
• error?: string
• message?: string

ApiError
────────
• status: number
• message: string
• details?: Record<string, string[]>

RequestOptions
──────────────
• method: HttpMethod
• headers?: Record<string, string>
• body?: any
• params?: Record<string, any>
```

#### Authentication Types (auth.ts)
```
AuthUser
────────
• id: UUID
• email: string
• name: string
• role: UserRole
• permissions: string[]
• tenant: Tenant

LoginCredentials
────────────────
• email: string
• password: string

TokenPair
─────────
• access: string
• refresh: string

UserRole
────────
• "admin" | "manager" | "user" | "viewer"
```

#### Inventory Types (inventory.ts)
```
Product
───────
• id: UUID
• sku: string
• name: string
• description: string
• category: Category
• price: number
• cost: number
• stock_quantity: number
• unit: string
• is_active: boolean

Category
────────
• id: UUID
• name: string
• parent_id: UUID | null
• description: string

StockLevel
──────────
• product_id: UUID
• warehouse_id: UUID
• quantity: number
• reserved: number
• available: number
```

#### Form Types (forms.ts)
```
FormState<T>
────────────
• data: T
• errors: Record<keyof T, string>
• touched: Record<keyof T, boolean>
• isSubmitting: boolean
• isValid: boolean

ValidationRule
──────────────
• required?: boolean
• pattern?: RegExp
• min?: number
• max?: number
• custom?: (value: any) => boolean
```

### Type Import/Export Patterns

#### Barrel Exports (index.ts)
```typescript
// Re-export common types
export type { User, Tenant, PaginatedResponse }

// Re-export from other type files
export * from './api'
export * from './auth'
export * from './inventory'

// Usage in components
import type { User, Product, ApiResponse } from '@/types'
```

#### Type-Only Imports
```typescript
// Import as type (not runtime value)
import type { User } from '@/types'

// Import multiple types
import type { User, Tenant, Product } from '@/types'

// Mixed imports (value and type)
import { API_URL } from '@/lib/constants'
import type { ApiResponse } from '@/types/api'
```

### Utility Types

#### Custom Utility Types
```typescript
// Make all properties optional recursively
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// Extract keys with specific value type
type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never
}[keyof T]

// Make specific properties required
type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>

// Nullable version of type
type Nullable<T> = T | null

// Remove null/undefined from type
type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>
}
```

#### Built-in Utility Types (Reference)
```
Partial<T>          - All properties optional
Required<T>         - All properties required
Readonly<T>         - All properties readonly
Pick<T, K>          - Select specific properties
Omit<T, K>          - Exclude specific properties
Record<K, T>        - Map of key to value type
Exclude<T, U>       - Remove types from union
Extract<T, U>       - Extract types from union
NonNullable<T>      - Remove null/undefined
ReturnType<T>       - Extract function return type
Parameters<T>       - Extract function parameters
```

### Type Guards

```typescript
// User-defined type guard
function isProduct(item: unknown): item is Product {
  return (
    typeof item === 'object' &&
    item !== null &&
    'sku' in item &&
    'name' in item
  )
}

// Usage
if (isProduct(data)) {
  // data is typed as Product here
  console.log(data.sku)
}
```

### Generic Types

```typescript
// Generic API response type
type ApiResponse<T> = {
  data: T
  status: number
  message: string
}

// Usage with specific types
type UserResponse = ApiResponse<User>
type ProductListResponse = ApiResponse<Product[]>

// Generic pagination type
type Paginated<T> = {
  items: T[]
  total: number
  page: number
  pageSize: number
}

// Usage
type PaginatedProducts = Paginated<Product>
```

### Type Documentation

#### JSDoc Comments
```typescript
/**
 * Represents a user in the system
 * @property {string} id - Unique user identifier
 * @property {string} email - User email address
 * @property {UserRole} role - User's role in tenant
 */
export interface User {
  id: string
  email: string
  role: UserRole
}
```

### Type Safety Best Practices

1. **Avoid 'any' Type**
   - Use 'unknown' if type is truly unknown
   - Use generics for flexible but type-safe code
   - Define proper types instead of 'any'

2. **Use Strict Null Checks**
   - Explicitly type nullable values (T | null)
   - Handle null/undefined cases
   - Use optional chaining (?.)

3. **Leverage Type Inference**
   - Let TypeScript infer when possible
   - Explicit types for function parameters
   - Return types for public functions

4. **Use Discriminated Unions**
   - Add 'type' or 'kind' field
   - Enables exhaustive type checking
   - Clear intent in code

### Expected Outcome
- types/ directory created
- index.ts ready for type definitions
- Clear organization pattern
- Foundation for shared types
- Type conventions documented

### Verification Checklist
- [ ] `frontend/types/` directory exists
- [ ] `types/index.ts` file created
- [ ] index.ts has documentation comments
- [ ] Type naming conventions documented
- [ ] Barrel export pattern noted
- [ ] Directory ready for type definitions

---

## Summary

This document established the protected dashboard structure and shared code organization:

### Completed Infrastructure
- ✅ (dashboard) route group for protected pages
- ✅ Dashboard layout with sidebar and header structure
- ✅ api/ directory for Next.js API routes
- ✅ Health check endpoint (/api/health)
- ✅ components/ directory with ui/ and modules/ subdirectories
- ✅ lib/ directory with utilities and cn() function
- ✅ hooks/ directory for custom React hooks
- ✅ types/ directory for TypeScript definitions

### Key Achievements
1. **Protected Area Structure** - Dashboard route group with comprehensive layout
2. **API Foundation** - Health check endpoint for monitoring
3. **Component Organization** - Clear separation of UI and module components
4. **Utility Framework** - Shared functions and className merging
5. **Hook Management** - Centralized location for custom hooks
6. **Type Safety** - Organized TypeScript type definitions

### Architecture Overview

```
Frontend Structure
═══════════════════════════════════════════════════════════

app/
├── (auth)/                    # Authentication pages
│   └── layout.tsx            # Minimal auth layout
├── (dashboard)/              # Protected ERP pages
│   └── layout.tsx            # Sidebar + header layout
└── api/                      # API routes
    └── health/               # Health check endpoint

components/
├── ui/                       # Shadcn/UI primitives
└── modules/                  # Feature components

lib/
└── utils.ts                  # Utility functions (cn)

hooks/
└── index.ts                  # Custom hooks exports

types/
└── index.ts                  # TypeScript types
```

### Next Steps
Proceed to **Group D: ESLint & Prettier Setup** to configure code quality tools, linting rules, formatting standards, and pre-commit hooks for consistent code style across the frontend application.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 8  
**Total Lines:** ~950
