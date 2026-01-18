# SubPhase 01: Webstore Project Structure - Tasks Summary

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase Index:** 01 of 14  
> **SubPhase Goal:** Set up the storefront application structure within the Next.js monorepo  
> **Total Tasks:** 88 | **Status:** Planning  
> **Estimated Duration:** 8-10 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous Phase:** [Phase-07](../../Phase-07_Frontend-Infrastructure-ERP-Dashboard/)
- **→ Next SubPhase:** [SubPhase-02_Storefront-Layout](../SubPhase-02_Storefront-Layout/)

---

## SubPhase Overview

This sub-phase establishes the storefront application structure within the existing Next.js project. The storefront will be customer-facing and separate from the ERP dashboard using route groups.

### Key Outcomes
- Storefront route group `(storefront)`
- Shared and store-specific components
- Store API client configuration
- Store state management
- Store theme foundation
- Store environment setup

### Architecture Decision
**Approach:** Same Next.js App with Different Route Groups
- ERP Dashboard: `/app/(dashboard)/`
- Storefront: `/app/(storefront)/`
- Shared: `/components/shared/`

### Technology Context
- **Framework:** Next.js 14+ with App Router
- **Styling:** Tailwind CSS with store theme
- **State:** Zustand for cart, TanStack Query for data
- **API:** Store-specific API endpoints

---

## Task Execution Order

```
TASK GROUP A: Route Group & Directory Structure (Tasks 01-14)
        │
        ▼
TASK GROUP B: Store Layout Foundation (Tasks 15-30)
        │
        ▼
TASK GROUP C: Store Configuration (Tasks 31-46)
        │
        ▼
TASK GROUP D: Store API Client (Tasks 47-60)
        │
        ▼
TASK GROUP E: Store State Management (Tasks 61-76)
        │
        ▼
TASK GROUP F: Store Utilities & Testing (Tasks 77-88)
```

---

## Task Index

### Group A: Route Group & Directory Structure (Tasks 01-14)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create Storefront Route Group** | Set up app/(storefront)/ directory | Phase-07 | 🔴 Not Created |
| 02 | **Create Store Root Layout** | Create (storefront)/layout.tsx | Task 01 | 🔴 Not Created |
| 03 | **Create Store Homepage Route** | Create (storefront)/page.tsx | Task 01 | 🔴 Not Created |
| 04 | **Create Products Directory** | Create (storefront)/products/ | Task 01 | 🔴 Not Created |
| 05 | **Create Cart Directory** | Create (storefront)/cart/ | Task 01 | 🔴 Not Created |
| 06 | **Create Checkout Directory** | Create (storefront)/checkout/ | Task 01 | 🔴 Not Created |
| 07 | **Create Account Directory** | Create (storefront)/account/ | Task 01 | 🔴 Not Created |
| 08 | **Create Search Page Route** | Create (storefront)/search/ | Task 01 | 🔴 Not Created |
| 09 | **Create Store Loading State** | Create loading.tsx for store | Task 02 | 🔴 Not Created |
| 10 | **Create Store Error Boundary** | Create error.tsx for store | Task 02 | 🔴 Not Created |
| 11 | **Create Store Not Found Page** | Create not-found.tsx for store | Task 02 | 🔴 Not Created |
| 12 | **Create Store Components Directory** | Set up components/storefront/ | Task 01 | 🔴 Not Created |
| 13 | **Create Shared Components Directory** | Set up components/shared/ | Task 01 | 🔴 Not Created |
| 14 | **Verify Directory Structure** | Test all routes are accessible | Task 13 | 🔴 Not Created |

---

### Group B: Store Layout Foundation (Tasks 15-30)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 15 | **Create Store Layout Component** | Main store layout wrapper | Task 14 | 🔴 Not Created |
| 16 | **Create Store Providers** | Context providers for store | Task 15 | 🔴 Not Created |
| 17 | **Create Store Theme Provider** | Theme context for store | Task 16 | 🔴 Not Created |
| 18 | **Create Cart Provider** | Cart context provider | Task 16 | 🔴 Not Created |
| 19 | **Create Store Auth Provider** | Customer auth context | Task 16 | 🔴 Not Created |
| 20 | **Create Store Head Component** | Default meta tags | Task 15 | 🔴 Not Created |
| 21 | **Create Store Font Setup** | Configure store fonts | Task 15 | 🔴 Not Created |
| 22 | **Create Store Global Styles** | Global CSS for store | Task 21 | 🔴 Not Created |
| 23 | **Create Store CSS Variables** | CSS custom properties | Task 22 | 🔴 Not Created |
| 24 | **Create Responsive Breakpoints** | Store-specific breakpoints | Task 23 | 🔴 Not Created |
| 25 | **Create Store Container Component** | Max-width container | Task 15 | 🔴 Not Created |
| 26 | **Create Store Grid Component** | Product grid layout | Task 25 | 🔴 Not Created |
| 27 | **Create Store Section Component** | Section wrapper component | Task 25 | 🔴 Not Created |
| 28 | **Create Store Skeleton Components** | Loading skeleton variants | Task 15 | 🔴 Not Created |
| 29 | **Create Store Toast Setup** | Toast notifications config | Task 15 | 🔴 Not Created |
| 30 | **Verify Layout Structure** | Test layout rendering | Task 29 | 🔴 Not Created |

