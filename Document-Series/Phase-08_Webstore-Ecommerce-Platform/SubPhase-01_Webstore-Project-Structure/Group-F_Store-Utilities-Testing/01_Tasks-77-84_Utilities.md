# Phase-08 SubPhase-01 Group-F Document 01
**Tasks 77-84: Store Utility Functions**

---

## Document Metadata
- **Phase:** 08 - Webstore & E-Commerce Platform
- **SubPhase:** 01 - Webstore Project Structure
- **Group:** F - Store Utilities & Testing
- **Document:** 01 of 02
- **Tasks Covered:** 77-84
- **Focus:** Utility Functions

## Navigation
- **Parent:** [Group-F Overview](00_GROUP_OVERVIEW.md)
- **Previous Document:** [Group-E Doc 02](../Group-E_Store-State-Management/02_Tasks-71-76_Extended-Stores-Query.md)
- **Next Document:** [Group-F Doc 02](02_Tasks-85-88_Types-Testing.md)

---

## Document Overview

This document establishes utility functions for currency formatting (LKR/රු), pricing displays, discount calculations, URL generation, image handling, cart totals, and stock checking with Sri Lankan localization.

### Tasks Summary

| Task | Name | Dependencies | Est. Time | Complexity |
|------|------|--------------|-----------|------------|
| 77 | Currency Formatter | Task 76 | 30 min | Low |
| 78 | Price Display Utility | Task 77 | 30 min | Low |
| 79 | Discount Calculator | Task 77 | 30 min | Low |
| 80 | Image URL Helper | Task 76 | 20 min | Low |
| 81 | Product URL Helper | Task 76 | 30 min | Low |
| 82 | Category URL Helper | Task 76 | 30 min | Low |
| 83 | Cart Total Calculator | Task 76 | 1 hr | Medium |
| 84 | Stock Checker Utility | Task 76 | 20 min | Low |

---

## Task 77: Create Currency Formatter

### Overview
Implement formatCurrency function for displaying prices in LKR with රු symbol, comma separators (12,345.67), and en-LK locale using Intl.NumberFormat.

### Dependencies
- Task 76 (State management verified)

### Instructions

1. **Create Currency Formatter File**
   - Create src/lib/store/utils/currency.ts
   - Import Intl.NumberFormat
   - Set up TypeScript types

2. **Implement formatCurrency Function**
   - Accept amount (number) and currency code (default 'LKR')
   - Use Intl.NumberFormat with locale 'en-LK'
   - Configure style: 'currency', currency: 'LKR'
   - Include minimumFractionDigits: 2, maximumFractionDigits: 2

3. **Add රු Symbol Handling**
   - Ensure රු symbol appears (not Rs.)
   - Position symbol before amount
   - Add space after symbol

4. **Implement South Asian Numbering**
   - Use comma separator for thousands: 1,50,000.00
   - Follow en-LK locale conventions
   - Handle large numbers correctly

5. **Create formatPrice Helper**
   - Wrapper for common price formatting
   - Default to LKR currency
   - Simplified API for components

6. **Add parseCurrency Function**
   - Parse formatted currency string to number
   - Remove රු symbol and commas
   - Handle decimal parsing

7. **Create Currency Display Utilities**
   - getCurrencySymbol(code): Return symbol for currency
   - getCurrencyDecimals(code): Return decimal places
   - isSupportedCurrency(code): Check if currency supported

8. **Handle Edge Cases**
   - Zero amounts display as ₨ 0.00
   - Negative amounts with minus sign
   - Very large numbers (millions/billions)
   - Invalid inputs return formatted zero

### Expected Outcome
- formatCurrency function operational
- LKR formatting with රු symbol correct
- South Asian comma separators working
- Parse functions handle strings correctly
- Edge cases handled gracefully
- Type-safe implementations
- Ready for use across webstore

