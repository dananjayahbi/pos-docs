# SubPhase 04: Product Detail Page - Tasks Summary

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase Index:** 04 of 14  
> **SubPhase Goal:** Build comprehensive single product page with image gallery, variants, reviews, and related products  
> **Total Tasks:** 94 | **Status:** Planning  
> **Estimated Duration:** 12-14 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-03_Product-Catalog-Pages](../SubPhase-03_Product-Catalog-Pages/)
- **→ Next SubPhase:** [SubPhase-05_Search-Functionality](../SubPhase-05_Search-Functionality/)

---

## SubPhase Overview

This sub-phase creates the product detail page with image gallery, variant selection, stock availability, add to cart/wishlist, customer reviews, and related products section.

### Key Outcomes
- Product detail page route
- Image gallery with zoom and thumbnails
- Variant selection (size, color, etc.)
- Stock availability display
- Add to cart and buy now buttons
- Wishlist functionality
- Share buttons (WhatsApp, Facebook)
- Product tabs (description, specs, reviews)
- Related products section

### Page Structure
```
┌─────────────────────────────────────────────────────────────┐
│ Breadcrumb: Home > Category > Product Name                  │
├─────────────────────────────────────────────────────────────┤
│ ┌───────────────────┐  PRODUCT INFO                         │
│ │                   │  Product Name                         │
│ │   Image Gallery   │  ⭐⭐⭐⭐⭐ (25 reviews)                  │
│ │                   │  ₨̶ ̶2̶,̶5̶0̶0̶  ₨1,999 (20% off)            │
│ │  [Thumbnails]     │                                       │
│ └───────────────────┘  Size: [S] [M] [L] [XL]              │
│                        Color: [🔵] [🔴] [⚫]                 │
│                        Quantity: [-] 1 [+]                  │
│                                                             │
│                        [Add to Cart] [Buy Now]              │
│                        [♡ Add to Wishlist]                  │
├─────────────────────────────────────────────────────────────┤
│ TABS: Description | Specifications | Reviews (25)          │
├─────────────────────────────────────────────────────────────┤
│ RELATED PRODUCTS                                            │
└─────────────────────────────────────────────────────────────┘
```

### Technology Context
- **Data Fetching:** Server Components for initial load
- **Client Interactions:** Client Components for gallery, cart
- **State:** Zustand for cart, TanStack Query for reviews
- **Images:** Next.js Image with optimization

---

## Task Execution Order

```
TASK GROUP A: Route & Page Structure (Tasks 01-16)
        │
        ▼
TASK GROUP B: Image Gallery (Tasks 17-34)
        │
        ▼
TASK GROUP C: Product Information (Tasks 35-52)
        │
        ▼
TASK GROUP D: Variant & Cart Actions (Tasks 53-68)
        │
        ▼
TASK GROUP E: Tabs & Reviews (Tasks 69-82)
        │
        ▼
TASK GROUP F: Related Products & Testing (Tasks 83-94)
```

---

## Task Index

### Group A: Route & Page Structure (Tasks 01-16)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create Product Detail Directory** | Set up products/[slug]/ directory | SubPhase-03 | 🔴 Not Created |
| 02 | **Create Product Page Route** | Create products/[slug]/page.tsx | Task 01 | 🔴 Not Created |
| 03 | **Create Product Page Layout** | Shared layout for product page | Task 01 | 🔴 Not Created |
| 04 | **Create Product Loading State** | Loading skeleton for product page | Task 02 | 🔴 Not Created |
| 05 | **Create Product Error State** | Error handling (not found, error) | Task 02 | 🔴 Not Created |
| 06 | **Create Product Not Found Page** | 404 state for invalid slug | Task 05 | 🔴 Not Created |
| 07 | **Create generateStaticParams** | Static generation for popular products | Task 02 | 🔴 Not Created |
| 08 | **Create generateMetadata** | Dynamic SEO metadata | Task 02 | 🔴 Not Created |
| 09 | **Create Product Page Container** | Main product page wrapper | Task 02 | 🔴 Not Created |
| 10 | **Create Product Breadcrumb** | Breadcrumb with category path | Task 09 | 🔴 Not Created |
| 11 | **Create Two-Column Layout** | Left gallery, right info layout | Task 09 | 🔴 Not Created |
| 12 | **Create Mobile Stack Layout** | Single column for mobile | Task 11 | 🔴 Not Created |
| 13 | **Create Product Data Fetcher** | Server-side product fetch | Task 09 | 🔴 Not Created |
| 14 | **Create Product Types** | TypeScript types for product page | Task 13 | 🔴 Not Created |
| 15 | **Create Product API Service** | API service for product details | Task 14 | 🔴 Not Created |
| 16 | **Verify Route and Data Flow** | Test product page route | Task 15 | 🔴 Not Created |