---

### Group C: Store Configuration (Tasks 31-46)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 31 | **Create Store Environment Variables** | Store-specific env vars | Task 14 | 🔴 Not Created |
| 32 | **Create Store Config File** | Store configuration object | Task 31 | 🔴 Not Created |
| 33 | **Define Store Metadata** | Store name, description | Task 32 | 🔴 Not Created |
| 34 | **Configure Currency Settings** | LKR currency formatting | Task 32 | 🔴 Not Created |
| 35 | **Configure Locale Settings** | Sri Lanka locale (en-LK) | Task 32 | 🔴 Not Created |
| 36 | **Create Store Feature Flags** | Feature toggle config | Task 32 | 🔴 Not Created |
| 37 | **Create Store Routes Config** | Define all store routes | Task 32 | 🔴 Not Created |
| 38 | **Create Store Navigation Config** | Navigation menu structure | Task 37 | 🔴 Not Created |
| 39 | **Create Store Footer Config** | Footer links structure | Task 37 | 🔴 Not Created |
| 40 | **Create Social Links Config** | Social media links | Task 39 | 🔴 Not Created |
| 41 | **Create Contact Info Config** | Store contact details | Task 32 | 🔴 Not Created |
| 42 | **Create Shipping Config** | Shipping zones, methods | Task 32 | 🔴 Not Created |
| 43 | **Create Payment Methods Config** | Available payment options | Task 32 | 🔴 Not Created |
| 44 | **Create SEO Default Config** | Default SEO settings | Task 33 | 🔴 Not Created |
| 45 | **Create Image Config** | Image sizes, quality | Task 32 | 🔴 Not Created |
| 46 | **Verify Configuration** | Test all config values | Task 45 | 🔴 Not Created |

---

### Group D: Store API Client (Tasks 47-60)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 47 | **Create Store API Client** | API client for storefront | Task 46 | 🔴 Not Created |
| 48 | **Configure Store Base URL** | Storefront API base URL | Task 47 | 🔴 Not Created |
| 49 | **Create Store Auth Interceptor** | Customer token handling | Task 47 | 🔴 Not Created |
| 50 | **Create Store Error Handler** | API error handling | Task 47 | 🔴 Not Created |
| 51 | **Create Products API Module** | Product-related API calls | Task 47 | 🔴 Not Created |
| 52 | **Create Categories API Module** | Category-related API calls | Task 47 | 🔴 Not Created |
| 53 | **Create Cart API Module** | Cart-related API calls | Task 47 | 🔴 Not Created |
| 54 | **Create Checkout API Module** | Checkout-related API calls | Task 47 | 🔴 Not Created |
| 55 | **Create Customer API Module** | Customer account API calls | Task 47 | 🔴 Not Created |
| 56 | **Create Orders API Module** | Order-related API calls | Task 47 | 🔴 Not Created |
| 57 | **Create Reviews API Module** | Product reviews API calls | Task 47 | 🔴 Not Created |
| 58 | **Create Wishlist API Module** | Wishlist API calls | Task 47 | 🔴 Not Created |
| 59 | **Create Search API Module** | Search-related API calls | Task 47 | 🔴 Not Created |
| 60 | **Verify API Client** | Test all API modules | Task 59 | 🔴 Not Created |

---

### Group E: Store State Management (Tasks 61-76)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 61 | **Create Store Zustand Config** | Configure Zustand for store | Task 60 | 🔴 Not Created |
| 62 | **Create Cart Store** | Shopping cart state | Task 61 | 🔴 Not Created |
| 63 | **Create Add to Cart Action** | Add item to cart | Task 62 | 🔴 Not Created |
| 64 | **Create Update Cart Action** | Update cart item quantity | Task 62 | 🔴 Not Created |
| 65 | **Create Remove from Cart Action** | Remove item from cart | Task 62 | 🔴 Not Created |
| 66 | **Create Clear Cart Action** | Clear entire cart | Task 62 | 🔴 Not Created |
| 67 | **Create Cart Persistence** | LocalStorage persistence | Task 62 | 🔴 Not Created |
| 68 | **Create Wishlist Store** | Wishlist state management | Task 61 | 🔴 Not Created |
| 69 | **Create Customer Store** | Customer auth state | Task 61 | 🔴 Not Created |
| 70 | **Create UI Store** | UI state (mobile menu, etc.) | Task 61 | 🔴 Not Created |
| 71 | **Create Recently Viewed Store** | Recently viewed products | Task 61 | 🔴 Not Created |
| 72 | **Create Comparison Store** | Product comparison state | Task 61 | 🔴 Not Created |
| 73 | **Create TanStack Query Config** | Query client for store | Task 61 | 🔴 Not Created |
| 74 | **Create Product Query Hooks** | useProducts, useProduct | Task 73 | 🔴 Not Created |
| 75 | **Create Category Query Hooks** | useCategories hooks | Task 73 | 🔴 Not Created |
| 76 | **Verify State Management** | Test all stores and hooks | Task 75 | 🔴 Not Created |

