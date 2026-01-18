# SubPhase 09: Customer Portal - Tasks Summary

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase Index:** 09 of 14  
> **SubPhase Goal:** Build customer account dashboard with orders, addresses, wishlist, reviews, and settings  
> **Total Tasks:** 96 | **Status:** Planning  
> **Estimated Duration:** 12-14 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-08_Customer-Authentication](../SubPhase-08_Customer-Authentication/)
- **→ Next SubPhase:** [SubPhase-10_Theme-Engine](../SubPhase-10_Theme-Engine/)

---

## SubPhase Overview

This sub-phase creates the customer account portal with dashboard overview, order history and tracking, address management, wishlist, reviews, and account settings.

### Key Outcomes
- Customer dashboard overview
- Order history and order details
- Order tracking with visual progress
- Shipping and billing addresses
- Wishlist management
- Customer reviews section
- Account settings and profile

### Portal Sections
- Dashboard (overview)
- Orders (history, tracking)
- Addresses (shipping, billing)
- Wishlist
- Reviews (my reviews)
- Account settings

### Order Tracking Display
```
Order #12345 - Placed Jan 15, 2026

Status: [●]────[●]────[○]────[○]────[○]
        Placed  Confirmed  Shipped  Out for    Delivered
                                   Delivery
```

### Technology Context
- **State:** TanStack Query for data fetching
- **Routes:** Nested routes under /account/
- **Layout:** Sidebar navigation on desktop
- **Protected:** All routes require auth

---

## Task Execution Order

```
TASK GROUP A: Portal Routes & Layout (Tasks 01-16)
        │
        ▼
TASK GROUP B: Dashboard & Orders (Tasks 17-36)
        │
        ▼
TASK GROUP C: Order Details & Tracking (Tasks 37-52)
        │
        ▼
TASK GROUP D: Addresses (Tasks 53-68)
        │
        ▼
TASK GROUP E: Wishlist & Reviews (Tasks 69-84)
        │
        ▼
TASK GROUP F: Account Settings & Testing (Tasks 85-96)
```

---

## Task Index

### Group A: Portal Routes & Layout (Tasks 01-16)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create Portal Directory** | Set up account/dashboard/ | SubPhase-08 | 🔴 Not Created |
| 02 | **Create Portal Layout** | Sidebar + main layout | Task 01 | 🔴 Not Created |
| 03 | **Create Dashboard Route** | account/dashboard/page.tsx | Task 01 | 🔴 Not Created |
| 04 | **Create Orders Route** | account/orders/page.tsx | Task 01 | 🔴 Not Created |
| 05 | **Create Order Detail Route** | account/orders/[id]/page.tsx | Task 01 | 🔴 Not Created |
| 06 | **Create Addresses Route** | account/addresses/page.tsx | Task 01 | 🔴 Not Created |
| 07 | **Create Wishlist Route** | account/wishlist/page.tsx | Task 01 | 🔴 Not Created |
| 08 | **Create Reviews Route** | account/reviews/page.tsx | Task 01 | 🔴 Not Created |
| 09 | **Create Settings Route** | account/settings/page.tsx | Task 01 | 🔴 Not Created |
| 10 | **Create Portal Sidebar** | Navigation sidebar | Task 02 | 🔴 Not Created |
| 11 | **Create Sidebar Nav Item** | Single nav link | Task 10 | 🔴 Not Created |
| 12 | **Create Active Nav Indicator** | Active page highlight | Task 11 | 🔴 Not Created |
| 13 | **Create Mobile Nav Drawer** | Mobile navigation | Task 10 | 🔴 Not Created |
| 14 | **Create Portal Header** | Customer name + greeting | Task 02 | 🔴 Not Created |
| 15 | **Create Logout Button** | Logout from portal | Task 10 | 🔴 Not Created |
| 16 | **Verify Portal Routes** | Test all portal routes | Task 15 | 🔴 Not Created |

---

