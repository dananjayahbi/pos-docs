# Phase 07: Frontend Infrastructure & ERP Dashboard - Sub-Phases Summary

> **Phase Index:** 07 of 10  
> **Phase Goal:** Establish Next.js frontend and build complete ERP admin interface  
> **Total Sub-Phases:** 14 | **Status:** Planning

---

## Navigation

- **↑ Parent:** [00_PHASES_SUMMARY.md](../00_PHASES_SUMMARY.md)
- **← Previous Phase:** [Phase-06](../Phase-06_ERP-Advanced-Modules/)
- **→ Next Phase:** [Phase-08](../Phase-08_Webstore-Ecommerce-Platform/)

---

## Phase Overview

This phase establishes the Next.js frontend infrastructure and builds the complete ERP admin dashboard for tenant administrators and staff. This is the primary interface for business management.

### Key Outcomes
- Next.js 14+ with App Router configured
- Reusable component library (Shadcn/UI based)
- State management (Zustand/TanStack Query)
- Complete ERP dashboard with all module UIs
- Responsive design for tablet/desktop
- Role-based interface rendering

---

## Sub-Phase Index

| # | Sub-Phase Name | Description | Tasks | Status |
|---|----------------|-------------|-------|--------|
| 01 | **Next.js Project Setup** | Initialize Next.js with TypeScript, App Router, and configuration | TBD | 🔴 Not Created |
| 02 | **Tailwind & Design System** | Configure Tailwind CSS with custom theme and design tokens | TBD | 🔴 Not Created |
| 03 | **Component Library Setup** | Set up Shadcn/UI with custom components | TBD | 🔴 Not Created |
| 04 | **API Client Layer** | Create typed API client with auth handling | TBD | 🔴 Not Created |
| 05 | **State Management** | Configure Zustand and TanStack Query | TBD | 🔴 Not Created |
| 06 | **Authentication UI** | Login, registration, password reset pages | TBD | 🔴 Not Created |
| 07 | **Dashboard Layout** | Main dashboard layout with sidebar, header, navigation | TBD | 🔴 Not Created |
| 08 | **Product Management UI** | Product listing, creation, editing interfaces | TBD | 🔴 Not Created |
| 09 | **Inventory Management UI** | Stock levels, movements, warehouse interfaces | TBD | 🔴 Not Created |
| 10 | **Sales & Orders UI** | Orders, invoices, quotes management interfaces | TBD | 🔴 Not Created |
| 11 | **POS Interface** | Point of Sale terminal interface | TBD | 🔴 Not Created |
| 12 | **Customer & Vendor UI** | CRM interfaces for customers and vendors | TBD | 🔴 Not Created |
| 13 | **HR & Payroll UI** | Employee, attendance, payroll interfaces | TBD | 🔴 Not Created |
| 14 | **Settings & Configuration UI** | Tenant settings, user management, system configuration | TBD | 🔴 Not Created |

---

## Sub-Phase Details

### SubPhase-01: Next.js Project Setup
**Goal:** Initialize Next.js with proper configuration.

**Configuration:**
```javascript
// next.config.js
{
  typescript: { strict: true },
  images: { domains: ['cdn.lankacommerce.lk'] },
  experimental: { serverActions: true }
}
```

**Key Tasks:**
- Create Next.js 14+ project
- Configure TypeScript with strict mode
- Set up path aliases (@/components, @/lib, etc.)
- Configure environment variables
- Set up ESLint and Prettier

**Project Structure:**
```
frontend/
├── app/                    # App Router pages
│   ├── (auth)/             # Auth group
│   ├── (dashboard)/        # Dashboard group
│   └── layout.tsx
├── components/             # Reusable components
│   ├── ui/                 # Base UI components
│   └── modules/            # Module-specific components
├── lib/                    # Utilities and helpers
├── hooks/                  # Custom React hooks
├── store/                  # State management
├── types/                  # TypeScript types
└── styles/                 # Global styles
```

**Dependencies:** Phase-01 (Monorepo setup)

---

### SubPhase-02: Tailwind & Design System
**Goal:** Configure Tailwind with custom design tokens.

**Design Tokens:**
```css
:root {
  --primary: #2563eb;        /* Blue */
  --secondary: #64748b;      /* Slate */
  --success: #22c55e;        /* Green */
  --warning: #f59e0b;        /* Amber */
  --error: #ef4444;          /* Red */
  --background: #ffffff;
  --foreground: #0f172a;
}
```

**Key Tasks:**
- Configure Tailwind with custom colors
- Set up typography scale
- Configure spacing system
- Create responsive breakpoints
- Dark mode configuration (optional)

**Dependencies:** SubPhase-01

---

