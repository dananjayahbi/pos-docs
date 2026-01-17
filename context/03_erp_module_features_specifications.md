# LankaCommerce Cloud (LCC) - ERP Module Features & Specifications

> **Comprehensive Business Management for Sri Lankan SMEs**

---

## Table of Contents

1. [ERP Overview](#1-erp-overview)
2. [Product Management](#2-product-management)
3. [Inventory Management](#3-inventory-management)
4. [Point of Sale (POS)](#4-point-of-sale-pos)
5. [Sales & Invoicing](#5-sales--invoicing)
6. [Customer Management](#6-customer-management)
7. [Vendor Management](#7-vendor-management)
8. [HR & Payroll](#8-hr--payroll)
9. [Accounting](#9-accounting)
10. [Reporting & Analytics](#10-reporting--analytics)

---

## 1. ERP Overview

### 1.1 Module Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           ERP MODULE ECOSYSTEM                                      │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   ┌─────────────────────────────────────────────────────────────────────────┐       │
│   │                        CORE MODULES                                     │       │
│   │                                                                         │       │
│   │   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                 │       │
│   │   │   Products   │  │  Inventory   │  │     POS      │                 │       │
│   │   │              │◄─┼──────────────┼──►│              │                 │       │
│   │   │  • Catalog   │  │  • Stock     │  │  • Terminal  │                 │       │
│   │   │  • Variants  │  │  • Warehouse │  │  • Receipts  │                 │       │
│   │   │  • Pricing   │  │  • Transfers │  │  • Offline   │                 │       │
│   │   └──────────────┘  └──────────────┘  └──────────────┘                 │       │
│   │          │                  │                  │                        │       │
│   │          └──────────────────┼──────────────────┘                        │       │
│   │                             ▼                                           │       │
│   │                    ┌──────────────┐                                     │       │
│   │                    │    Sales     │                                     │       │
│   │                    │              │                                     │       │
│   │                    │  • Invoices  │                                     │       │
│   │                    │  • Quotes    │                                     │       │
│   │                    │  • Orders    │                                     │       │
│   │                    └──────────────┘                                     │       │
│   │                             │                                           │       │
│   └─────────────────────────────┼───────────────────────────────────────────┘       │
│                                 ▼                                                   │
│   ┌─────────────────────────────────────────────────────────────────────────┐       │
│   │                      SUPPORTING MODULES                                 │       │
│   │                                                                         │       │
│   │   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                 │       │
│   │   │  Customers   │  │   Vendors    │  │  Accounting  │                 │       │
│   │   │              │  │              │  │              │                 │       │
│   │   │  • Database  │  │  • Suppliers │  │  • Ledger    │                 │       │
│   │   │  • History   │  │  • PO        │  │  • Reports   │                 │       │
│   │   │  • Credit    │  │  • Bills     │  │  • Tax       │                 │       │
│   │   └──────────────┘  └──────────────┘  └──────────────┘                 │       │
│   │                                                                         │       │
│   │   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                 │       │
│   │   │  HR/Payroll  │  │   Projects   │  │   Reports    │                 │       │
│   │   │              │  │              │  │              │                 │       │
│   │   │  • Staff     │  │  • Tasks     │  │  • Sales     │                 │       │
│   │   │  • Salary    │  │  • Tracking  │  │  • Inventory │                 │       │
│   │   │  • Leave     │  │  • Billing   │  │  • Financial │                 │       │
│   │   └──────────────┘  └──────────────┘  └──────────────┘                 │       │
│   │                                                                         │       │
│   └─────────────────────────────────────────────────────────────────────────┘       │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Feature Matrix by Plan

| Module | 🌱 Starter | 🚀 Growth | 🏢 Enterprise |
|--------|-----------|----------|--------------|
| **Products** | 100 limit | Unlimited | Unlimited |
| **Inventory** | Basic | Advanced + Bundles | Multi-Warehouse |
| **POS** | Basic | Advanced | Full + Offline |
| **Sales** | Invoices only | + Quotes | Full Suite |
| **Customers** | Basic | + Credit Limits | + Segmentation |
| **Vendors** | ❌ | Basic | Full |
| **HR/Payroll** | ❌ | ✅ | ✅ |
| **Accounting** | ❌ | ✅ | Full + API |
| **Reports** | Basic | Standard | Custom + Export |

---

## 2. Product Management

### 2.1 Product Features

| Feature | Description | Availability |
|---------|-------------|--------------|
| **Basic Info** | Name, SKU, barcode, description | All Plans |
| **Categories** | Hierarchical product categorization | All Plans |
| **Variants** | Size, color, material combinations | All Plans |
| **Attributes** | Custom flexible attributes (JSONB) | All Plans |
| **Images** | Multiple images with auto-optimization | All Plans |
| **Pricing** | Base price, sale price, cost price | All Plans |
| **Bundles** | Composite products (e.g., gift hampers) | Growth+ |
| **Composite Items** | Manufacturing recipes | Enterprise |

### 2.2 Product Types

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           PRODUCT TYPES                                             │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   TYPE 1: SIMPLE PRODUCT                                                            │
│   ──────────────────────                                                            │
│   Single item with no variations                                                    │
│   Example: "USB Cable", "Notebook"                                                  │
│                                                                                     │
│   TYPE 2: VARIABLE PRODUCT                                                          │
│   ─────────────────────────                                                         │
│   Product with multiple variants                                                    │
│   Example: "T-Shirt" → Size (S,M,L,XL) × Color (Red,Blue,Black)                     │
│                                                                                     │
│   ┌─────────────────────────────────────────────────────────────────────┐           │
│   │   T-Shirt (Parent)                                                  │           │
│   │   ├── T-Shirt - S - Red    [SKU: TS-S-RED]   Stock: 10             │           │
│   │   ├── T-Shirt - S - Blue   [SKU: TS-S-BLU]   Stock: 8              │           │
│   │   ├── T-Shirt - M - Red    [SKU: TS-M-RED]   Stock: 15             │           │
│   │   └── ...                                                          │           │
│   └─────────────────────────────────────────────────────────────────────┘           │
│                                                                                     │
│   TYPE 3: BUNDLE (Growth+ Plans)                                                    │
│   ──────────────────────────────                                                    │
│   Pre-packaged collection of products                                               │
│   Example: "Avurudu Gift Hamper"                                                    │
│                                                                                     │
│   ┌─────────────────────────────────────────────────────────────────────┐           │
│   │   Avurudu Gift Hamper [1 Bundle] =                                  │           │
│   │   ├── Cocoa Biscuits × 2                                           │           │
│   │   ├── Ceylon Tea Box × 1                                           │           │
│   │   ├── Chocolate Box × 1                                            │           │
│   │   └── Gift Wrapping × 1                                            │           │
│   │                                                                     │           │
│   │   When sold: All 5 items auto-deducted from inventory              │           │
│   └─────────────────────────────────────────────────────────────────────┘           │
│                                                                                     │
│   TYPE 4: COMPOSITE (Enterprise)                                                    │
│   ──────────────────────────────                                                    │
│   Manufacturing/recipe-based products                                               │
│   Example: "Chocolate Cake" (Bakery)                                                │
│                                                                                     │
│   ┌─────────────────────────────────────────────────────────────────────┐           │
│   │   Chocolate Cake [1 unit] requires:                                 │           │
│   │   ├── Flour: 500g                                                  │           │
│   │   ├── Cocoa Powder: 100g                                           │           │
│   │   ├── Sugar: 300g                                                  │           │
│   │   ├── Eggs: 4 units                                                │           │
│   │   └── Butter: 200g                                                 │           │
│   │                                                                     │           │
│   │   When produced: Ingredients auto-deducted, cake added to stock    │           │
│   └─────────────────────────────────────────────────────────────────────┘           │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Inventory Management

### 3.1 Inventory Features

| Feature | Description |
|---------|-------------|
| **Stock Levels** | Real-time quantity tracking per product/variant |
| **Warehouses** | Multiple location support (Enterprise) |
| **Stock Transfers** | Move inventory between warehouses |
| **Low-Stock Alerts** | Configurable threshold notifications |
| **Stock Adjustments** | Manual corrections with reason tracking |
| **Stock History** | Complete audit trail of all changes |
| **Batch Tracking** | Lot numbers and expiry dates |

### 3.2 Inventory Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                         INVENTORY FLOW                                              │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   INBOUND                          STOCK                         OUTBOUND          │
│   ───────                          ─────                         ────────          │
│                                                                                     │
│   ┌──────────────┐            ┌──────────────┐            ┌──────────────┐         │
│   │   Purchase   │───────────►│              │───────────►│   POS Sale   │         │
│   │   Order      │    +Qty    │              │    -Qty    │              │         │
│   └──────────────┘            │              │            └──────────────┘         │
│                               │              │                                      │
│   ┌──────────────┐            │   INVENTORY  │            ┌──────────────┐         │
│   │   Stock      │───────────►│   LEDGER     │───────────►│   Webstore   │         │
│   │   Adjustment │   ±Qty    │              │    -Qty    │   Order      │         │
│   └──────────────┘            │              │            └──────────────┘         │
│                               │              │                                      │
│   ┌──────────────┐            │              │            ┌──────────────┐         │
│   │   Transfer   │◄──────────►│              │───────────►│   Damage/    │         │
│   │   In         │   Move     │              │    -Qty    │   Write-off  │         │
│   └──────────────┘            └──────────────┘            └──────────────┘         │
│                                      │                                              │
│                                      ▼                                              │
│                            ┌──────────────────┐                                     │
│                            │  Stock Reports   │                                     │
│                            │  • Current Stock │                                     │
│                            │  • Movement Log  │                                     │
│                            │  • Valuation     │                                     │
│                            └──────────────────┘                                     │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Low-Stock Alert Configuration

| Setting | Description | Default |
|---------|-------------|---------|
| **Threshold Level** | Qty below which alert triggers | 10 units |
| **Alert Method** | Email, Dashboard, WhatsApp | Dashboard |
| **Auto-Reorder** | Automatically create PO when low | Disabled |
| **Reorder Quantity** | Default quantity for auto-reorder | 50 units |

---

## 4. Point of Sale (POS)

### 4.1 POS Features

| Feature | Description | Availability |
|---------|-------------|--------------|
| **Quick Sale** | Barcode scanning, product search | All Plans |
| **Multiple Payment Methods** | Cash, Card, Split payments | All Plans |
| **Receipt Printing** | Thermal printer support (58mm, 80mm) | All Plans |
| **Hold Orders** | Park and retrieve orders | All Plans |
| **Discounts** | Percentage, fixed amount, per-item | All Plans |
| **Customer Assignment** | Link sale to customer profile | All Plans |
| **Offline Mode** | Works without internet (syncs later) | Growth+ |
| **Dual Screen** | Customer-facing display | Enterprise |
| **Multi-Terminal** | Multiple POS stations | Enterprise |

### 4.2 POS Workflow

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              POS WORKFLOW                                           │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   ┌─────────────────────────────────────────────────────────────────────────┐       │
│   │                         POS TERMINAL                                    │       │
│   │                                                                         │       │
│   │   1. ADD ITEMS                    2. APPLY DISCOUNTS                   │       │
│   │   ───────────                     ─────────────────                    │       │
│   │   • Scan Barcode                  • Coupon Code                        │       │
│   │   • Search by Name/SKU            • Manual Discount                    │       │
│   │   • Browse Categories             • Staff Discount                     │       │
│   │                                                                         │       │
│   │   3. SELECT CUSTOMER              4. PAYMENT                           │       │
│   │   ──────────────────              ───────                              │       │
│   │   • Walk-in (Anonymous)           • Cash                               │       │
│   │   • Existing Customer             • Card (Terminal)                    │       │
│   │   • New Customer                  • Split Payment                      │       │
│   │                                   • Store Credit                       │       │
│   │                                                                         │       │
│   └─────────────────────────────────────────────────────────────────────────┘       │
│                                        │                                            │
│                                        ▼                                            │
│   ┌─────────────────────────────────────────────────────────────────────────┐       │
│   │                      POST-SALE ACTIONS                                  │       │
│   │                                                                         │       │
│   │   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                 │       │
│   │   │   Print      │  │   Update     │  │   Send       │                 │       │
│   │   │   Receipt    │  │   Inventory  │  │   Receipt    │                 │       │
│   │   │              │  │   (-Qty)     │  │   (Email/    │                 │       │
│   │   │              │  │              │  │   WhatsApp)  │                 │       │
│   │   └──────────────┘  └──────────────┘  └──────────────┘                 │       │
│   │                                                                         │       │
│   └─────────────────────────────────────────────────────────────────────────┘       │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 4.3 Offline Mode (Critical for Sri Lanka)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                         OFFLINE MODE ARCHITECTURE                                   │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   ONLINE MODE                                                                       │
│   ───────────                                                                       │
│   ┌─────────────┐          ┌─────────────┐          ┌─────────────┐                 │
│   │  POS App    │◄────────►│   Server    │◄────────►│  Database   │                 │
│   │  (Browser)  │   API    │   (Django)  │          │ (PostgreSQL)│                 │
│   └─────────────┘          └─────────────┘          └─────────────┘                 │
│                                                                                     │
│   OFFLINE MODE (When Internet Fails)                                                │
│   ──────────────────────────────────                                                │
│   ┌─────────────────────────────────────────────────────────────────────────┐       │
│   │                        POS APP (Browser)                                │       │
│   │                                                                         │       │
│   │   ┌───────────────────┐          ┌───────────────────┐                 │       │
│   │   │   IndexedDB       │          │   Service Worker  │                 │       │
│   │   │   (Local Store)   │          │   (Offline Ready) │                 │       │
│   │   │                   │          │                   │                 │       │
│   │   │   • Products      │          │   • Cache Assets  │                 │       │
│   │   │   • Pending Sales │          │   • Queue Requests│                 │       │
│   │   │   • Customers     │          │   • Sync on Wake  │                 │       │
│   │   └───────────────────┘          └───────────────────┘                 │       │
│   │                                                                         │       │
│   └─────────────────────────────────────────────────────────────────────────┘       │
│                                        │                                            │
│                                        │ Internet Returns                           │
│                                        ▼                                            │
│   ┌─────────────────────────────────────────────────────────────────────────┐       │
│   │                        SYNC PROCESS                                     │       │
│   │                                                                         │       │
│   │   1. Upload pending sales to server                                     │       │
│   │   2. Handle conflicts (last-write-wins or flag for review)              │       │
│   │   3. Download updated product/inventory data                            │       │
│   │   4. Clear local pending queue                                          │       │
│   │                                                                         │       │
│   └─────────────────────────────────────────────────────────────────────────┘       │
│                                                                                     │
│   CONFLICT RESOLUTION STRATEGY                                                      │
│   ────────────────────────────                                                      │
│   Scenario: Two devices sell the "last item" while offline                          │
│                                                                                     │
│   Option A: "First to Sync Wins" - Second sale marked as backorder                  │
│   Option B: "Flag for Review" - Both sales flagged for manual review                │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Sales & Invoicing

### 5.1 Sales Document Types

| Document | Purpose | Generated From |
|----------|---------|----------------|
| **Quote** | Price proposal to customer | Manual creation |
| **Invoice** | Bill for goods/services sold | POS, Webstore, Manual |
| **Receipt** | Proof of payment | POS terminal |
| **Credit Note** | Refund or return document | From Invoice |
| **Delivery Note** | Shipping document | From Invoice |

### 5.2 Invoice Features

| Feature | Description |
|---------|-------------|
| **SVAT/VAT Compliance** | Sri Lanka tax-compliant invoices |
| **Custom Numbering** | Configurable invoice number format |
| **Multiple Taxes** | Support for different tax rates |
| **Payment Terms** | Net 15, Net 30, COD, etc. |
| **Partial Payments** | Track multiple payments per invoice |
| **PDF Generation** | Professional PDF download |
| **Email/WhatsApp** | One-click send to customer |

### 5.3 Social Selling Tools (Critical for Sri Lanka)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                    SOCIAL SELLING WORKFLOW                                          │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   Many Sri Lankan businesses receive orders via WhatsApp/Facebook.                  │
│   This workflow enables converting social orders into tracked sales.                │
│                                                                                     │
│   ┌─────────────────────────────────────────────────────────────────────────┐       │
│   │   STEP 1: Customer contacts via WhatsApp                                │       │
│   │   "Hi, I want to order 2x Red T-Shirts (Size M)"                        │       │
│   └────────────────────────────────┬────────────────────────────────────────┘       │
│                                    ▼                                                │
│   ┌─────────────────────────────────────────────────────────────────────────┐       │
│   │   STEP 2: Shop Admin creates Draft Order in ERP                         │       │
│   │   • Customer: [Select/Create]                                           │       │
│   │   • Products: Red T-Shirt (M) × 2                                       │       │
│   │   • Shipping: Colombo District                                          │       │
│   │   • Payment: Pending                                                    │       │
│   └────────────────────────────────┬────────────────────────────────────────┘       │
│                                    ▼                                                │
│   ┌─────────────────────────────────────────────────────────────────────────┐       │
│   │   STEP 3: Generate Payment Link                                         │       │
│   │   https://pay.mystore.lk/order/abc123                                   │       │
│   │   Order: ORD-2024-0042 | Amount: LKR 3,500                              │       │
│   └────────────────────────────────┬────────────────────────────────────────┘       │
│                                    ▼                                                │
│   ┌─────────────────────────────────────────────────────────────────────────┐       │
│   │   STEP 4: Send Payment Link via WhatsApp                                │       │
│   │   "Here's your order! Pay here: [Link]"                                 │       │
│   └────────────────────────────────┬────────────────────────────────────────┘       │
│                                    ▼                                                │
│   ┌─────────────────────────────────────────────────────────────────────────┐       │
│   │   STEP 5: Customer Pays → Order Auto-Confirmed                          │       │
│   │   → Inventory Deducted                                                  │       │
│   │   → Invoice Generated                                                   │       │
│   │   → Fulfillment Triggered                                               │       │
│   └─────────────────────────────────────────────────────────────────────────┘       │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Customer Management

### 6.1 Customer Features

| Feature | Description |
|---------|-------------|
| **Customer Database** | Centralized customer information |
| **Purchase History** | Complete order/invoice history |
| **Contact Info** | Phone, email, address (district-based) |
| **Notes** | Internal notes and tags |
| **Credit Limits** | Set spending limits per customer (Growth+) |
| **Customer Groups** | Segmentation for pricing/promotions (Enterprise) |
| **Loyalty Points** | Points-based rewards system (Enterprise) |

### 6.2 Customer Data Model

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                        CUSTOMER PROFILE                                             │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   BASIC INFO                          ADDRESSES                                     │
│   ──────────                          ─────────                                     │
│   Name: Kamal Perera                  Billing:                                      │
│   Phone: +94 77 123 4567              • 45/2, Galle Road                           │
│   Email: kamal@email.com              • Colombo 03                                  │
│   Customer Since: 2023-01-15          • Western Province                            │
│                                                                                     │
│   PURCHASE STATS                      Shipping: (Same / Different)                  │
│   ──────────────                      • 123, Main Street                            │
│   Total Orders: 15                    • Nugegoda                                    │
│   Total Spent: LKR 78,500             • Western Province                            │
│   Avg Order Value: LKR 5,233                                                        │
│   Last Order: 2024-01-10                                                            │
│                                                                                     │
│   CREDIT (Growth+)                    NOTES                                         │
│   ────────────────                    ─────                                         │
│   Credit Limit: LKR 50,000            "Prefers bank transfer payments"              │
│   Credit Used: LKR 12,500             "VIP customer - priority shipping"            │
│   Available: LKR 37,500                                                             │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Vendor Management

### 7.1 Vendor Features (Growth+ Plans)

| Feature | Description |
|---------|-------------|
| **Vendor Directory** | Supplier database with contact info |
| **Purchase Orders** | Create and track POs |
| **Bills** | Record supplier invoices |
| **Payment Tracking** | Track amounts owed to vendors |
| **Product Sourcing** | Link products to preferred vendors |

### 7.2 Purchase Order Workflow

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                      PURCHASE ORDER WORKFLOW                                        │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   ┌───────────────┐      ┌───────────────┐      ┌───────────────┐                   │
│   │    DRAFT      │─────►│    SENT       │─────►│   RECEIVED    │                   │
│   │               │      │               │      │               │                   │
│   │  Create PO    │      │  Email to     │      │  Mark items   │                   │
│   │  Add items    │      │  vendor       │      │  as received  │                   │
│   └───────────────┘      └───────────────┘      └───────────────┘                   │
│                                                           │                         │
│                                                           ▼                         │
│                          ┌───────────────┐      ┌───────────────┐                   │
│                          │    BILLED     │◄─────│   PARTIAL     │                   │
│                          │               │      │   RECEIVED    │                   │
│                          │  Vendor bill  │      │               │                   │
│                          │  recorded     │      │  Some items   │                   │
│                          └───────────────┘      │  received     │                   │
│                                                 └───────────────┘                   │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. HR & Payroll

### 8.1 HR Features (Growth+ Plans)

| Feature | Description |
|---------|-------------|
| **Employee Directory** | Staff profiles with contact info |
| **Departments** | Organizational structure |
| **Attendance** | Clock in/out tracking |
| **Leave Management** | Leave requests and approvals |
| **Payroll** | Salary calculation and payslips |
| **EPF/ETF** | Sri Lanka statutory deductions |

### 8.2 Payroll Calculation

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                        PAYROLL CALCULATION                                          │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   EMPLOYEE: Nimal Jayasinghe           PERIOD: January 2024                         │
│                                                                                     │
│   EARNINGS                             DEDUCTIONS                                   │
│   ────────                             ──────────                                   │
│   Basic Salary:     LKR 75,000         EPF (Employee 8%):  LKR 6,000               │
│   Allowances:       LKR 10,000         ETF (Employer 3%):  LKR 2,250               │
│   Overtime:         LKR  5,000         PAYE Tax:           LKR 2,500               │
│   Commission:       LKR  8,000         Advance:            LKR 5,000               │
│   ─────────────────────────────        ─────────────────────────────               │
│   Gross:            LKR 98,000         Total Deductions:   LKR 15,750              │
│                                                                                     │
│   NET PAY:          LKR 82,250                                                      │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Accounting

### 9.1 Accounting Features (Growth+ Plans)

| Feature | Description |
|---------|-------------|
| **Chart of Accounts** | Customizable account structure |
| **Journal Entries** | Manual accounting entries |
| **General Ledger** | Complete transaction history |
| **Accounts Receivable** | Customer balances and aging |
| **Accounts Payable** | Vendor balances and aging |
| **Bank Reconciliation** | Match transactions with statements |
| **Financial Reports** | P&L, Balance Sheet, Cash Flow |

### 9.2 Chart of Accounts Structure

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                      CHART OF ACCOUNTS                                              │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   1000 - ASSETS                                                                     │
│   ├── 1100 - Current Assets                                                         │
│   │   ├── 1110 - Cash on Hand                                                       │
│   │   ├── 1120 - Bank Accounts                                                      │
│   │   ├── 1130 - Accounts Receivable                                                │
│   │   └── 1140 - Inventory                                                          │
│   └── 1200 - Fixed Assets                                                           │
│       ├── 1210 - Equipment                                                          │
│       └── 1220 - Vehicles                                                           │
│                                                                                     │
│   2000 - LIABILITIES                                                                │
│   ├── 2100 - Current Liabilities                                                    │
│   │   ├── 2110 - Accounts Payable                                                   │
│   │   ├── 2120 - VAT Payable                                                        │
│   │   └── 2130 - Salaries Payable                                                   │
│   └── 2200 - Long-Term Liabilities                                                  │
│       └── 2210 - Loans Payable                                                      │
│                                                                                     │
│   3000 - EQUITY                                                                     │
│   ├── 3100 - Owner's Capital                                                        │
│   └── 3200 - Retained Earnings                                                      │
│                                                                                     │
│   4000 - REVENUE                                                                    │
│   ├── 4100 - Sales Revenue                                                          │
│   ├── 4200 - Service Revenue                                                        │
│   └── 4300 - Other Income                                                           │
│                                                                                     │
│   5000 - EXPENSES                                                                   │
│   ├── 5100 - Cost of Goods Sold                                                     │
│   ├── 5200 - Salaries & Wages                                                       │
│   ├── 5300 - Rent                                                                   │
│   ├── 5400 - Utilities                                                              │
│   └── 5500 - Marketing                                                              │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Reporting & Analytics

### 10.1 Available Reports

| Category | Reports |
|----------|---------|
| **Sales** | Daily Sales, Sales by Product, Sales by Customer, Sales by Category |
| **Inventory** | Stock Levels, Stock Movement, Low Stock, Inventory Valuation |
| **Financial** | Profit & Loss, Balance Sheet, Cash Flow, Tax Summary |
| **HR** | Attendance, Payroll Summary, Leave Balance |
| **Customer** | Top Customers, Customer Acquisition, Retention Rate |

### 10.2 Dashboard KPIs

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           DASHBOARD                                                 │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   TODAY                                           THIS MONTH                        │
│   ─────                                           ──────────                        │
│   ┌──────────────┐  ┌──────────────┐              ┌───────────────────────────┐     │
│   │   Revenue    │  │   Orders     │              │   Monthly Revenue         │     │
│   │  LKR 45,000  │  │     12       │              │   ████████████░░ 78%     │     │
│   │   ▲ +15%     │  │   ▲ +5%      │              │   LKR 780,000 / 1,000,000 │     │
│   └──────────────┘  └──────────────┘              └───────────────────────────┘     │
│                                                                                     │
│   ┌──────────────┐  ┌──────────────┐              ┌───────────────────────────┐     │
│   │  Avg. Order  │  │   Customers  │              │   Top Products            │     │
│   │  LKR 3,750   │  │     8        │              │   1. T-Shirt (45 sold)   │     │
│   │   ▼ -3%      │  │   ▲ +10%     │              │   2. Jeans (32 sold)     │     │
│   └──────────────┘  └──────────────┘              │   3. Sneakers (28 sold)  │     │
│                                                   └───────────────────────────┘     │
│                                                                                     │
│   ALERTS                                                                            │
│   ──────                                                                            │
│   ⚠️ Low Stock: "Red T-Shirt (M)" - 5 remaining                                    │
│   ⚠️ Low Stock: "Blue Jeans (32)" - 3 remaining                                    │
│   📦 3 orders pending fulfillment                                                   │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Summary

The LankaCommerce Cloud ERP module provides a comprehensive suite of business management tools tailored for Sri Lankan SMEs. Key highlights include:

- **Flexible Product Management** with variants, bundles, and composites
- **Real-time Inventory Tracking** with low-stock alerts
- **Offline-capable POS** for unreliable internet conditions
- **Social Selling Tools** for WhatsApp/Facebook order capture
- **SVAT/VAT Compliant Invoicing** for Sri Lankan tax requirements
- **Complete HR & Payroll** with EPF/ETF calculations

---

*This document is Part 3 of 5 in the LankaCommerce Cloud comprehensive documentation series.*

| Document | Title |
|----------|-------|
| 📄 Document 1 | Executive Overview & Business Strategy |
| 📄 Document 2 | Technical Architecture & Infrastructure |
| **📄 This Document** | ERP Module Features & Specifications |
| 📄 Document 4 | Webstore & E-Commerce Platform |
| 📄 Document 5 | AI Integration & Future Roadmap |