### Group B: Dashboard & Orders (Tasks 17-36)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 17 | **Create Dashboard Page** | Dashboard component | Task 16 | 🔴 Not Created |
| 18 | **Create Welcome Card** | Welcome message | Task 17 | 🔴 Not Created |
| 19 | **Create Stats Summary** | Orders, wishlist counts | Task 17 | 🔴 Not Created |
| 20 | **Create Recent Orders Card** | Last 3 orders | Task 17 | 🔴 Not Created |
| 21 | **Create View All Orders Link** | Link to orders | Task 20 | 🔴 Not Created |
| 22 | **Create Quick Actions** | Frequent actions | Task 17 | 🔴 Not Created |
| 23 | **Create Dashboard Loading** | Loading skeleton | Task 17 | 🔴 Not Created |
| 24 | **Create Orders Page** | Orders list page | Task 16 | 🔴 Not Created |
| 25 | **Create Orders Header** | "My Orders" title | Task 24 | 🔴 Not Created |
| 26 | **Create Orders Filter** | Filter by status | Task 24 | 🔴 Not Created |
| 27 | **Create Orders List** | List of orders | Task 24 | 🔴 Not Created |
| 28 | **Create Order Card** | Single order summary | Task 27 | 🔴 Not Created |
| 29 | **Create Order Date** | Order date display | Task 28 | 🔴 Not Created |
| 30 | **Create Order Status Badge** | Status badge (Shipped, etc.) | Task 28 | 🔴 Not Created |
| 31 | **Create Order Total** | Order total in LKR | Task 28 | 🔴 Not Created |
| 32 | **Create View Order Button** | Link to order details | Task 28 | 🔴 Not Created |
| 33 | **Create Orders Pagination** | Paginate orders | Task 27 | 🔴 Not Created |
| 34 | **Create Empty Orders State** | No orders message | Task 27 | 🔴 Not Created |
| 35 | **Create Start Shopping CTA** | CTA to browse products | Task 34 | 🔴 Not Created |
| 36 | **Verify Orders List** | Test orders display | Task 35 | 🔴 Not Created |

---

### Group C: Order Details & Tracking (Tasks 37-52)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 37 | **Create Order Detail Page** | Single order page | Task 36 | 🔴 Not Created |
| 38 | **Create Order Header** | Order # and date | Task 37 | 🔴 Not Created |
| 39 | **Create Order Status Section** | Current status | Task 37 | 🔴 Not Created |
| 40 | **Create Order Tracking** | Visual progress tracker | Task 39 | 🔴 Not Created |
| 41 | **Create Tracking Step** | Single step component | Task 40 | 🔴 Not Created |
| 42 | **Create Step Completed State** | Filled circle | Task 41 | 🔴 Not Created |
| 43 | **Create Step Pending State** | Empty circle | Task 41 | 🔴 Not Created |
| 44 | **Create Order Items Section** | List of items | Task 37 | 🔴 Not Created |
| 45 | **Create Order Item Row** | Single item display | Task 44 | 🔴 Not Created |
| 46 | **Create Shipping Address Card** | Delivery address | Task 37 | 🔴 Not Created |
| 47 | **Create Payment Info Card** | Payment method used | Task 37 | 🔴 Not Created |
| 48 | **Create Order Summary Card** | Subtotal, shipping, total | Task 37 | 🔴 Not Created |
| 49 | **Create Reorder Button** | Add items to cart | Task 37 | 🔴 Not Created |
| 50 | **Create Download Invoice** | PDF invoice download | Task 37 | 🔴 Not Created |
| 51 | **Create Contact Support** | WhatsApp support link | Task 37 | 🔴 Not Created |
| 52 | **Verify Order Details** | Test order detail page | Task 51 | 🔴 Not Created |

---

