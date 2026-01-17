# Phase 04: ERP Core Modules - Part 1 - Sub-Phases Summary

> **Phase Index:** 04 of 10  
> **Phase Goal:** Implement primary business modules for product and inventory management  
> **Total Sub-Phases:** 10 | **Status:** Planning

---

## Navigation

- **↑ Parent:** [00_PHASES_SUMMARY.md](../00_PHASES_SUMMARY.md)
- **← Previous Phase:** [Phase-03](../Phase-03_Core-Backend-Infrastructure/)
- **→ Next Phase:** [Phase-05](../Phase-05_ERP-Core-Modules-Part2/)

---

## Phase Overview

This phase implements the foundational ERP modules for product and inventory management. These modules form the core of any retail/commerce business and are essential for both the ERP dashboard and the customer-facing webstore.

### Key Outcomes
- Complete product catalog system (simple, variable, bundle, composite)
- Category and attribute system
- Variant management with SKU generation
- Inventory tracking across locations
- Stock level management with alerts
- Unit of measure support

---

## Sub-Phase Index

| # | Sub-Phase Name | Description | Tasks | Status |
|---|----------------|-------------|-------|--------|
| 01 | **Category Model & Hierarchy** | Create hierarchical category system with unlimited nesting | TBD | 🔴 Not Created |
| 02 | **Attribute System** | Build flexible attribute system for product specifications | TBD | 🔴 Not Created |
| 03 | **Product Base Model** | Create core product model with all common fields | TBD | 🔴 Not Created |
| 04 | **Product Variants** | Implement variable products with size/color/material combinations | TBD | 🔴 Not Created |
| 05 | **Bundle & Composite Products** | Create product bundles and manufacturing recipes | TBD | 🔴 Not Created |
| 06 | **Product Pricing** | Implement pricing logic (base, sale, cost, tiered pricing) | TBD | 🔴 Not Created |
| 07 | **Product Media** | Product images with gallery, thumbnails, and optimization | TBD | 🔴 Not Created |
| 08 | **Warehouse & Locations** | Multi-warehouse and storage location support | TBD | 🔴 Not Created |
| 09 | **Inventory Management** | Stock levels, movements, adjustments, transfers | TBD | 🔴 Not Created |
| 10 | **Stock Alerts & Reordering** | Low stock alerts, reorder points, auto-suggestions | TBD | 🔴 Not Created |

---

## Sub-Phase Details

### SubPhase-01: Category Model & Hierarchy
**Goal:** Create a flexible, hierarchical category system.

**Key Features:**
- Unlimited nesting depth (MPTT or django-treebeard)
- Category images and descriptions
- SEO fields (slug, meta title, meta description)
- Active/inactive status
- Display order
- Category-specific attributes

**Model Structure:**
```python
Category:
  - name
  - slug
  - parent (self-referential)
  - description
  - image
  - is_active
  - display_order
  - seo_title
  - seo_description
```

**Dependencies:** Phase-03 (Base models)

---

### SubPhase-02: Attribute System
**Goal:** Create flexible product attributes for specifications.

**Attribute Types:**
- Text (e.g., Material: Cotton)
- Number (e.g., Weight: 250g)
- Select (e.g., Size: S, M, L, XL)
- Multi-select (e.g., Colors: Red, Blue)
- Boolean (e.g., Is Organic: Yes/No)

**Key Features:**
- Attribute groups (Physical, Technical, etc.)
- Filterable attributes for webstore
- Searchable attributes
- Category-specific attribute assignment

**Dependencies:** SubPhase-01

---

### SubPhase-03: Product Base Model
**Goal:** Create the core product model.

**Product Fields:**
```python
Product:
  - name
  - slug
  - sku
  - barcode (EAN-13, UPC)
  - description (rich text)
  - short_description
  - category (FK)
  - brand (FK)
  - product_type (simple/variable/bundle/composite)
  - status (draft/active/archived)
  - is_webstore_visible
  - is_pos_visible
  - tax_class (FK)
  - unit_of_measure (FK)
```

**Dependencies:** SubPhase-01, SubPhase-02

---

### SubPhase-04: Product Variants
**Goal:** Implement variable products with combinations.

**Key Concepts:**
- Parent product (T-Shirt)
- Variant options (Size: S,M,L | Color: Red,Blue)
- Variant combinations (6 variants for 3 sizes × 2 colors)
- Each variant has own: SKU, price, stock, image

**Example:**
```
T-Shirt (Parent)
├── T-Shirt - S - Red   [SKU: TS-S-RED]
├── T-Shirt - S - Blue  [SKU: TS-S-BLU]
├── T-Shirt - M - Red   [SKU: TS-M-RED]
├── T-Shirt - M - Blue  [SKU: TS-M-BLU]
├── T-Shirt - L - Red   [SKU: TS-L-RED]
└── T-Shirt - L - Blue  [SKU: TS-L-BLU]
```