### Verification Checklist
- [ ] currency.ts file created
- [ ] formatCurrency function works
- [ ] රු symbol displays correctly
- [ ] Comma separators follow en-LK pattern
- [ ] formatPrice helper implemented
- [ ] parseCurrency removes formatting
- [ ] Edge cases handled
- [ ] TypeScript types defined

---

## Task 78: Create Price Display Utility

### Overview
Implement price display utilities for showing regular prices, sale prices with strikethrough original, price ranges, and "Free" items with appropriate badges.

### Dependencies
- Task 77 (Currency formatter)

### Instructions

1. **Create Price Display File**
   - Create src/lib/store/utils/price.ts
   - Import formatCurrency from currency.ts
   - Set up TypeScript interfaces

2. **Implement formatPriceDisplay Function**
   - Accept product price object: {price, compareAtPrice?, isFree?}
   - Return formatted display string
   - Handle regular, sale, and free prices

3. **Create Sale Price Display**
   - Show original price with strikethrough: ~~₨ 2,000~~
   - Show sale price prominently: ₨ 1,500
   - Calculate savings percentage
   - Display: "Save 25%" badge

4. **Implement Price Range Display**
   - For products with variants
   - Display format: ₨ 1,000 - ₨ 2,000
   - Use "From ₨ 1,000" for starting price
   - Handle single-price products

5. **Add Free Item Handling**
   - Display "Free" badge instead of ₨ 0.00
   - Style differently for visibility
   - Include "FREE" in prominent text

6. **Create Pricing Component Helpers**
   - getPriceClass(onSale): Return CSS class names
   - shouldShowComparePrice(product): Boolean logic
   - calculateSavings(original, sale): Return amount and percentage

7. **Add Price Formatting Options**
   - Compact mode: Remove decimals for whole numbers
   - showCurrency parameter: Show/hide රු symbol
   - abbreviated mode: "1.5K" for large amounts

8. **Handle Special Cases**
   - Out of stock pricing display
   - Pre-order pricing
   - Bundle pricing
   - Subscription pricing

### Expected Outcome
- formatPriceDisplay working for all scenarios
- Sale prices show with strikethrough original
- Price ranges display correctly
- Free items marked prominently
- Savings calculations accurate
- Component helpers functional
- Options provide flexibility

### Verification Checklist
- [ ] price.ts file created
- [ ] formatPriceDisplay handles all types
- [ ] Sale prices show correctly with ~~strikethrough~~
- [ ] Price ranges display properly
- [ ] Free items show "FREE" badge
- [ ] Savings percentage calculated
- [ ] Component helpers implemented
- [ ] Special cases handled

---

## Task 79: Create Discount Calculator

### Overview
Implement discount calculation utilities including percentage discounts, fixed-amount discounts, bulk discounts, and stacked discount application.

### Dependencies
- Task 77 (Currency formatter)

### Instructions

1. **Create Discount Calculator File**
   - Create src/lib/store/utils/discount.ts
   - Import currency utilities
   - Define discount types

2. **Implement calculateDiscount Function**
   - Accept original price and sale price
   - Return discount percentage
   - Formula: ((original - sale) / original) × 100
   - Round to 2 decimal places

3. **Create calculateSaveAmount Function**
   - Accept original and sale prices
   - Return amount saved in LKR
   - Format with currency formatter

4. **Implement applyDiscount Function**
   - Accept price and discount (percentage or fixed)
   - Support both percentage (25%) and fixed (500 LKR) discounts
   - Return discounted price
   - Ensure non-negative results

5. **Add Bulk Discount Calculator**
   - applyBulkDiscount(price, quantity, tiers)
   - Discount tiers: [{minQty, discountPercent}]
   - Apply appropriate tier based on quantity
   - Return per-unit and total prices

6. **Create applyStackedDiscounts Function**
   - Accept price and array of discounts
   - Apply discounts sequentially
   - Return final price and breakdown
   - Track each discount application