### Group D: Addresses (Tasks 53-68)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 53 | **Create Addresses Page** | Addresses list page | Task 52 | 🔴 Not Created |
| 54 | **Create Addresses Header** | "My Addresses" title | Task 53 | 🔴 Not Created |
| 55 | **Create Address Grid** | Grid of address cards | Task 53 | 🔴 Not Created |
| 56 | **Create Address Card** | Single address display | Task 55 | 🔴 Not Created |
| 57 | **Create Default Badge** | "Default" indicator | Task 56 | 🔴 Not Created |
| 58 | **Create Address Type** | Shipping/Billing label | Task 56 | 🔴 Not Created |
| 59 | **Create Edit Address Button** | Open edit modal | Task 56 | 🔴 Not Created |
| 60 | **Create Delete Address Button** | Remove address | Task 56 | 🔴 Not Created |
| 61 | **Create Set Default Button** | Make default | Task 56 | 🔴 Not Created |
| 62 | **Create Add New Address** | Add address button | Task 53 | 🔴 Not Created |
| 63 | **Create Address Form Modal** | Add/edit modal | Task 62 | 🔴 Not Created |
| 64 | **Create Address Form** | Province, district, city | Task 63 | 🔴 Not Created |
| 65 | **Create Address Validation** | Form validation | Task 64 | 🔴 Not Created |
| 66 | **Create Save Address** | Save address API | Task 65 | 🔴 Not Created |
| 67 | **Create Delete Confirmation** | Confirm delete modal | Task 60 | 🔴 Not Created |
| 68 | **Verify Address Management** | Test CRUD operations | Task 67 | 🔴 Not Created |

---

### Group E: Wishlist & Reviews (Tasks 69-84)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 69 | **Create Wishlist Page** | Wishlist page | Task 68 | 🔴 Not Created |
| 70 | **Create Wishlist Header** | "My Wishlist" title | Task 69 | 🔴 Not Created |
| 71 | **Create Wishlist Grid** | Product grid | Task 69 | 🔴 Not Created |
| 72 | **Create Wishlist Product Card** | Product with actions | Task 71 | 🔴 Not Created |
| 73 | **Create Add to Cart Button** | Move to cart | Task 72 | 🔴 Not Created |
| 74 | **Create Remove from Wishlist** | Remove button | Task 72 | 🔴 Not Created |
| 75 | **Create Empty Wishlist State** | No items message | Task 71 | 🔴 Not Created |
| 76 | **Create Browse Products CTA** | CTA to shop | Task 75 | 🔴 Not Created |
| 77 | **Create Reviews Page** | My reviews page | Task 68 | 🔴 Not Created |
| 78 | **Create Reviews Header** | "My Reviews" title | Task 77 | 🔴 Not Created |
| 79 | **Create Review List** | List of reviews | Task 77 | 🔴 Not Created |
| 80 | **Create Review Card** | Single review display | Task 79 | 🔴 Not Created |
| 81 | **Create Edit Review Button** | Edit review modal | Task 80 | 🔴 Not Created |
| 82 | **Create Delete Review Button** | Remove review | Task 80 | 🔴 Not Created |
| 83 | **Create Empty Reviews State** | No reviews message | Task 79 | 🔴 Not Created |
| 84 | **Verify Wishlist & Reviews** | Test both features | Task 83 | 🔴 Not Created |

---

### Group F: Account Settings & Testing (Tasks 85-96)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 85 | **Create Settings Page** | Account settings page | Task 84 | 🔴 Not Created |
| 86 | **Create Profile Section** | Name, email, phone | Task 85 | 🔴 Not Created |
| 87 | **Create Profile Form** | Edit profile form | Task 86 | 🔴 Not Created |
| 88 | **Create Update Profile** | Save profile API | Task 87 | 🔴 Not Created |
| 89 | **Create Password Section** | Change password | Task 85 | 🔴 Not Created |
| 90 | **Create Change Password Form** | Old/new password | Task 89 | 🔴 Not Created |
| 91 | **Create Notification Settings** | Email/WhatsApp prefs | Task 85 | 🔴 Not Created |
| 92 | **Create Delete Account** | Account deletion | Task 85 | 🔴 Not Created |
| 93 | **Create Delete Confirmation** | Confirm delete modal | Task 92 | 🔴 Not Created |
| 94 | **Test Dashboard** | Test dashboard page | Task 17 | 🔴 Not Created |
| 95 | **Test Address CRUD** | Test address operations | Task 68 | 🔴 Not Created |
| 96 | **Test Mobile Portal** | Mobile responsiveness | Task 13 | 🔴 Not Created |