---

### Group F: Store Utilities & Testing (Tasks 77-88)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 77 | **Create Currency Formatter** | Format LKR amounts | Task 76 | 🔴 Not Created |
| 78 | **Create Price Display Utility** | Display sale/regular price | Task 77 | 🔴 Not Created |
| 79 | **Create Discount Calculator** | Calculate discounts | Task 77 | 🔴 Not Created |
| 80 | **Create Image URL Helper** | Generate image URLs | Task 76 | 🔴 Not Created |
| 81 | **Create Product URL Helper** | Generate product slugs | Task 76 | 🔴 Not Created |
| 82 | **Create Category URL Helper** | Generate category slugs | Task 76 | 🔴 Not Created |
| 83 | **Create Cart Total Calculator** | Calculate cart totals | Task 76 | 🔴 Not Created |
| 84 | **Create Stock Checker Utility** | Check product availability | Task 76 | 🔴 Not Created |
| 85 | **Create Store TypeScript Types** | Define store-specific types | Task 76 | 🔴 Not Created |
| 86 | **Create Store Type Exports** | Export all types | Task 85 | 🔴 Not Created |
| 87 | **Create Store Project Documentation** | Document store structure | Task 86 | 🔴 Not Created |
| 88 | **Final Verification & Testing** | Test complete store setup | Task 87 | 🔴 Not Created |

---

## Expected Final Structure

```
frontend/
├── app/
│   ├── (dashboard)/              # ERP Dashboard (Phase-07)
│   └── (storefront)/             # Customer-facing store
│       ├── layout.tsx            # Store layout
│       ├── page.tsx              # Homepage
│       ├── loading.tsx           # Global loading
│       ├── error.tsx             # Error boundary
│       ├── not-found.tsx         # 404 page
│       ├── products/             # Product pages
│       ├── cart/                 # Cart page
│       ├── checkout/             # Checkout flow
│       ├── account/              # Customer portal
│       └── search/               # Search page
├── components/
│   ├── ui/                       # Base UI (shared)
│   ├── modules/                  # ERP modules
│   ├── storefront/               # Store-specific components
│   │   ├── layout/               # Header, Footer
│   │   ├── product/              # Product components
│   │   ├── cart/                 # Cart components
│   │   ├── checkout/             # Checkout components
│   │   └── account/              # Account components
│   └── shared/                   # Shared between ERP & Store
├── lib/
│   ├── api/                      # API client
│   ├── store/                    # Store-specific utilities
│   │   ├── config.ts             # Store configuration
│   │   ├── routes.ts             # Store routes
│   │   └── utils.ts              # Store utilities
│   └── utils/                    # Shared utilities
├── store/                        # State management
│   ├── cart.ts                   # Cart store
│   ├── wishlist.ts               # Wishlist store
│   ├── customer.ts               # Customer auth store
│   └── ui.ts                     # UI state store
├── hooks/
│   └── store/                    # Store-specific hooks
│       ├── useCart.ts
│       ├── useWishlist.ts
│       └── useCustomer.ts
└── types/
    └── store/                    # Store-specific types
        ├── product.ts
        ├── cart.ts
        ├── customer.ts
        └── order.ts
```

---

## Configuration Values

| Config Key | Default Value | Description |
|------------|---------------|-------------|
| store.name | "LankaCommerce Store" | Store display name |
| store.currency | "LKR" | Currency code |
| store.currencySymbol | "₨" | Currency symbol |
| store.locale | "en-LK" | Locale setting |
| store.timezone | "Asia/Colombo" | Timezone |
| store.phoneCode | "+94" | Country phone code |

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 88 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 88 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Notes for AI Agents

1. **Execution Order:** Tasks must be executed in numerical order within each group
2. **Route Groups:** Use `(storefront)` route group for store pages
3. **Separation:** Keep store components separate from ERP components
4. **LKR Currency:** All prices displayed in Sri Lankan Rupees (₨)
5. **Cart Persistence:** Use localStorage with API sync
6. **Dependencies:** This sub-phase depends on Phase-07 Next.js setup
7. **No Code Snippets in Tasks:** Individual task documents should focus on descriptions, not implementation code
8. **Shared Components:** Some UI components can be shared between ERP and Store
9. **Mobile First:** Design for mobile-first experience
10. **Performance:** Consider ISR for product pages
11. **API Client:** Create separate store API client
12. **TypeScript:** Define all store-specific types
