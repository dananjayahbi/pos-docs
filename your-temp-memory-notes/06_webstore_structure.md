# LCC — Webstore (Storefront) Structure

## Layout Structure
```
┌────────────────────────────────────────────────────────────┐
│ ANNOUNCEMENT BAR (configurable text)                       │
│ "Free shipping on orders over ₨5,000"                      │
├────────────────────────────────────────────────────────────┤
│ HEADER                                                     │
│ [Logo] [Categories ▼ Mega Menu] [🔍 Search] [👤] [🛒 3]   │
│ MOBILE: [≡] [Logo] [🔍] [🛒]                               │
│ Mobile Nav Drawer (slide-in from left)                     │
├────────────────────────────────────────────────────────────┤
│                  MAIN CONTENT                              │
├────────────────────────────────────────────────────────────┤
│ FOOTER                                                     │
│ [Store Info] [Quick Links] [Categories] [Social Links]    │
│ About | Contact | Terms | Privacy | Returns                │
│ © 2026 StoreName. Powered by LankaCommerce                │
│                             [💬 WhatsApp Widget] floating  │
│                             [🤖 AI Chat Widget] floating   │
└────────────────────────────────────────────────────────────┘
```

## Homepage Layout
```
┌────────────────────────────────────────────────────────────┐
│ HERO BANNER (full-width)                                   │
│ [Slider: 3 images with text overlay and CTA buttons]      │
├────────────────────────────────────────────────────────────┤
│ FLASH SALE (if active)                                     │
│ ⏰ Ends in: 02:45:30  [See Deals →]                        │
├────────────────────────────────────────────────────────────┤
│ POPULAR CATEGORIES                                         │
│ [Cat1][Cat2][Cat3][Cat4][Cat5][Cat6]  — horizontal scroll  │
├────────────────────────────────────────────────────────────┤
│ FEATURED PRODUCTS (grid — 4 cols desktop)                  │
│ [ProductCard] × N                                          │
├────────────────────────────────────────────────────────────┤
│ "PERSONALIZED FOR YOU" (AI — authenticated users)          │
│ [ProductCard] × N  (horizontal scroll)                    │
├────────────────────────────────────────────────────────────┤
│ TRENDING NOW                                               │
│ [ProductCard] × N                                          │
├────────────────────────────────────────────────────────────┤
│ TESTIMONIALS / REVIEWS                                     │
│ ⭐⭐⭐⭐⭐ "Excellent service..." — Customer Name             │
├────────────────────────────────────────────────────────────┤
│ NEWSLETTER SIGNUP                                          │
│ Your email [____________] [Subscribe]                       │
└────────────────────────────────────────────────────────────┘
```

## Product Catalog Page Layout
```
┌──────────────────────────────────────────────────────────────┐
│ CATEGORY TITLE + BREADCRUMB                                  │
├─────────────────────┬────────────────────────────────────────┤
│ FILTER SIDEBAR      │ PRODUCT GRID                           │
│ 260px               │                                        │
│                     │ Sort: [Newest ▼] — 48 products found  │
│ Categories (tree)   │ [Grid ⊞] [List ≡] toggle              │
│ ├── Men's Clothing  │                                        │
│ │   ├── T-Shirts    │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│ │   └── Shirts      │ │[img] │ │[img] │ │[img] │ │[img] │  │
│ └── Women's         │ │Name  │ │Name  │ │Name  │ │Name  │  │
│                     │ │⭐⭐⭐⭐ │ │⭐⭐⭐⭐ │ │⭐⭐⭐  │ │⭐⭐⭐⭐ │  │
│ Price Range         │ │₨1,999│ │₨3,500│ │₨ 800 │ │₨2,200│  │
│ [═══●═══] 0—50,000  │ │[Cart]│ │[Cart]│ │[Cart]│ │[Cart]│  │
│                     │ └──────┘ └──────┘ └──────┘ └──────┘  │
│ Size                │                                        │
│ [S][M][L][XL][XXL]  │ [Load More] or Pagination             │
│                     │                                        │
│ Color               │ Empty State (if no results)            │
│ [🔵][🔴][⚫][⚪]     │                                        │
│                     │                                        │
│ ☐ In Stock Only    │                                        │
│ ☐ On Sale         │                                        │
│                     │                                        │
│ [Clear Filters]     │                                        │
└─────────────────────┴────────────────────────────────────────┘
```