### SubPhase-03: Component Library Setup
**Goal:** Set up Shadcn/UI with customizations.

**Core Components:**
- Button (variants: primary, secondary, outline, ghost)
- Input, Textarea, Select
- Card, Modal, Drawer
- Table with sorting/filtering
- Form components with validation
- Toast notifications
- Loading states
- Empty states

**Key Tasks:**
- Initialize Shadcn/UI
- Customize component themes
- Create composite components
- Document component usage

**Dependencies:** SubPhase-02

---

### SubPhase-04: API Client Layer
**Goal:** Create typed API client for backend communication.

**Features:**
- Axios/Fetch wrapper
- JWT token handling (access + refresh)
- Request/response interceptors
- Error handling
- Request retry logic
- Type-safe API calls

**API Client Structure:**
```typescript
// api/client.ts
const api = createApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  auth: true,
  retry: 3
});

// api/products.ts
export const productApi = {
  list: (params) => api.get<Product[]>('/products', { params }),
  get: (id) => api.get<Product>(`/products/${id}`),
  create: (data) => api.post<Product>('/products', data),
  update: (id, data) => api.patch<Product>(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`)
};
```

**Dependencies:** SubPhase-01

---

### SubPhase-05: State Management
**Goal:** Configure client-side state management.

**Tools:**
- **Zustand** - Global UI state (sidebar, modals, user)
- **TanStack Query** - Server state (API data, caching)

**Stores:**
```typescript
// stores/ui.ts
useUIStore: {
  sidebarOpen: boolean,
  theme: 'light' | 'dark',
  notifications: Notification[]
}

// stores/auth.ts
useAuthStore: {
  user: User | null,
  tenant: Tenant | null,
  permissions: string[]
}
```

**Dependencies:** SubPhase-04

---

### SubPhase-06: Authentication UI
**Goal:** Complete authentication flow interfaces.

**Pages:**
- `/login` - Tenant login page
- `/register` - New tenant registration (if allowed)
- `/forgot-password` - Password reset request
- `/reset-password` - Password reset form
- `/verify-email` - Email verification

**Features:**
- Form validation (React Hook Form + Zod)
- Loading states
- Error messaging
- Remember me option
- Social login (future)

**Dependencies:** SubPhase-03, SubPhase-04

---

### SubPhase-07: Dashboard Layout
**Goal:** Create the main ERP dashboard layout.

**Layout Components:**
```
┌─────────────────────────────────────────────────────────────┐
│ HEADER                                                      │
│ [Logo] [Search]                    [Notifications] [User]   │
├─────────────┬───────────────────────────────────────────────┤
│ SIDEBAR     │ MAIN CONTENT                                  │
│             │                                               │
│ Dashboard   │ ┌───────────────────────────────────────────┐ │
│ Products    │ │                                           │ │
│ Inventory   │ │     Page Content Area                     │ │
│ Sales       │ │                                           │ │
│ Customers   │ │                                           │ │
│ Vendors     │ │                                           │ │
│ HR          │ │                                           │ │
│ Accounting  │ │                                           │ │
│ Reports     │ │                                           │ │
│ Settings    │ └───────────────────────────────────────────┘ │
│             │                                               │
└─────────────┴───────────────────────────────────────────────┘
```

**Features:**
- Collapsible sidebar
- Breadcrumb navigation
- User dropdown menu
- Notification bell
- Global search
- Mobile responsive

**Dependencies:** SubPhase-03, SubPhase-05

---

### SubPhase-08: Product Management UI
**Goal:** Build product management interfaces.

**Pages:**
- `/products` - Product listing with filters
- `/products/new` - Create new product
- `/products/[id]` - View/edit product
- `/products/[id]/variants` - Manage variants
- `/categories` - Category management

**Features:**
- Data table with search, filter, sort, pagination
- Image upload with drag-and-drop
- Variant matrix builder
- Bulk actions (delete, update status)
- Import/Export

**Dependencies:** SubPhase-07, Phase-04 API

---

### SubPhase-09: Inventory Management UI
**Goal:** Build inventory management interfaces.

**Pages:**
- `/inventory` - Stock levels overview
- `/inventory/movements` - Stock movement history
- `/inventory/adjustments` - Stock adjustments
- `/inventory/transfers` - Warehouse transfers
- `/warehouses` - Warehouse management

**Features:**
- Stock level cards with visual indicators
- Low stock alerts
- Movement timeline
- Adjustment wizard
- Transfer request workflow

**Dependencies:** SubPhase-07, Phase-04 API

---

### SubPhase-10: Sales & Orders UI
**Goal:** Build sales management interfaces.

**Pages:**
- `/orders` - Order listing
- `/orders/[id]` - Order details
- `/invoices` - Invoice listing
- `/invoices/[id]` - Invoice details
- `/quotes` - Quote management

**Features:**
- Order status timeline
- Invoice PDF preview
- Payment recording modal
- Shipping label generation
- Order notes and timeline

**Dependencies:** SubPhase-07, Phase-05 API

---

### SubPhase-11: POS Interface
**Goal:** Build Point of Sale terminal interface.

**POS Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ [Exit POS]                              [Shift: OPEN #123]  │
├─────────────────────────────────┬───────────────────────────┤
│ PRODUCT SEARCH                  │ CART                      │
│ [🔍 Search or scan barcode...] │                           │
│                                 │ Item 1         ₨ 1,500    │
│ [Quick Buttons Grid]           │ Item 2 x 2     ₨ 3,000    │
│ ┌───────┐ ┌───────┐ ┌───────┐ │ Item 3         ₨ 500      │
│ │ Rice  │ │ Sugar │ │ Milk  │ │ ─────────────────────────  │
│ └───────┘ └───────┘ └───────┘ │ Subtotal       ₨ 5,000    │
│ ┌───────┐ ┌───────┐ ┌───────┐ │ Discount       ₨ -500     │
│ │ Tea   │ │Coffee │ │ Bread │ │ Tax            ₨ 450      │
│ └───────┘ └───────┘ └───────┘ │ ═════════════════════════  │
│                                 │ TOTAL          ₨ 4,950    │
│                                 │                           │
│                                 │ [💳 Pay] [🗑️ Clear]       │
└─────────────────────────────────┴───────────────────────────┘
```

