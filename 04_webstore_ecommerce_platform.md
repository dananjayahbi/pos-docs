# LankaCommerce Cloud (LCC) - Webstore & E-Commerce Platform

> **Customer-Facing E-Commerce Built for Sri Lankan Shoppers**

---

## Table of Contents

1. [Webstore Overview](#1-webstore-overview)
2. [Storefront Features](#2-storefront-features)
3. [Cart & Checkout](#3-cart--checkout)
4. [Payment Integrations](#4-payment-integrations)
5. [Shipping & Logistics](#5-shipping--logistics)
6. [Customer Portal](#6-customer-portal)
7. [Theme Engine](#7-theme-engine)
8. [Marketing & Promotions](#8-marketing--promotions)
9. [Content Management](#9-content-management)
10. [SEO & Performance](#10-seo--performance)

---

## 1. Webstore Overview

### 1.1 Webstore Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                         WEBSTORE ARCHITECTURE                                       │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   CUSTOMER JOURNEY                                                                  │
│   ────────────────                                                                  │
│                                                                                     │
│   ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐       │
│   │ BROWSE  │────►│  CART   │────►│CHECKOUT │────►│ PAYMENT │────►│ CONFIRM │       │
│   │         │     │         │     │         │     │         │     │         │       │
│   │ Products│     │ Review  │     │ Address │     │ Pay     │     │ Order   │       │
│   │ Search  │     │ Items   │     │ Shipping│     │ Gateway │     │ Placed  │       │
│   └─────────┘     └─────────┘     └─────────┘     └─────────┘     └─────────┘       │
│        │               │               │               │               │            │
│        └───────────────┴───────────────┴───────────────┴───────────────┘            │
│                                        │                                            │
│                                        ▼                                            │
│   ┌─────────────────────────────────────────────────────────────────────────┐       │
│   │                          ERP BACKEND                                    │       │
│   │                                                                         │       │
│   │   • Product Catalog (Real-time sync)                                    │       │
│   │   • Inventory Levels (Live availability)                                │       │
│   │   • Order Processing (Auto-create invoice)                              │       │
│   │   • Fulfillment (Courier integration)                                   │       │
│   │                                                                         │       │
│   └─────────────────────────────────────────────────────────────────────────┘       │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Feature Matrix

| Feature | Description | Availability |
|---------|-------------|--------------|
| **Product Catalog** | Browse products, categories, search | All Plans |
| **Shopping Cart** | Add/remove items, quantity updates | All Plans |
| **Guest Checkout** | Purchase without registration | All Plans |
| **Customer Accounts** | Registration, login, order history | All Plans |
| **Payment Gateways** | PayHere, WebXPay, Bank Transfer | All Plans |
| **Shipping Zones** | District-based delivery rates | All Plans |
| **Coupon Codes** | Discount promotions | Growth+ |
| **Wishlist** | Save items for later | Growth+ |
| **Custom Domain** | Use your own domain | Growth+ |
| **Theme Customization** | Custom colors, fonts | All Plans |
| **Premium Themes** | Professionally designed templates | Add-on |

---

## 2. Storefront Features

### 2.1 Product Catalog

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          PRODUCT CATALOG                                            │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   NAVIGATION                                PRODUCT CARD                            │
│   ──────────                                ────────────                            │
│   ┌─────────────────────┐                   ┌───────────────────────────┐           │
│   │ All Categories      │                   │   ┌───────────────────┐   │           │
│   │                     │                   │   │                   │   │           │
│   │ ├── Men's Clothing  │                   │   │     [PRODUCT      │   │           │
│   │ │   ├── T-Shirts    │                   │   │      IMAGE]       │   │           │
│   │ │   ├── Shirts      │                   │   │                   │   │           │
│   │ │   └── Pants       │                   │   └───────────────────┘   │           │
│   │ │                   │                   │                           │           │
│   │ ├── Women's Clothing│                   │   Premium Cotton T-Shirt  │           │
│   │ │   ├── Dresses     │                   │   ⭐⭐⭐⭐⭐ (12 reviews)    │           │
│   │ │   ├── Tops        │                   │                           │           │
│   │ │   └── Bottoms     │                   │   ̶L̶K̶R̶ ̶2̶,̶5̶0̶0̶  LKR 1,999   │           │
│   │ │                   │                   │   (Save 20%)              │           │
│   │ └── Accessories     │                   │                           │           │
│   │     ├── Bags        │                   │   [Add to Cart]           │           │
│   │     └── Jewelry     │                   │                           │           │
│   └─────────────────────┘                   └───────────────────────────┘           │
│                                                                                     │
│   FILTERS                                   SORT OPTIONS                            │
│   ───────                                   ────────────                            │
│   □ Price: LKR 0 - 5,000                   • Newest First               │           │
│   □ Size: S, M, L, XL                      • Price: Low to High         │           │
│   □ Color: Red, Blue, Black                • Price: High to Low         │           │
│   □ In Stock Only                          • Best Selling               │           │
│                                            • Top Rated                  │           │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Product Page Features

| Feature | Description |
|---------|-------------|
| **Image Gallery** | Multiple product images with zoom |
| **Variant Selection** | Size, color, and other options |
| **Stock Display** | Real-time availability indicator |
| **Price Display** | Regular price, sale price, savings |
| **Description** | Rich text product description |
| **Specifications** | Technical attributes table |
| **Reviews** | Customer ratings and reviews |
| **Related Products** | "You may also like" suggestions |
| **Share Buttons** | WhatsApp, Facebook sharing |

### 2.3 Smart Search (Sri Lanka Optimized)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          SMART SEARCH                                               │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   FEATURE: "Sinhala-glish" Fuzzy Search                                             │
│   ──────────────────────────────────────                                            │
│                                                                                     │
│   Sri Lankan customers often search using phonetic English spellings of             │
│   Sinhala words. Our search handles these variations:                               │
│                                                                                     │
│   ┌─────────────────────────────────────────────────────────────────────────┐       │
│   │   User Types          →   Matches Product                               │       │
│   │   ──────────              ────────────────                               │       │
│   │                                                                         │       │
│   │   "saree"             →   Saree, Sari, සාරිය                            │       │
│   │   "sari"              →   Saree, Sari, සාරිය                            │       │
│   │   "sariya"            →   Saree, Sari, සාරිය                            │       │
│   │                                                                         │       │
│   │   "tshirt"            →   T-Shirt, T-shirt, Tee                        │       │
│   │   "t shirt"           →   T-Shirt, T-shirt, Tee                        │       │
│   │   "tee"               →   T-Shirt, T-shirt, Tee                        │       │
│   │                                                                         │       │
│   │   "redmi note"        →   Xiaomi Redmi Note 12, Redmi Note 11          │       │
│   │   "note phone"        →   Xiaomi Redmi Note 12, Samsung Galaxy Note    │       │
│   │                                                                         │       │
│   └─────────────────────────────────────────────────────────────────────────┘       │
│                                                                                     │
│   IMPLEMENTATION: MeiliSearch with custom tokenizers and synonyms                   │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Cart & Checkout

### 3.1 Shopping Cart

| Feature | Description |
|---------|-------------|
| **Persistent Cart** | Cart saved across sessions |
| **Quantity Updates** | Inline quantity adjustment |
| **Stock Validation** | Real-time stock check |
| **Price Updates** | Live price recalculation |
| **Remove Items** | One-click item removal |
| **Clear Cart** | Empty entire cart |
| **Continue Shopping** | Easy return to browsing |

### 3.2 Checkout Flow

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          CHECKOUT FLOW                                              │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   STEP 1: ACCOUNT                                                                   │
│   ───────────────                                                                   │
│   ┌─────────────────────────────────────────────────────────────────────────┐       │
│   │                                                                         │       │
│   │   ○ Checkout as Guest                                                   │       │
│   │   ○ Login to Existing Account                                           │       │
│   │   ○ Create New Account                                                  │       │
│   │                                                                         │       │
│   │   [Continue]                                                            │       │
│   │                                                                         │       │
│   └─────────────────────────────────────────────────────────────────────────┘       │
│                                        │                                            │
│                                        ▼                                            │
│   STEP 2: SHIPPING ADDRESS (Sri Lanka Optimized)                                    │
│   ──────────────────────────────────────────────                                    │
│   ┌─────────────────────────────────────────────────────────────────────────┐       │
│   │                                                                         │       │
│   │   Name: [________________________]                                      │       │
│   │   Phone: [+94 ___________________]                                      │       │
│   │                                                                         │       │
│   │   Province: [▼ Western Province    ]                                    │       │
│   │   District: [▼ Colombo             ]                                    │       │
│   │   City:     [▼ Nugegoda            ]                                    │       │
│   │                                                                         │       │
│   │   Address Line 1: [__________________]                                  │       │
│   │   Address Line 2: [__________________]                                  │       │
│   │                                                                         │       │
│   │   OR  [📍 Pin Location on Map]                                          │       │
│   │                                                                         │       │
│   └─────────────────────────────────────────────────────────────────────────┘       │
│                                        │                                            │
│                                        ▼                                            │
│   STEP 3: SHIPPING METHOD                                                           │
│   ───────────────────────                                                           │
│   ┌─────────────────────────────────────────────────────────────────────────┐       │
│   │                                                                         │       │
│   │   ○ Standard Delivery (3-5 days)           LKR 350                      │       │
│   │   ○ Express Delivery (1-2 days)            LKR 650                      │       │
│   │   ○ Store Pickup (Free)                    LKR 0                        │       │
│   │                                                                         │       │
│   └─────────────────────────────────────────────────────────────────────────┘       │
│                                        │                                            │
│                                        ▼                                            │
│   STEP 4: PAYMENT                                                                   │
│   ───────────────                                                                   │
│   ┌─────────────────────────────────────────────────────────────────────────┐       │
│   │                                                                         │       │
│   │   ○ PayHere (Card/Wallet)                                               │       │
│   │   ○ WebXPay                                                             │       │
│   │   ○ KOKO (Buy Now, Pay Later)                                           │       │
│   │   ○ Bank Transfer (Upload Slip)                                         │       │
│   │   ○ Cash on Delivery (+LKR 100)                                         │       │
│   │                                                                         │       │
│   │   Coupon Code: [____________] [Apply]                                   │       │
│   │                                                                         │       │
│   └─────────────────────────────────────────────────────────────────────────┘       │
│                                        │                                            │
│                                        ▼                                            │
│   STEP 5: ORDER REVIEW & CONFIRM                                                    │
│   ──────────────────────────────                                                    │
│   ┌─────────────────────────────────────────────────────────────────────────┐       │
│   │                                                                         │       │
│   │   ORDER SUMMARY                                                         │       │
│   │   ─────────────                                                         │       │
│   │   T-Shirt (Red, M) × 2              LKR 3,998                          │       │
│   │   Jeans (Blue, 32) × 1              LKR 4,500                          │       │
│   │   ────────────────────────────────────────────                          │       │
│   │   Subtotal:                         LKR 8,498                          │       │
│   │   Shipping:                         LKR   350                          │       │
│   │   Discount (10% OFF):              -LKR   850                          │       │
│   │   ────────────────────────────────────────────                          │       │
│   │   TOTAL:                            LKR 7,998                          │       │
│   │                                                                         │       │
│   │   [Place Order]                                                         │       │
│   │                                                                         │       │
│   └─────────────────────────────────────────────────────────────────────────┘       │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Guest Checkout

| Advantage | Description |
|-----------|-------------|
| **Reduced Friction** | No account creation required |
| **Faster Conversion** | Complete purchase in minutes |
| **Email Receipt** | Order confirmation sent to email |
| **Order Tracking** | Track via order number + email |
| **Post-Purchase Signup** | Optional account creation after order |

---

## 4. Payment Integrations

### 4.1 Payment Gateway Matrix

| Gateway | Type | Fees | Settlement | Availability |
|---------|------|------|------------|--------------|
| **PayHere** | Cards, Wallets | 2.5% + LKR 5 | T+2 | All Plans |
| **WebXPay** | Cards | 2.7% | T+3 | All Plans |
| **KOKO** | BNPL | 3.5% | T+7 | Growth+ |
| **MintPay** | BNPL | 3.0% | T+5 | Growth+ |
| **Bank Transfer** | Manual | Free | Instant | All Plans |
| **Cash on Delivery** | COD | LKR 100/order | On delivery | All Plans |

### 4.2 Payment Flow

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          PAYMENT FLOW                                               │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   CARD PAYMENT (PayHere/WebXPay)                                                    │
│   ──────────────────────────────                                                    │
│   ┌───────────┐     ┌───────────┐     ┌───────────┐     ┌───────────┐               │
│   │  Checkout │────►│  Gateway  │────►│  Bank     │────►│  Confirm  │               │
│   │  Submit   │     │  Redirect │     │  Auth     │     │  Webhook  │               │
│   └───────────┘     └───────────┘     └───────────┘     └───────────┘               │
│                                                                                     │
│   BANK TRANSFER (Very Common in Sri Lanka)                                          │
│   ────────────────────────────────────────                                          │
│   ┌───────────┐     ┌───────────┐     ┌───────────┐     ┌───────────┐               │
│   │  Checkout │────►│  Show     │────►│  Customer │────►│  Admin    │               │
│   │  Select   │     │  Bank     │     │  Uploads  │     │  Verifies │               │
│   │  Bank Xfer│     │  Details  │     │  Slip     │     │  Payment  │               │
│   └───────────┘     └───────────┘     └───────────┘     └───────────┘               │
│                                                                                     │
│   ┌─────────────────────────────────────────────────────────────────────────┐       │
│   │   BANK TRANSFER DETAILS SHOWN TO CUSTOMER:                              │       │
│   │                                                                         │       │
│   │   Bank: Commercial Bank of Ceylon                                       │       │
│   │   Account Name: ABC Fashion (Pvt) Ltd                                   │       │
│   │   Account Number: 1234567890                                            │       │
│   │   Branch: Colombo                                                       │       │
│   │                                                                         │       │
│   │   Amount: LKR 7,998                                                     │       │
│   │   Reference: ORD-2024-0042                                              │       │
│   │                                                                         │       │
│   │   [Upload Payment Slip]    📷                                           │       │
│   │                                                                         │       │
│   └─────────────────────────────────────────────────────────────────────────┘       │
│                                                                                     │
│   CASH ON DELIVERY                                                                  │
│   ────────────────                                                                  │
│   ┌───────────┐     ┌───────────┐     ┌───────────┐     ┌───────────┐               │
│   │  Checkout │────►│  Order    │────►│  Courier  │────►│  Collect  │               │
│   │  Select   │     │  Created  │     │  Delivers │     │  Cash     │               │
│   │  COD      │     │  (Pending)│     │           │     │  (+Fee)   │               │
│   └───────────┘     └───────────┘     └───────────┘     └───────────┘               │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 4.3 BNPL (Buy Now, Pay Later) - KOKO/MintPay

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          BNPL FLOW (KOKO Example)                                   │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   ORDER TOTAL: LKR 12,000                                                           │
│                                                                                     │
│   ┌─────────────────────────────────────────────────────────────────────────┐       │
│   │                                                                         │       │
│   │   Pay with KOKO - Split into 3 payments                                 │       │
│   │                                                                         │       │
│   │   ┌───────────┐    ┌───────────┐    ┌───────────┐                       │       │
│   │   │   TODAY   │    │  30 DAYS  │    │  60 DAYS  │                       │       │
│   │   │           │    │           │    │           │                       │       │
│   │   │ LKR 4,000 │    │ LKR 4,000 │    │ LKR 4,000 │                       │       │
│   │   │           │    │           │    │           │                       │       │
│   │   └───────────┘    └───────────┘    └───────────┘                       │       │
│   │                                                                         │       │
│   │   ✓ 0% Interest    ✓ No Hidden Fees                                     │       │
│   │                                                                         │       │
│   └─────────────────────────────────────────────────────────────────────────┘       │
│                                                                                     │
│   BENEFIT: Increases average order value by 25-40%                                  │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Shipping & Logistics

### 5.1 Shipping Zone Configuration

| Zone | Coverage | Base Rate | Express Rate |
|------|----------|-----------|--------------|
| **Zone 1** | Colombo District | LKR 250 | LKR 450 |
| **Zone 2** | Western Province (excl. Colombo) | LKR 350 | LKR 600 |
| **Zone 3** | Southern, Central, Sabaragamuwa | LKR 400 | LKR 700 |
| **Zone 4** | North Western, North Central, Uva | LKR 450 | LKR 800 |
| **Zone 5** | Northern, Eastern | LKR 550 | LKR 950 |

### 5.2 Courier Integrations

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          COURIER INTEGRATION                                        │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   SUPPORTED COURIERS                                                                │
│   ──────────────────                                                                │
│   ┌─────────────────────────────────────────────────────────────────────────┐       │
│   │   Courier          Coverage        Features              API Support   │       │
│   │   ────────         ────────        ────────              ───────────   │       │
│   │   Koombiyo         Island-wide     COD, Next-day         ✅            │       │
│   │   Domex            Island-wide     COD, Tracking         ✅            │       │
│   │   Prompt X         Island-wide     Same-day (Colombo)    ✅            │       │
│   │   Trance Express   Island-wide     COD, Tracking         ⏳ Planned    │       │
│   │   Royal Express    Select areas    Budget option         ⏳ Planned    │       │
│   └─────────────────────────────────────────────────────────────────────────┘       │
│                                                                                     │
│   WAYBILL GENERATION                                                                │
│   ──────────────────                                                                │
│   ┌─────────────────────────────────────────────────────────────────────────┐       │
│   │                                                                         │       │
│   │   Order #ORD-2024-0042                         [Generate Waybill]       │       │
│   │                                                                         │       │
│   │   ┌─────────────────────────────────────────────────────────────────┐   │       │
│   │   │                    WAYBILL                                      │   │       │
│   │   │                                                                 │   │       │
│   │   │   Tracking: KMB12345678                                         │   │       │
│   │   │                                                                 │   │       │
│   │   │   FROM:                     TO:                                 │   │       │
│   │   │   ABC Fashion               Kamal Perera                        │   │       │
│   │   │   45 Galle Rd               123 Main St                         │   │       │
│   │   │   Colombo 03                Nugegoda                            │   │       │
│   │   │                             +94 77 123 4567                     │   │       │
│   │   │                                                                 │   │       │
│   │   │   Items: 3    COD: LKR 7,998                                    │   │       │
│   │   │                                                                 │   │       │
│   │   │   ████████████████████████                                      │   │       │
│   │   │   (Barcode)                                                     │   │       │
│   │   │                                                                 │   │       │
│   │   └─────────────────────────────────────────────────────────────────┘   │       │
│   │                                                                         │       │
│   │   [🖨️ Print A6]  [📋 Copy Tracking]  [💬 Send to Customer]             │       │
│   │                                                                         │       │
│   └─────────────────────────────────────────────────────────────────────────┘       │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 5.3 Order Tracking

| Status | Description | Notification |
|--------|-------------|--------------|
| **Pending** | Order placed, awaiting payment | Email |
| **Confirmed** | Payment verified | Email + WhatsApp |
| **Processing** | Being packed | - |
| **Shipped** | Handed to courier | WhatsApp with tracking |
| **Out for Delivery** | Courier en-route | WhatsApp |
| **Delivered** | Successfully delivered | Email (review request) |
| **Failed Delivery** | Delivery attempted | WhatsApp + Call |

---

## 6. Customer Portal

### 6.1 Portal Features

| Feature | Description |
|---------|-------------|
| **Dashboard** | Order overview, recent activity |
| **Order History** | Complete list of past orders |
| **Order Tracking** | Real-time shipment tracking |
| **Addresses** | Saved shipping addresses |
| **Wishlist** | Saved products for later |
| **Account Settings** | Profile, password, preferences |
| **Notifications** | Order updates preference |

### 6.2 Customer Dashboard

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          MY ACCOUNT                                                 │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   Welcome, Kamal! 👋                                                                │
│                                                                                     │
│   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                     │
│   │   📦 Orders     │  │   ❤️ Wishlist   │  │   🏠 Addresses  │                     │
│   │   12 Total      │  │   5 Items       │  │   2 Saved       │                     │
│   └─────────────────┘  └─────────────────┘  └─────────────────┘                     │
│                                                                                     │
│   RECENT ORDERS                                                                     │
│   ─────────────                                                                     │
│   ┌─────────────────────────────────────────────────────────────────────────┐       │
│   │   Order #ORD-2024-0042        Jan 15, 2024                              │       │
│   │   3 items                     LKR 7,998                                 │       │
│   │   Status: 🚚 Out for Delivery                                           │       │
│   │                                                                         │       │
│   │   [Track Order]  [View Details]                                         │       │
│   └─────────────────────────────────────────────────────────────────────────┘       │
│                                                                                     │
│   ┌─────────────────────────────────────────────────────────────────────────┐       │
│   │   Order #ORD-2024-0038        Jan 10, 2024                              │       │
│   │   1 item                      LKR 4,500                                 │       │
│   │   Status: ✅ Delivered                                                  │       │
│   │                                                                         │       │
│   │   [Leave Review]  [Reorder]  [View Details]                             │       │
│   └─────────────────────────────────────────────────────────────────────────┘       │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Theme Engine

### 7.1 Customization Options

| Element | Customizable | Method |
|---------|--------------|--------|
| **Primary Color** | ✅ | Color picker in ERP |
| **Secondary Color** | ✅ | Color picker |
| **Font Family** | ✅ | Google Fonts selection |
| **Border Radius** | ✅ | Slider (0-20px) |
| **Logo** | ✅ | Upload image |
| **Favicon** | ✅ | Upload image |
| **Banner Images** | ✅ | Upload carousel images |
| **Layout** | Limited | Pre-built templates |
| **Custom CSS** | Enterprise | Custom code injection |

### 7.2 Theme Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          THEME ENGINE                                               │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   ERP SETTINGS                                                                      │
│   ────────────                                                                      │
│   ┌─────────────────────────────────────────────────────────────────────────┐       │
│   │   Theme Settings                                                        │       │
│   │                                                                         │       │
│   │   Primary Color:   [#2563eb] ■                                          │       │
│   │   Secondary Color: [#1e40af] ■                                          │       │
│   │   Font:           [▼ Inter           ]                                  │       │
│   │   Border Radius:  [──────●───] 8px                                      │       │
│   │                                                                         │       │
│   │   [Save & Preview]                                                      │       │
│   │                                                                         │       │
│   └─────────────────────────────────────────────────────────────────────────┘       │
│                                        │                                            │
│                                        ▼                                            │
│   DATABASE (JSON Config)                                                            │
│   ──────────────────────                                                            │
│   {                                                                                 │
│     "primary_color": "#2563eb",                                                     │
│     "secondary_color": "#1e40af",                                                   │
│     "font_family": "Inter",                                                         │
│     "border_radius": "8px"                                                          │
│   }                                                                                 │
│                                        │                                            │
│                                        ▼                                            │
│   WEBSTORE (CSS Variables)                                                          │
│   ────────────────────────                                                          │
│   :root {                                                                           │
│     --color-primary: #2563eb;                                                       │
│     --color-secondary: #1e40af;                                                     │
│     --font-family: 'Inter', sans-serif;                                             │
│     --border-radius: 8px;                                                           │
│   }                                                                                 │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Marketing & Promotions

### 8.1 Promotion Types

| Type | Description | Example |
|------|-------------|---------|
| **Percentage Discount** | % off order/product | 20% OFF |
| **Fixed Amount** | LKR off order | LKR 500 OFF |
| **Free Shipping** | Waive shipping fees | Free delivery |
| **BOGO** | Buy One Get One | Buy 2, Get 1 Free |
| **Flash Sale** | Time-limited discount | 50% OFF for 24hrs |
| **Minimum Purchase** | Discount on spending | LKR 300 OFF on 5000+ |

### 8.2 Coupon Configuration

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          COUPON CREATION                                            │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   CREATE NEW COUPON                                                                 │
│   ─────────────────                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────────┐       │
│   │                                                                         │       │
│   │   Code:            [NEWYEAR2024_____]                                   │       │
│   │   Type:            [▼ Percentage Discount]                               │       │
│   │   Value:           [15] %                                               │       │
│   │                                                                         │       │
│   │   CONDITIONS                                                            │       │
│   │   ──────────                                                            │       │
│   │   Minimum Order:   [LKR 3000_________]                                  │       │
│   │   Maximum Uses:    [100______________]                                   │       │
│   │   Per Customer:    [1________________]                                   │       │
│   │                                                                         │       │
│   │   VALIDITY                                                              │       │
│   │   ────────                                                              │       │
│   │   Start Date:      [2024-01-01]                                         │       │
│   │   End Date:        [2024-01-31]                                         │       │
│   │                                                                         │       │
│   │   RESTRICTIONS                                                          │       │
│   │   ────────────                                                          │       │
│   │   □ Specific Categories: [Select...]                                    │       │
│   │   □ Specific Products: [Select...]                                      │       │
│   │   □ First-time customers only                                           │       │
│   │                                                                         │       │
│   │   [Create Coupon]                                                       │       │
│   │                                                                         │       │
│   └─────────────────────────────────────────────────────────────────────────┘       │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 8.3 WhatsApp Chat Widget

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          WHATSAPP INTEGRATION                                       │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   FLOATING WIDGET (Bottom-Right of Store)                                           │
│   ───────────────────────────────────────                                           │
│                                                                                     │
│                                            ┌─────────────────────────┐              │
│                                            │  💬 Chat with us!       │              │
│                                            │                         │              │
│                                            │  Hi! How can we help?   │              │
│                                            │                         │              │
│                                            │  [Type a message...]    │              │
│                                            │                         │              │
│                                            │  Powered by WhatsApp    │              │
│                                            └─────────────────────────┘              │
│                                                            │                        │
│                                                     [WhatsApp Icon]                 │
│                                                                                     │
│   CONFIGURATION (ERP Settings)                                                      │
│   ────────────────────────────                                                      │
│   WhatsApp Number: +94 77 123 4567                                                  │
│   Default Message: "Hi! I have a question about..."                                 │
│   Working Hours: 9:00 AM - 6:00 PM                                                  │
│   Away Message: "We're currently away. Leave a message!"                            │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Content Management

### 9.1 CMS Features

| Feature | Description |
|---------|-------------|
| **Blog Posts** | Create and publish articles |
| **Static Pages** | About, Contact, FAQ, etc. |
| **Rich Editor** | WYSIWYG content editing |
| **Image Upload** | Inline images with optimization |
| **SEO Settings** | Title, description, keywords |
| **Categories/Tags** | Blog post organization |
| **Author Management** | Multiple content authors |

### 9.2 Static Pages

| Page | Purpose | Customizable |
|------|---------|--------------|
| **Home** | Landing page with banners | Full |
| **About Us** | Company information | Full |
| **Contact** | Contact form and info | Full |
| **FAQ** | Frequently asked questions | Full |
| **Shipping Policy** | Delivery information | Full |
| **Return Policy** | Returns and refunds | Full |
| **Privacy Policy** | Data handling practices | Template |
| **Terms of Service** | Legal terms | Template |

---

## 10. SEO & Performance

### 10.1 SEO Features

| Feature | Description |
|---------|-------------|
| **Meta Tags** | Title, description per page |
| **Canonical URLs** | Prevent duplicate content |
| **Structured Data** | Product, Organization schema |
| **Sitemap** | Auto-generated XML sitemap |
| **Robots.txt** | Search engine directives |
| **Open Graph** | Social sharing optimization |
| **Alt Text** | Image accessibility |

### 10.2 Performance Optimizations

| Optimization | Implementation |
|--------------|----------------|
| **Image Compression** | Auto WebP conversion, lazy loading |
| **CDN** | Static assets served via CloudFlare |
| **Caching** | Redis cache for API responses |
| **SSR** | Server-side rendering for SEO pages |
| **Code Splitting** | Dynamic imports for faster load |
| **Minification** | CSS/JS minification in production |

---

## Summary

The LankaCommerce Cloud Webstore provides a complete e-commerce solution optimized for Sri Lankan customers and businesses:

- **Sri Lanka-First Design**: District-based shipping, local payments, WhatsApp integration
- **Multiple Payment Options**: Cards, BNPL, bank transfer uploads, COD
- **Seamless ERP Integration**: Real-time inventory sync, auto-invoicing
- **Customizable Themes**: Brand-aligned storefronts with the Theme Engine
- **Marketing Tools**: Coupons, promotions, WhatsApp chat
- **SEO-Optimized**: Built for search engine visibility

---

*This document is Part 4 of 5 in the LankaCommerce Cloud comprehensive documentation series.*

| Document | Title |
|----------|-------|
| 📄 Document 1 | Executive Overview & Business Strategy |
| 📄 Document 2 | Technical Architecture & Infrastructure |
| 📄 Document 3 | ERP Module Features & Specifications |
| **📄 This Document** | Webstore & E-Commerce Platform |
| 📄 Document 5 | AI Integration & Future Roadmap |