7. **Implement Discount Validation**
   - validateDiscount(discount): Check if valid
   - isDiscountActive(discount, date): Check validity dates
   - canApplyDiscount(product, discount): Check eligibility

8. **Add Comparison Utilities**
   - getBetterDeal(deal1, deal2): Compare discount offers
   - calculateEffectiveDiscount(stackedDiscounts): Total savings
   - formatDiscountDisplay(discount): User-friendly text

### Expected Outcome
- All discount functions operational
- Percentage calculations accurate
- Fixed discounts applied correctly
- Bulk discounts work with tiered pricing
- Stacked discounts calculated properly
- Validation prevents invalid discounts
- Comparison utilities help users

### Verification Checklist
- [ ] discount.ts created
- [ ] calculateDiscount returns percentage
- [ ] calculateSaveAmount formatted in LKR
- [ ] applyDiscount handles percentage and fixed
- [ ] Bulk discounts apply correct tier
- [ ] Stacked discounts calculated sequentially
- [ ] Validation functions work
- [ ] Comparison utilities functional

---

## Task 80: Create Image URL Helper

### Overview
Implement image URL generation utilities supporting multiple sizes (thumbnail/medium/large), CDN integration, placeholder images, and responsive image srcsets.

### Dependencies
- Task 76 (State management verified)

### Instructions

1. **Create Image URL Helper File**
   - Create src/lib/store/utils/images.ts
   - Define image size constants
   - Set up CDN base URL from env

2. **Implement getImageUrl Function**
   - Accept image path and size ('thumb'|'medium'|'large')
   - Construct URL from CDN base + size directory + filename
   - Size mappings: thumb (150px), medium (400px), large (1000px)
   - Return full CDN URL

3. **Add Responsive Image Generation**
   - getImageSrcSet(image): Generate srcset attribute
   - Include multiple sizes: 1x, 2x, 3x for retina displays
   - Format: "url-1x 1x, url-2x 2x, url-3x 3x"
   - Support WebP format where available

4. **Create Placeholder Image Utility**
   - getPlaceholderImage(width, height): Return placeholder URL
   - Use placeholder service or local SVG
   - Include product category icon if available
   - Consistent styling

5. **Implement Image Optimization**
   - optimizeImageUrl(url, options): Add optimization params
   - Options: quality, format (webp/jpg/png), fit (cover/contain)
   - Append query parameters for image service
   - Support lazy loading attributes

6. **Add Image Validation**
   - isValidImageUrl(url): Check if URL valid
   - checkImageExists(url): Verify image availability
   - getImageDimensions(url): Parse or fetch dimensions

7. **Create Product Image Helpers**
   - getProductMainImage(product): Return primary image
   - getProductGallery(product): Return all images
   - getProductThumbnail(product): Return thumbnail
   - Fallback to placeholder if no images

8. **Handle CDN Failover**
   - Implement fallback to origin server if CDN fails
   - Retry logic for failed images
   - Cache successful URL patterns
   - Error image display

### Expected Outcome
- getImageUrl generates correct CDN URLs
- Multiple sizes supported
- Responsive srcsets generated
- Placeholders available for missing images
- Optimization parameters working
- Product image helpers functional
- Failover handling implemented

### Verification Checklist
- [ ] images.ts created
- [ ] getImageUrl returns CDN URLs
- [ ] All sizes (thumb/medium/large) work
- [ ] Srcset generation functional
- [ ] Placeholder images display
- [ ] Optimization parameters applied
- [ ] Product image helpers working
- [ ] Failover logic implemented

---

## Task 81: Create Product URL Helper

### Overview
Implement SEO-friendly product URL generation utilities supporting slugs, canonical URLs, filtered product listings, and dynamic routing.

### Dependencies
- Task 76 (State management verified)

### Instructions

1. **Create Product URL Helper File**
   - Create src/lib/store/utils/urls.ts (product section)
   - Import environment variables for base URL
   - Define URL patterns