---

## Expected Final Structure

```
frontend/
└── app/
    └── (storefront)/
        └── account/
            ├── layout.tsx                      # Portal layout (Task 02)
            ├── dashboard/
            │   └── page.tsx                    # Dashboard (Task 03)
            ├── orders/
            │   ├── page.tsx                    # Orders list (Task 04)
            │   └── [id]/
            │       └── page.tsx                # Order details (Task 05)
            ├── addresses/
            │   └── page.tsx                    # Addresses (Task 06)
            ├── wishlist/
            │   └── page.tsx                    # Wishlist (Task 07)
            ├── reviews/
            │   └── page.tsx                    # Reviews (Task 08)
            └── settings/
                └── page.tsx                    # Settings (Task 09)
└── components/
    └── storefront/
        └── portal/
            ├── Layout/
            │   ├── PortalLayout.tsx            # Layout (Task 02)
            │   ├── PortalSidebar.tsx           # Sidebar (Task 10)
            │   └── MobileNavDrawer.tsx         # Mobile nav (Task 13)
            ├── Dashboard/
            │   ├── Dashboard.tsx               # Dashboard (Task 17)
            │   ├── WelcomeCard.tsx             # Welcome (Task 18)
            │   └── RecentOrders.tsx            # Recent (Task 20)
            ├── Orders/
            │   ├── OrdersList.tsx              # List (Task 27)
            │   ├── OrderCard.tsx               # Card (Task 28)
            │   ├── OrderDetail.tsx             # Detail (Task 37)
            │   └── OrderTracking.tsx           # Tracking (Task 40)
            ├── Addresses/
            │   ├── AddressGrid.tsx             # Grid (Task 55)
            │   ├── AddressCard.tsx             # Card (Task 56)
            │   └── AddressFormModal.tsx        # Modal (Task 63)
            ├── Wishlist/
            │   ├── WishlistGrid.tsx            # Grid (Task 71)
            │   └── WishlistCard.tsx            # Card (Task 72)
            ├── Reviews/
            │   ├── ReviewList.tsx              # List (Task 79)
            │   └── ReviewCard.tsx              # Card (Task 80)
            └── Settings/
                ├── ProfileSection.tsx          # Profile (Task 86)
                ├── PasswordSection.tsx         # Password (Task 89)
                └── NotificationSettings.tsx    # Notifications (Task 91)
└── services/
    └── storefront/
        └── portal/
            ├── orderService.ts                 # Orders API
            ├── addressService.ts               # Addresses API
            ├── wishlistService.ts              # Wishlist API
            └── reviewService.ts                # Reviews API
```

---

## Progress Tracking

| Group | Name | Tasks | Completed | Progress |
|-------|------|-------|-----------|----------|
| A | Portal Routes & Layout | 16 | 0 | 0% |
| B | Dashboard & Orders | 20 | 0 | 0% |
| C | Order Details & Tracking | 16 | 0 | 0% |
| D | Addresses | 16 | 0 | 0% |
| E | Wishlist & Reviews | 16 | 0 | 0% |
| F | Account Settings & Testing | 12 | 0 | 0% |
| **Total** | | **96** | **0** | **0%** |

---

## Notes for AI Agents

1. **Execute tasks in order** - Follow Group A → F sequence
2. **Protected routes** - All portal pages require authentication
3. **Sidebar navigation** - Desktop sidebar, mobile drawer
4. **Order tracking** - Visual progress with 5 steps
5. **Sri Lanka addresses** - Province → District → City format
6. **LKR currency** - All amounts in Sri Lankan Rupees (₨)
7. **WhatsApp support** - Support links via WhatsApp
8. **Reorder feature** - Add previous order items to cart
9. **PDF invoice** - Download invoice for orders