**Dependencies:** SubPhase-03

---

### SubPhase-05: Bundle & Composite Products
**Goal:** Create product bundles and manufacturing recipes.

**Bundle Products:**
- Collection of existing products sold together
- Bundle price (usually discounted)
- Stock depends on component availability
- Example: Gift Hamper = Chocolate + Wine + Card

**Composite Products:**
- Raw material → Finished product
- BOM (Bill of Materials)
- Manufacturing cost calculation
- Example: Custom Cake = Flour + Sugar + Eggs + Labor

**Dependencies:** SubPhase-03

---

### SubPhase-06: Product Pricing
**Goal:** Implement comprehensive pricing system.

**Price Types:**
- Base price (regular selling price)
- Sale price (promotional price)
- Cost price (purchase cost)
- Wholesale price (B2B pricing)
- Tiered pricing (quantity-based discounts)

**Sri Lanka Specific:**
- All prices in LKR
- VAT/SVAT handling
- Price inclusive/exclusive of tax

**Dependencies:** SubPhase-03

---

### SubPhase-07: Product Media
**Goal:** Implement product image management.

**Features:**
- Multiple images per product/variant
- Primary image designation
- Image gallery with ordering
- Auto-resize on upload (thumbnail, medium, large)
- WebP conversion for web
- Alt text for SEO
- Tenant-isolated storage

**Image Sizes:**
- Thumbnail: 150×150
- Medium: 500×500
- Large: 1000×1000
- Original: preserved

**Dependencies:** SubPhase-03, Phase-03 (File storage)

---

### SubPhase-08: Warehouse & Locations
**Goal:** Support multiple warehouses and storage locations.

**Models:**
```python
Warehouse:
  - name
  - code
  - address
  - is_default
  - is_active

StorageLocation:
  - warehouse (FK)
  - name (e.g., "Aisle A, Shelf 3")
  - barcode
```

**Key Features:**
- Multiple warehouses per tenant
- Storage locations within warehouses
- Default warehouse for POS
- Warehouse-specific stock levels

**Dependencies:** Phase-03

---

### SubPhase-09: Inventory Management
**Goal:** Track stock levels and movements.

**Stock Operations:**
- Stock In (Purchase receipt)
- Stock Out (Sales, damages)
- Stock Transfer (Between warehouses)
- Stock Adjustment (Corrections)
- Stock Take (Physical counting)

**Models:**
```python
StockLevel:
  - product/variant (FK)
  - warehouse (FK)
  - quantity
  - reserved_quantity

StockMovement:
  - product/variant (FK)
  - from_warehouse (FK, nullable)
  - to_warehouse (FK, nullable)
  - quantity
  - movement_type
  - reference (order, PO, adjustment)
  - timestamp
```

**Dependencies:** SubPhase-04, SubPhase-08

---

### SubPhase-10: Stock Alerts & Reordering
**Goal:** Automated inventory monitoring and suggestions.

**Features:**
- Low stock threshold per product
- Reorder point configuration
- Automatic low stock alerts (email, dashboard)
- Reorder quantity suggestion
- Out of stock handling (hide from webstore)

**Alert Configuration:**
```python
ProductStockConfig:
  - product (FK)
  - warehouse (FK)
  - low_stock_threshold (default: 10)
  - reorder_point (default: 20)
  - reorder_quantity (default: 50)
```

**Dependencies:** SubPhase-09, Phase-03 (Celery for scheduled checks)

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Sub-Phases | 10 |
| Sub-Phases Created | 0 |
| Task Documents Created | 0 |

**Last Updated:** 2026-01-17  
**Current Status:** Awaiting approval to create Sub-Phase folders

---

## Execution Order

```
SubPhase-01 (Categories)
       │
       └──→ SubPhase-02 (Attributes)
                   │
                   └──→ SubPhase-03 (Product Base)
                               │
                               ├──→ SubPhase-04 (Variants)
                               │           │
                               │           └──→ SubPhase-09 (Inventory)
                               │                       │
                               │                       └──→ SubPhase-10 (Alerts)
                               │
                               ├──→ SubPhase-05 (Bundles)
                               │
                               ├──→ SubPhase-06 (Pricing)
                               │
                               └──→ SubPhase-07 (Media)
       
       SubPhase-08 (Warehouses) ──→ SubPhase-09 (Inventory)
```

---

## Next Steps

1. ✅ Sub-Phases Summary Document Created (This file)
2. ⏳ Awaiting user review via flow.py
3. ⏳ Create 10 Sub-Phase folders
4. ⏳ Create Task summary for each Sub-Phase
5. ⏳ Create individual Task documents

---

*AI Agents: Product and inventory are the heart of the ERP. Ensure proper variant handling and stock tracking.*