2. **Implement getProductUrl Function**
   - Accept product or product slug
   - Generate URL: /products/[slug]
   - Ensure slug is URL-safe (lowercase, hyphens)
   - Return full pathname

3. **Create getProductsUrl Function**
   - Accept optional filters: {category?, search?, sort?, page?}
   - Build query string from filters
   - Format: /products?category=electronics&sort=price-asc&page=2
   - Encode parameters properly

4. **Add getCanonicalProductUrl**
   - Accept product
   - Return full canonical URL including domain
   - Format: https://example.com/products/product-slug
   - Use for SEO meta tags

5. **Implement Product Variant URL**
   - getProductVariantUrl(product, variant): Add variant to URL
   - Format: /products/product-slug?variant=variant-id
   - Maintain other query parameters
   - Support sharing specific variants

6. **Create URL Slug Utilities**
   - generateSlug(productName): Create URL-safe slug
   - Lowercase, replace spaces with hyphens
   - Remove special characters
   - Ensure uniqueness

7. **Add Related Product URLs**
   - getRelatedProductsUrl(product): Link to related items
   - getSimilarProductsUrl(product): Similar products link
   - Format with appropriate filters

8. **Implement URL Parsing**
   - parseProductUrl(url): Extract slug and parameters
   - getProductIdFromUrl(url): Extract product ID
   - isValidProductUrl(url): Validate product URL pattern

### Expected Outcome
- getProductUrl generates correct product paths
- getProductsUrl builds filtered listing URLs
- Canonical URLs include full domain
- Variant URLs maintain state
- Slug generation creates SEO-friendly strings
- Parsing utilities extract information correctly
- Related product links functional

### Verification Checklist
- [ ] urls.ts created with product section
- [ ] getProductUrl returns /products/[slug]
- [ ] getProductsUrl builds query strings
- [ ] Canonical URLs include domain
- [ ] Variant URLs preserve parameters
- [ ] generateSlug creates valid slugs
- [ ] Parsing utilities extract data
- [ ] Related product URLs work

---

## Task 82: Create Category URL Helper

### Overview
Implement category URL generation utilities supporting hierarchical navigation, breadcrumbs, filtered category views, and SEO-friendly URLs.

### Dependencies
- Task 76 (State management verified)

### Instructions

1. **Add Category Section to URLs File**
   - Extend src/lib/store/utils/urls.ts
   - Define category URL patterns
   - Support hierarchical categories

2. **Implement getCategoryUrl Function**
   - Accept category or category slug
   - Support parent/child hierarchy: /categories/parent/child
   - Generate nested paths for multi-level categories
   - Return full pathname

3. **Create getBreadcrumbs Function**
   - Accept category object
   - Traverse parent categories to root
   - Return array: [{name, url}, ...]
   - Include "Home" as first crumb

4. **Implement getCategoriesUrl**
   - Accept optional filters: {level?, parent?, sort?}
   - Build query string for category listing
   - Format: /categories?level=2&parent=electronics

5. **Add Category Product Listing URL**
   - getCategoryProductsUrl(category, filters): Products in category
   - Format: /categories/[slug]/products?sort=price&page=1
   - Include pagination and sorting

6. **Create Hierarchical Navigation**
   - getParentCategoryUrl(category): Link to parent
   - getChildCategoriesUrl(category): Link to children view
   - getSiblingCategoriesUrl(category): Related categories

7. **Implement SEO URL Utilities**
   - getCanonicalCategoryUrl(category): Full URL with domain
   - getCategoryDescriptionUrl(category): About category page
   - generateCategorySlug(name, parent?): Create nested slug

8. **Add Category URL Parsing**
   - parseCategoryUrl(url): Extract slug hierarchy
   - getCategoryPathFromUrl(url): Get nested path array
   - isValidCategoryUrl(url): Validate category URL pattern

### Expected Outcome
- getCategoryUrl handles nested categories
- Breadcrumbs generated with full path
- Category listing URLs with filters working
- Product listing URLs include category context
- Hierarchical navigation helpers functional
- SEO canonical URLs correct
- Parsing utilities extract hierarchy