## Product Detail Page Layout
```
┌──────────────────────────────────────────────────────────────┐
│ Breadcrumb: Home > Clothing > Men's T-Shirts > Product Name  │
├──────────────────────┬───────────────────────────────────────┤
│ IMAGE GALLERY        │ PRODUCT INFO                          │
│                      │                                       │
│ [main large image]   │ Brand Name                            │
│ [zoom on hover]      │ Product Full Name                     │
│ [360° view]          │ ⭐⭐⭐⭐⭐ 25 reviews | 120 sold          │
│                      │                                       │
│ Thumbnails:          │ ~~₨ 2,500~~  ₨ 1,999                 │
│ [T][T][T][T]         │ 🏷 Save ₨501 (20% off)               │
│                      │                                       │
│                      │ Size: [S][M][L✓][XL][XXL]            │
│                      │ + Size Guide link                     │
│                      │                                       │
│                      │ Color: [🔵 Blue✓][🔴 Red][⚫ Black]   │
│                      │                                       │
│                      │ Qty: [-] 1 [+]   Stock: 15 left      │
│                      │                                       │
│                      │ [🛒 Add to Cart]  [⚡ Buy Now]        │
│                      │ [♡ Add to Wishlist]                   │
│                      │                                       │
│                      │ Share: [WhatsApp][Facebook]           │
│                      │                                       │
│                      │ SKU: T-SHIRT-BLUE-M                  │
│                      │ Category: Men's T-Shirts              │
│                      │                                       │
│                      │ 🚚 Free shipping above ₨5,000        │
│                      │ 🔄 7-day returns accepted             │
│                      │                                       │
│                      │ KOKO BNPL (if order > ₨15,000):      │
│                      │ 3× ₨ 667 / 0% interest               │
└──────────────────────┴───────────────────────────────────────┤
│ PRODUCT TABS                                                 │
│ [Description] [Specifications] [Reviews (25)] [Shipping]   │
│ Tab content below                                           │
├──────────────────────────────────────────────────────────────┤
│ FREQUENTLY BOUGHT TOGETHER                                   │
│ [Prod A img] + [Prod B img] + [Prod C img]  Total: ₨5,497   │
│ [Add Selected to Cart]                                       │
├──────────────────────────────────────────────────────────────┤
│ RELATED PRODUCTS (horizontal scroll)                        │
│ [ProductCard] → [ProductCard] → [ProductCard] →              │
└──────────────────────────────────────────────────────────────┘
```

## Checkout Flow (5 Steps)

### Step 1 — Account
- Guest Checkout option
- Login option (form)
- Register option (form)
- Continue as Guest button

### Step 2 — Shipping Address
```
Name: [____________]  Last Name: [____________]
Phone: [+94 XX XXX XXXX]
Email: [____________]
Province:  [Western Province ▼]
District:  [Colombo ▼]
City:      [Colombo 03 ▼]
Address Line 1: [________________]
Address Line 2: [________________] (optional)
```

### Step 3 — Shipping Method
```
○ Standard Delivery (3–5 business days)   ₨ 350
● Express Delivery (1–2 business days)    ₨ 650
○ Store Pickup — Free                     ₨ 0
   Pickup Address: 123 Main St, Colombo
```

### Step 4 — Payment
```
○ [PayHere logo]    Credit/Debit Card / Internet Banking
● [WebXPay logo]    All Cards Accepted
○ [KOKO logo]       Pay in 3 × ₨1,666  (0% interest)
   Today: ₨1,666 | 30 days: ₨1,666 | 60 days: ₨1,666
○ Bank Transfer     Upload payment slip
   [Upload Slip btn] or drag-and-drop
○ Cash on Delivery  +₨100 handling fee
```

### Step 5 — Review & Confirm
```
ORDER SUMMARY
─────────────
T-Shirt Red M  × 2     ₨ 3,000
Trousers 32    × 1     ₨ 3,000
─────────────
Subtotal:              ₨ 6,000
Discount (SUMMER10):  −₨   600
Shipping (Express):    ₨   650
─────────────
TOTAL:                 ₨ 6,050
─────────────
Payment: WebXPay
─────────────
[Place Order] button
```

### Order Confirmation
```
✅ Order Placed Successfully!
Order #: ORD-2026-0042
We'll send you a WhatsApp confirmation to +94 77 123 4567
[Track Your Order] [Continue Shopping]
```

## Customer Portal Layout
```
ACCOUNT NAV: Dashboard | Orders | Addresses | Wishlist | Reviews | Settings

DASHBOARD:
Welcome, Kamal! 👋
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ 📦 Orders   │  │ ❤️ Wishlist  │  │ 🏠 Addresses │
│  12 Total   │  │  5 Items     │  │  2 Saved     │
│ [View All]  │  │ [View All]  │  │ [Manage]    │
└──────────────┘  └──────────────┘  └──────────────┘

RECENT ORDERS:
#ORD-2026-0042  Jan 15  ₨7,998   🚚 Out for Delivery  [Track] [Details]
#ORD-2026-0038  Jan 10  ₨4,500   ✅ Delivered          [Review] [Reorder]
```

## Order Tracking Screen
```
Order #ORD-2026-0042 — Koombiyo Courier — Waybill: KMB123456

TRACKING TIMELINE:
[●]──────[●]──────[●]──────[○]──────[○]
Placed   Confirmed  Shipped  Out for  Delivered
Jan 15   Jan 15    Jan 16   Delivery
10:30AM  11:00AM   2:45PM

Current Status: In Transit
Estimated Delivery: Jan 17, 2026

[Waybill PDF] [Contact Courier]
```

## Smart Search UI
- Search bar in header (prominent)
- Autocomplete dropdown:
  - Suggestions: product names, categories
  - Recent searches (local storage)
  - Result count per suggestion
- Full search results page:
  - "Did you mean?" correction
  - Sinhala-glish: `saree`/`sari`/`sariya` → same result
  - Fuzzy: `nikey` → Nike
  - Filters sidebar same as catalog page

## Marketing UI Components
| Component | Behavior |
|-----------|----------|
| Flash Sale Countdown | Timer widget (HH:MM:SS) on hero/category pages |
| Coupon Code | In cart page + checkout step 4 |
| Exit Intent Popup | Newsletter signup, triggers on mouse-leave-page |
| WhatsApp Chat Widget | Floating bottom-right, chat bubble, working hours |
| AI Chatbot Widget | Floating icon alongside WhatsApp |
| Share Buttons | WhatsApp + Facebook on product pages |
| Announcement Bar | Dismissible top bar |
| BNPL Widget | On product pages + checkout for orders > threshold |