**Features:**
- Barcode scanner support
- Quick add buttons
- Quantity adjustment
- Discount application
- Multiple payment types
- Receipt printing
- Offline indicator

**Dependencies:** SubPhase-07, Phase-05 API

---

### SubPhase-12: Customer & Vendor UI
**Goal:** Build CRM interfaces.

**Pages:**
- `/customers` - Customer listing
- `/customers/[id]` - Customer profile
- `/vendors` - Vendor listing
- `/vendors/[id]` - Vendor profile
- `/purchase-orders` - PO management

**Features:**
- Customer 360 view
- Purchase history timeline
- Credit limit management
- Communication log
- Import/Export

**Dependencies:** SubPhase-07, Phase-05 API

---

### SubPhase-13: HR & Payroll UI
**Goal:** Build HR management interfaces.

**Pages:**
- `/employees` - Employee directory
- `/employees/[id]` - Employee profile
- `/attendance` - Attendance dashboard
- `/leave` - Leave management
- `/payroll` - Payroll processing
- `/payroll/[id]` - Payslip details

**Features:**
- Org chart visualization
- Attendance calendar view
- Leave request workflow
- Payroll batch processing
- Payslip PDF generation

**Dependencies:** SubPhase-07, Phase-06 API

---

### SubPhase-14: Settings & Configuration UI
**Goal:** Build settings and configuration interfaces.

**Pages:**
- `/settings` - General settings
- `/settings/company` - Company profile
- `/settings/users` - User management
- `/settings/roles` - Role permissions
- `/settings/integrations` - Third-party integrations
- `/settings/billing` - Subscription & billing

**Features:**
- Company logo upload
- User invitation flow
- Role permission matrix
- API key management
- Billing history

**Dependencies:** SubPhase-07

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Sub-Phases | 14 |
| Sub-Phases Created | 0 |
| Task Documents Created | 0 |

**Last Updated:** 2026-01-17  
**Current Status:** Awaiting approval to create Sub-Phase folders

---

## Execution Order

```
SubPhase-01 (Next.js) ──→ SubPhase-02 (Tailwind) ──→ SubPhase-03 (Components)
       │                                                    │
       └──→ SubPhase-04 (API Client) ──→ SubPhase-05 (State)
                                               │
                                               └──→ SubPhase-06 (Auth UI)
                                               │
                                               └──→ SubPhase-07 (Layout)
                                                        │
                         ┌──────────────────────────────┼──────────────────────────────┐
                         │                              │                              │
                         ▼                              ▼                              ▼
              SubPhase-08 (Products)         SubPhase-11 (POS)           SubPhase-13 (HR)
              SubPhase-09 (Inventory)        SubPhase-12 (CRM)           SubPhase-14 (Settings)
              SubPhase-10 (Sales)
```

---

## Next Steps

1. ✅ Sub-Phases Summary Document Created (This file)
2. ⏳ Awaiting user review via flow.py
3. ⏳ Create 14 Sub-Phase folders
4. ⏳ Create Task summary for each Sub-Phase
5. ⏳ Create individual Task documents

---

*AI Agents: Focus on reusable components. POS interface needs special attention for usability.*