---

### Group B: Image Gallery (Tasks 17-34)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 17 | **Create Gallery Component** | Main image gallery wrapper | Task 16 | 🔴 Not Created |
| 18 | **Create Main Image Display** | Large primary image | Task 17 | 🔴 Not Created |
| 19 | **Create Image Zoom Feature** | Hover zoom on main image | Task 18 | 🔴 Not Created |
| 20 | **Create Lightbox Modal** | Full-screen image modal | Task 18 | 🔴 Not Created |
| 21 | **Create Lightbox Navigation** | Previous/next in lightbox | Task 20 | 🔴 Not Created |
| 22 | **Create Lightbox Controls** | Close, zoom controls | Task 20 | 🔴 Not Created |
| 23 | **Create Thumbnail Strip** | Horizontal thumbnail row | Task 17 | 🔴 Not Created |
| 24 | **Create Thumbnail Item** | Individual thumbnail button | Task 23 | 🔴 Not Created |
| 25 | **Create Thumbnail Active State** | Active thumbnail styling | Task 24 | 🔴 Not Created |
| 26 | **Create Thumbnail Navigation** | Scroll thumbnails overflow | Task 23 | 🔴 Not Created |
| 27 | **Create Image Swipe Mobile** | Touch swipe for mobile | Task 18 | 🔴 Not Created |
| 28 | **Create Image Dots Mobile** | Dot indicators for mobile | Task 27 | 🔴 Not Created |
| 29 | **Create Variant Image Switch** | Switch images on variant change | Task 17 | 🔴 Not Created |
| 30 | **Create Image Loading State** | Skeleton while image loads | Task 18 | 🔴 Not Created |
| 31 | **Create Image Error State** | Placeholder for failed images | Task 18 | 🔴 Not Created |
| 32 | **Create Sale Badge on Gallery** | Sale/discount badge overlay | Task 18 | 🔴 Not Created |
| 33 | **Create Out of Stock Overlay** | Overlay for sold out products | Task 18 | 🔴 Not Created |
| 34 | **Verify Gallery Interactions** | Test all gallery features | Task 33 | 🔴 Not Created |

---

### Group C: Product Information (Tasks 35-52)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 35 | **Create Product Info Container** | Right side info wrapper | Task 16 | 🔴 Not Created |
| 36 | **Create Product Title** | Product name display | Task 35 | 🔴 Not Created |
| 37 | **Create Product SKU** | SKU code display | Task 35 | 🔴 Not Created |
| 38 | **Create Rating Summary** | Star rating with count | Task 35 | 🔴 Not Created |
| 39 | **Create Star Rating Display** | 5-star visual component | Task 38 | 🔴 Not Created |
| 40 | **Create Review Count Link** | Link to reviews section | Task 38 | 🔴 Not Created |
| 41 | **Create Price Display** | Current price in LKR (₨) | Task 35 | 🔴 Not Created |
| 42 | **Create Original Price** | Strikethrough original price | Task 41 | 🔴 Not Created |
| 43 | **Create Discount Badge** | Percentage off badge | Task 41 | 🔴 Not Created |
| 44 | **Create Tax Info** | "Inclusive of taxes" text | Task 41 | 🔴 Not Created |
| 45 | **Create Short Description** | Brief product description | Task 35 | 🔴 Not Created |
| 46 | **Create Stock Status** | In stock / Out of stock | Task 35 | 🔴 Not Created |
| 47 | **Create Low Stock Warning** | "Only X left" warning | Task 46 | 🔴 Not Created |
| 48 | **Create Delivery Estimate** | Estimated delivery info | Task 35 | 🔴 Not Created |
| 49 | **Create Free Shipping Note** | Free shipping eligibility | Task 48 | 🔴 Not Created |
| 50 | **Create Share Buttons** | WhatsApp, Facebook share | Task 35 | 🔴 Not Created |
| 51 | **Create WhatsApp Share** | Share via WhatsApp | Task 50 | 🔴 Not Created |
| 52 | **Create Facebook Share** | Share via Facebook | Task 50 | 🔴 Not Created |

---