### Verification Checklist
- [ ] Category section added to urls.ts
- [ ] getCategoryUrl handles nesting
- [ ] getBreadcrumbs returns path array
- [ ] Category listing URLs with filters work
- [ ] Product listing URLs functional
- [ ] Parent/child/sibling URLs generated
- [ ] Canonical URLs correct
- [ ] Parsing utilities extract hierarchy

---

## Task 83: Create Cart Total Calculator

### Overview
Implement comprehensive cart calculation utilities for subtotals, Sri Lankan VAT (8%), shipping costs, discounts, and final totals with proper LKR formatting.

### Dependencies
- Task 76 (State management verified)

### Instructions

1. **Create Cart Calculator File**
   - Create src/lib/store/utils/cart.ts
   - Import currency and discount utilities
   - Define calculation types

2. **Implement calculateItemTotal Function**
   - Accept cart item: {price, quantity, discounts?}
   - Calculate line total: price × quantity
   - Apply item-level discounts
   - Return LKR amount

3. **Create calculateSubtotal Function**
   - Accept array of cart items
   - Sum all item totals
   - Format in LKR
   - Return numeric and formatted values

4. **Implement calculateTax Function**
   - Accept subtotal amount
   - Apply Sri Lankan VAT rate (8% standard)
   - Handle tax-exempt categories if applicable
   - Return tax amount in LKR

5. **Create calculateShipping Function**
   - Accept subtotal, destination, shipping method
   - Apply free shipping threshold (e.g., over ₨ 5,000)
   - Calculate based on weight/distance if needed
   - Return shipping cost in LKR

6. **Implement calculateDiscount Function**
   - Accept subtotal and applied coupons/promotions
   - Calculate discount amount
   - Support percentage and fixed discounts
   - Cap at maximum discount value
   - Return discount in LKR

7. **Create calculateTotal Function**
   - Sum: subtotal + tax + shipping - discounts
   - Ensure non-negative total
   - Return final amount in LKR
   - Provide breakdown object

8. **Add getCartSummary Function**
   - Accept cart state
   - Return complete breakdown:
     ```
     {
       subtotal: number,
       subtotalFormatted: string,
       tax: number,
       taxFormatted: string,
       shipping: number,
       shippingFormatted: string,
       discount: number,
       discountFormatted: string,
       total: number,
       totalFormatted: string,
       itemCount: number,
       savings: number
     }
     ```

9. **Implement Price Validation**
   - validateCartPrices(items): Check for price changes
   - checkMinimumOrder(total): Verify minimum order value
   - detectPriceAnomalies(cart): Flag unusual totals

10. **Create Rounding Utilities**
    - roundToLKR(amount): Round to 2 decimal places
    - Apply Sri Lankan rounding rules if any
    - Ensure consistent rounding across calculations

### Expected Outcome
- All calculation functions accurate
- Item totals calculated correctly
- Subtotal sums all items
- Tax applies 8% VAT correctly
- Shipping costs calculated with free threshold
- Discounts applied properly
- Total breakdown complete and accurate
- Cart summary provides full detail
- Validation checks prevent errors
- Rounding consistent across calculations

### Verification Checklist
- [ ] cart.ts file created
- [ ] calculateItemTotal multiplies price × quantity
- [ ] calculateSubtotal sums all items
- [ ] calculateTax applies 8% VAT
- [ ] calculateShipping handles free shipping threshold
- [ ] calculateDiscount applies coupons
- [ ] calculateTotal provides accurate final amount
- [ ] getCartSummary returns complete breakdown
- [ ] Validation functions work
- [ ] Rounding consistent in LKR

---

## Task 84: Create Stock Checker Utility

### Overview
Implement stock availability checking utilities including in-stock status, low stock warnings, out-of-stock detection, and inventory messaging.

### Dependencies
- Task 76 (State management verified)