### Group D: Variant & Cart Actions (Tasks 53-68)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 53 | **Create Variant Selection Container** | Wrapper for all variants | Task 35 | 🔴 Not Created |
| 54 | **Create Variant Option Group** | Single variant type (Size, Color) | Task 53 | 🔴 Not Created |
| 55 | **Create Size Selector** | Size buttons (S, M, L, XL) | Task 54 | 🔴 Not Created |
| 56 | **Create Color Selector** | Color swatches | Task 54 | 🔴 Not Created |
| 57 | **Create Color Swatch** | Individual color button | Task 56 | 🔴 Not Created |
| 58 | **Create Variant Unavailable State** | Strikethrough unavailable | Task 54 | 🔴 Not Created |
| 59 | **Create Variant Selection Logic** | Track selected variants | Task 53 | 🔴 Not Created |
| 60 | **Create Price Update on Variant** | Update price per variant | Task 59 | 🔴 Not Created |
| 61 | **Create Quantity Selector** | Quantity [-] 1 [+] | Task 35 | 🔴 Not Created |
| 62 | **Create Quantity Min/Max Limits** | Min 1, max stock limit | Task 61 | 🔴 Not Created |
| 63 | **Create Add to Cart Button** | Primary add to cart CTA | Task 59 | 🔴 Not Created |
| 64 | **Create Buy Now Button** | Direct checkout button | Task 63 | 🔴 Not Created |
| 65 | **Create Add to Cart Loading** | Loading state on add | Task 63 | 🔴 Not Created |
| 66 | **Create Add to Cart Success** | Toast notification success | Task 65 | 🔴 Not Created |
| 67 | **Create Wishlist Button** | Add to wishlist toggle | Task 35 | 🔴 Not Created |
| 68 | **Verify Cart Actions** | Test add to cart flow | Task 67 | 🔴 Not Created |

---

### Group E: Tabs & Reviews (Tasks 69-82)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 69 | **Create Product Tabs Container** | Tabs component wrapper | Task 68 | 🔴 Not Created |
| 70 | **Create Tab Navigation** | Tab buttons (Description, Specs, Reviews) | Task 69 | 🔴 Not Created |
| 71 | **Create Tab Panel Container** | Content panel for tabs | Task 69 | 🔴 Not Created |
| 72 | **Create Description Tab** | Full product description | Task 71 | 🔴 Not Created |
| 73 | **Create Rich Text Display** | Render HTML description | Task 72 | 🔴 Not Created |
| 74 | **Create Specifications Tab** | Product specs table | Task 71 | 🔴 Not Created |
| 75 | **Create Spec Table Row** | Key-value spec row | Task 74 | 🔴 Not Created |
| 76 | **Create Reviews Tab** | Customer reviews section | Task 71 | 🔴 Not Created |
| 77 | **Create Reviews Summary** | Average rating and breakdown | Task 76 | 🔴 Not Created |
| 78 | **Create Rating Breakdown** | 5-star distribution bar | Task 77 | 🔴 Not Created |
| 79 | **Create Review List** | List of customer reviews | Task 76 | 🔴 Not Created |
| 80 | **Create Review Card** | Single review display | Task 79 | 🔴 Not Created |
| 81 | **Create Review Pagination** | Load more reviews | Task 79 | 🔴 Not Created |
| 82 | **Create Write Review Button** | CTA to write review | Task 76 | 🔴 Not Created |

---

### Group F: Related Products & Testing (Tasks 83-94)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 83 | **Create Related Products Section** | Section wrapper | Task 68 | 🔴 Not Created |
| 84 | **Create Related Products Header** | "You may also like" title | Task 83 | 🔴 Not Created |
| 85 | **Create Related Products Grid** | Horizontal product scroll | Task 83 | 🔴 Not Created |
| 86 | **Create Related Product Card** | Smaller product card | Task 85 | 🔴 Not Created |
| 87 | **Create Related Products Fetch** | Fetch related products API | Task 83 | 🔴 Not Created |
| 88 | **Create Recently Viewed Section** | Recently viewed products | Task 83 | 🔴 Not Created |
| 89 | **Create Recently Viewed Storage** | Local storage for history | Task 88 | 🔴 Not Created |
| 90 | **Create Cross-sell Section** | Frequently bought together | Task 83 | 🔴 Not Created |
| 91 | **Test Gallery on Mobile** | Verify mobile gallery | Task 34 | 🔴 Not Created |
| 92 | **Test Variant Selection** | Verify variant changes | Task 68 | 🔴 Not Created |
| 93 | **Test Add to Cart** | Verify cart integration | Task 68 | 🔴 Not Created |
| 94 | **Test Responsive Layout** | Verify all breakpoints | Task 93 | 🔴 Not Created |