### Instructions

1. **Create Stock Checker File**
   - Create src/lib/store/utils/stock.ts
   - Define stock status types
   - Set up inventory thresholds

2. **Implement isInStock Function**
   - Accept product and optional quantity
   - Check inventory.quantity >= requested quantity
   - Consider trackInventory flag
   - Return boolean

3. **Create getStockLevel Function**
   - Accept product
   - Return current inventory quantity
   - Handle untracked inventory (return Infinity)
   - Return number

4. **Implement getStockStatus Function**
   - Accept product
   - Return status: 'in_stock' | 'low' | 'out_of_stock'
   - Low stock: quantity <= lowStockThreshold (e.g., 10)
   - Out of stock: quantity === 0
   - Return status string

5. **Create getStockMessage Function**
   - Accept product
   - Generate user-friendly message:
     - In stock: "In Stock"
     - Low stock: "Only 3 left in stock!"
     - Out of stock: "Out of Stock"
     - Backorder: "Available for backorder"
   - Return localized string

6. **Implement canAddToCart Function**
   - Accept product and requested quantity
   - Check stock availability
   - Verify against cart limits
   - Return {canAdd: boolean, reason?: string}

7. **Create getAvailableQuantity Function**
   - Accept product and current cart quantity
   - Calculate remaining available quantity
   - Consider maximum per order limits
   - Return number

8. **Add Stock Badge Helpers**
   - getStockBadgeColor(status): Return badge color class
   - shouldShowStockBadge(product): Boolean for display
   - getStockBadgeText(product): Badge display text
   - Provide visual indicator helpers

9. **Implement Backorder Support**
   - allowsBackorder(product): Check backorder flag
   - getBackorderMessage(product): Backorder notice
   - estimateRestockDate(product): Expected availability

10. **Create Stock Validation**
    - validateStockLevels(cart): Check entire cart
    - detectStockChanges(cartItems, products): Compare cached vs current
    - getOutOfStockItems(cart): Return unavailable items

### Expected Outcome
- isInStock accurately determines availability
- getStockLevel returns correct quantity
- getStockStatus categorizes inventory correctly
- getStockMessage provides user-friendly text
- canAddToCart validates against limits
- Available quantity calculations accurate
- Badge helpers provide visual indicators
- Backorder support functional
- Validation detects stock issues
- Stock change detection working

### Verification Checklist
- [ ] stock.ts created
- [ ] isInStock checks availability
- [ ] getStockLevel returns quantity
- [ ] getStockStatus returns correct status
- [ ] getStockMessage generates friendly text
- [ ] canAddToCart validates limits
- [ ] getAvailableQuantity calculates correctly
- [ ] Badge helpers provide indicators
- [ ] Backorder support implemented
- [ ] Validation functions work

---

## Summary

This document completed **Tasks 77-84**, establishing store utility functions:

**Task 77:** Currency formatting with LKR/රු and South Asian numbering  
**Task 78:** Price displays for regular, sale, ranges, and free items  
**Task 79:** Discount calculations for percentage, fixed, bulk, and stacked  
**Task 80:** Image URL generation with CDN, sizes, and optimization  
**Task 81:** SEO-friendly product URLs with slugs and variants  
**Task 82:** Category URLs with hierarchical navigation and breadcrumbs  
**Task 83:** Cart total calculations with VAT, shipping, and discounts  
**Task 84:** Stock checking with availability status and messaging

### Key Deliverables

- Currency formatter for LKR with rurපු symbol
- Price display utilities for all scenarios
- Comprehensive discount calculation system
- Image URL handling with CDN support
- SEO-friendly URL generation for products and categories
- Cart calculation engine with Sri Lankan VAT
- Stock availability checker with messaging

### Next Steps

Proceed to **[Group-F Doc 02](02_Tasks-85-88_Types-Testing.md)** for TypeScript types, testing infrastructure, and final verification.

---

**End of Document 01**