---

## Expected Final Structure

```
frontend/
└── app/
    └── (storefront)/
        └── products/
            └── [slug]/
                ├── page.tsx                    # Product page (Task 02)
                ├── layout.tsx                  # Product layout (Task 03)
                ├── loading.tsx                 # Loading state (Task 04)
                ├── error.tsx                   # Error state (Task 05)
                └── not-found.tsx               # 404 state (Task 06)
└── components/
    └── storefront/
        └── product/
            ├── ProductPage/
            │   ├── ProductPage.tsx             # Main container (Task 09)
            │   ├── ProductBreadcrumb.tsx       # Breadcrumb (Task 10)
            │   └── ProductLayout.tsx           # Two-column layout (Task 11)
            ├── Gallery/
            │   ├── Gallery.tsx                 # Gallery wrapper (Task 17)
            │   ├── MainImage.tsx               # Main image (Task 18)
            │   ├── ImageZoom.tsx               # Zoom feature (Task 19)
            │   ├── Lightbox.tsx                # Lightbox modal (Task 20)
            │   ├── ThumbnailStrip.tsx          # Thumbnails (Task 23)
            │   └── MobileSwiper.tsx            # Mobile swipe (Task 27)
            ├── ProductInfo/
            │   ├── ProductInfo.tsx             # Info container (Task 35)
            │   ├── ProductTitle.tsx            # Title (Task 36)
            │   ├── RatingSummary.tsx           # Rating (Task 38)
            │   ├── PriceDisplay.tsx            # Price (Task 41)
            │   ├── StockStatus.tsx             # Stock (Task 46)
            │   └── ShareButtons.tsx            # Share (Task 50)
            ├── VariantSelector/
            │   ├── VariantSelector.tsx         # Wrapper (Task 53)
            │   ├── SizeSelector.tsx            # Sizes (Task 55)
            │   ├── ColorSelector.tsx           # Colors (Task 56)
            │   └── QuantitySelector.tsx        # Quantity (Task 61)
            ├── CartActions/
            │   ├── AddToCartButton.tsx         # Add to cart (Task 63)
            │   ├── BuyNowButton.tsx            # Buy now (Task 64)
            │   └── WishlistButton.tsx          # Wishlist (Task 67)
            ├── ProductTabs/
            │   ├── ProductTabs.tsx             # Tabs wrapper (Task 69)
            │   ├── DescriptionTab.tsx          # Description (Task 72)
            │   ├── SpecificationsTab.tsx       # Specs (Task 74)
            │   └── ReviewsTab.tsx              # Reviews (Task 76)
            ├── Reviews/
            │   ├── ReviewsSummary.tsx          # Summary (Task 77)
            │   ├── ReviewList.tsx              # Review list (Task 79)
            │   └── ReviewCard.tsx              # Single review (Task 80)
            └── RelatedProducts/
                ├── RelatedProducts.tsx         # Related section (Task 83)
                ├── RecentlyViewed.tsx          # Recent (Task 88)
                └── CrossSell.tsx               # Cross-sell (Task 90)
└── services/
    └── storefront/
        └── product/
            └── productDetailService.ts         # API service (Task 15)
└── types/
    └── storefront/
        └── productDetail.types.ts              # Types (Task 14)
```

---

## Progress Tracking

| Group | Name | Tasks | Completed | Progress |
|-------|------|-------|-----------|----------|
| A | Route & Page Structure | 16 | 0 | 0% |
| B | Image Gallery | 18 | 0 | 0% |
| C | Product Information | 18 | 0 | 0% |
| D | Variant & Cart Actions | 16 | 0 | 0% |
| E | Tabs & Reviews | 14 | 0 | 0% |
| F | Related Products & Testing | 12 | 0 | 0% |
| **Total** | | **94** | **0** | **0%** |

---

## Notes for AI Agents

1. **Execute tasks in order** - Follow Group A → F sequence
2. **Test gallery on mobile** - Swipe and zoom must work
3. **Variant changes update** - Price, stock, images must update
4. **WhatsApp share** - Format message with product link
5. **LKR currency** - Use ₨ symbol for prices
6. **Reviews integration** - Will connect to review system in later phase
7. **Related products** - Fetch from same category
8. **Recently viewed** - Store in localStorage with limit
