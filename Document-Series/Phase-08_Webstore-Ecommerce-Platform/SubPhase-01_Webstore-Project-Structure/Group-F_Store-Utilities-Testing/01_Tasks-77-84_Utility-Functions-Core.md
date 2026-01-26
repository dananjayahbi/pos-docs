# Phase-08 SubPhase-01 Group-F Document 01
**Tasks 77-84: Store Utility Functions - Core Utilities**

## Document Metadata

- **Phase:** 08 - Webstore Ecommerce Platform
- **SubPhase:** 01 - Webstore Project Structure
- **Group:** F - Store Utility Functions
- **Document:** 01 - Core Utility Functions
- **Tasks Covered:** 77-84
- **Focus Area:** Utility Functions for Currency, URLs, Calculations, and Stock Management
- **Prerequisites:** Group-E (Store State Management) completion
- **Estimated Completion Time:** 4.5 hours

## Navigation

### Hierarchical Navigation
- **Parent:** [Group-F Overview](00_GROUP_OVERVIEW.md)
- **Phase:** [Phase-08 Overview](../../00_PHASE_OVERVIEW.md)
- **SubPhase:** [SubPhase-01 Overview](../00_SUBPHASE_OVERVIEW.md)

### Sequential Navigation
- **Previous:** [Group-E Document 02 - Extended Stores & Query Management](../Group-E_Store-State-Management/02_Tasks-71-76_Extended-Stores-Query.md)
- **Next:** [Group-F Document 02 - Types & Testing](02_Tasks-85-88_Types-Testing.md)

### Related Documents
- [Group-E Document 01 - Store Setup & Core Stores](../Group-E_Store-State-Management/01_Tasks-61-70_Store-Setup-Core-Stores.md)
- [Group-D Document 01 - Component Library Foundation](../Group-D_Component-Library/01_Tasks-45-52_Component-Foundation.md)
- [SubPhase-01 Group-F Overview](00_GROUP_OVERVIEW.md)

---

## Document Overview

This document covers the implementation of core utility functions for the LankaCommerce Cloud webstore. These utilities provide essential functionality for currency formatting with Sri Lankan Rupee (LKR) support, URL generation for products and categories, discount calculations, cart total computations with Sri Lankan tax rules, and stock level checking. All utilities are designed to support Sri Lankan localization requirements including the රු symbol, comma separators for thousands following South Asian numbering conventions, and proper timezone handling for Asia/Colombo.

The utility functions serve as the foundation for presentation logic across the webstore, ensuring consistent formatting, calculation accuracy, and URL structure throughout the application. These functions are pure, testable, and reusable across multiple components and pages.

### Purpose and Scope

**Core Objectives:**
- Implement currency formatting utilities with complete LKR/රු support
- Create price display utilities handling regular prices, sale prices, and price ranges
- Build discount calculation functions for various promotional scenarios
- Develop URL helper functions for SEO-friendly product and category links
- Implement cart calculation utilities with Sri Lankan tax compliance
- Create stock checking utilities for inventory management

**Key Features:**
- Sri Lankan locale support (en-LK, Asia/Colombo timezone)
- LKR currency formatting with රු symbol and proper thousand separators
- Flexible URL generation supporting slugs, filters, and pagination
- Accurate discount and tax calculations following Sri Lankan regulations
- Stock level checking with configurable thresholds
- Pure functions for testability and reusability

### Tasks Summary

| Task | Name | Dependencies | Est. Time | Complexity |
|------|------|--------------|-----------|------------|
| **77** | Create Currency Formatter | Tasks 61-76 | 30 min | Low |
| **78** | Create Price Display Utility | Task 77 | 30 min | Low |
| **79** | Create Discount Calculator | Task 77 | 30 min | Low |
| **80** | Create Image URL Helper | Tasks 61-76 | 20 min | Low |
| **81** | Create Product URL Helper | Tasks 61-76 | 30 min | Low |
| **82** | Create Category URL Helper | Task 81 | 30 min | Low |
| **83** | Create Cart Total Calculator | Tasks 77, 79 | 1 hour | Medium |
| **84** | Create Stock Checker Utility | Tasks 61-76 | 20 min | Low |

### Group-F Architecture Overview

```
Store Utility Functions Architecture
=====================================

┌─────────────────────────────────────────────────────────────┐
│                    Utility Functions Layer                   │
└─────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
┌──────────────────┐  ┌──────────────┐  ┌─────────────────┐
│  Currency Utils  │  │   URL Utils  │  │ Calculation Utils│
├──────────────────┤  ├──────────────┤  ├─────────────────┤
│ • formatCurrency │  │ • getImageUrl│  │ • calculateDisc │
│ • formatPrice    │  │ • getProduct │  │ • calculateTax  │
│ • displayPrice   │  │ • getCategory│  │ • calculateTotal│
└──────────────────┘  └──────────────┘  └─────────────────┘
          │                   │                   │
          └───────────────────┼───────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Components & Pages (Consumers)                  │
│  ProductCard, PriceDisplay, Cart, Checkout, CategoryPage    │
└─────────────────────────────────────────────────────────────┘
```

---

## Task 77: Create Currency Formatter

**Estimated Time:** 30 minutes  
**Complexity:** Low  
**Dependencies:** Tasks 61-76 (Store State Management)

### Overview

Create a comprehensive currency formatting utility that handles Sri Lankan Rupee (LKR) display with proper localization support. The formatter must support the රු symbol, apply comma separators following South Asian numbering conventions (lakhs and crores), and provide flexible formatting options for different display contexts. This utility serves as the foundation for all monetary value displays throughout the webstore.

### Dependencies and Prerequisites

**Required Completion:**
- Task 61-70: Core store implementation for configuration access
- Task 71-76: Store query capabilities for currency settings

**Technical Prerequisites:**
- TypeScript utility module structure
- Understanding of JavaScript Intl.NumberFormat API
- Knowledge of South Asian numbering systems
- Sri Lankan currency formatting conventions

**Configuration Requirements:**
- Default currency set to LKR
- Locale configuration for en-LK
- Decimal precision settings (2 decimals standard)
- Symbol position preferences (prefix රු)

### Instructions

1. **Create Currency Utilities File Structure**
   - Create file at `lib/utils/currency.ts` in the webstore project
   - Import necessary type definitions for currency formatting options
   - Define TypeScript interfaces for format options and configuration
   - Set up constants for LKR currency code, locale, and symbol

2. **Define Currency Formatting Options Interface**
   - Create interface for format options including currency code
   - Add options for symbol display (symbol, code, both, none)
   - Include decimal places option with default of 2
   - Add flag for showing/hiding decimal places for whole numbers
   - Include option for using native රු symbol vs. "Rs." prefix
   - Add compact notation option for large numbers (K, M notations)

3. **Implement Base Currency Formatter Function**
   - Create main formatCurrency function accepting amount and options
   - Handle null/undefined amounts by returning default display (e.g., "රු 0.00")
   - Implement number validation and parsing for various input types
   - Apply locale-specific formatting using Intl.NumberFormat
   - Support en-LK locale as primary with fallbacks

4. **Add Sri Lankan Numbering Conventions**
   - Implement comma placement for lakhs and crores (1,00,000 style)
   - Configure grouping separators for South Asian format
   - Add logic to handle both international and South Asian conventions
   - Provide option to toggle between numbering systems
   - Ensure proper separator placement for amounts above 100,000

5. **Implement Symbol Rendering Logic**
   - Add function to prepend රු symbol with proper spacing
   - Create fallback to "Rs." or "LKR" based on options
   - Implement symbol position control (prefix/suffix)
   - Add narrow space (U+202F) between symbol and amount
   - Handle symbol rendering for zero and negative amounts

6. **Add Compact Number Formatting**
   - Implement shorthand notation for large numbers (e.g., රු 1.2L for lakhs)
   - Support million (M), thousand (K), lakh (L), crore (C) notations
   - Add threshold configuration for when to use compact format
   - Ensure precision is maintained with compact notation
   - Provide option to disable compact formatting

7. **Create Decimal Handling Functions**
   - Implement smart decimal display hiding .00 for whole numbers
   - Add rounding logic for precision control (round half up)
   - Create function to force decimal display when required
   - Handle very small amounts (< 0.01) with appropriate precision
   - Add option for ceil/floor rounding in specific contexts

8. **Add Negative Amount Formatting**
   - Implement parentheses notation for negative amounts (රු (100.00))
   - Add minus sign prefix option as alternative
   - Create color coding hints (return additional metadata)
   - Ensure consistent symbol placement with negative numbers
   - Add option to hide negative amounts or show as zero

9. **Create Helper Functions**
   - Build formatLKR shorthand function with LKR defaults
   - Create formatCompactCurrency for abbreviated displays
   - Add parseCurrency function to convert formatted strings back to numbers
   - Implement isCurrencyValid validation function
   - Create formatCurrencyRange for min-max price displays

10. **Add Currency Conversion Support**
    - Create structure for multi-currency support (future USD, EUR)
    - Implement conversion rate configuration access
    - Add convertCurrency function with rate lookup
    - Build formatWithConversion for displaying alternative currencies
    - Ensure LKR remains primary with others as reference

11. **Implement Configuration Integration**
    - Access currency settings from store configuration
    - Retrieve locale preferences from user or system settings
    - Pull symbol preferences from store customization
    - Implement fallback defaults when configuration unavailable
    - Add caching for performance optimization

12. **Add Documentation and Exports**
    - Document all function signatures with JSDoc comments
    - Include usage examples for common scenarios
    - Export all public functions and interfaces
    - Create type definitions for options objects
    - Add inline comments explaining Sri Lankan conventions

### Expected Outcome

**Deliverables:**
- Complete currency.ts utility module with all formatting functions
- TypeScript interfaces for formatting options and configurations
- formatCurrency main function with comprehensive option support
- Helper functions: formatLKR, formatCompactCurrency, parseCurrency
- Currency conversion support structure (prepared for multi-currency)
- Comprehensive JSDoc documentation with examples

**Function Signatures:**

| Function | Parameters | Return Type | Description |
|----------|-----------|-------------|-------------|
| `formatCurrency` | `amount: number, options?: FormatOptions` | `string` | Main formatter with full options |
| `formatLKR` | `amount: number, decimals?: boolean` | `string` | Quick LKR formatter |
| `formatCompactCurrency` | `amount: number, options?: CompactOptions` | `string` | Abbreviated format (K, L, M) |
| `parseCurrency` | `formatted: string` | `number` | Parse formatted string to number |
| `formatCurrencyRange` | `min: number, max: number, options?: FormatOptions` | `string` | Format price range |
| `convertCurrency` | `amount: number, fromCode: string, toCode: string` | `number` | Convert between currencies |

**Technical Specifications:**
- Pure functions with no side effects for testability
- Support for amounts from 0.01 to 999,999,999,999
- Default precision of 2 decimal places for LKR
- Locale-aware formatting using Intl.NumberFormat
- Performance-optimized with minimal string operations

**Integration Points:**
- Used by price display components throughout webstore
- Integrated with cart total calculations
- Applied in checkout payment summaries
- Utilized in product listing price displays
- Connected to admin price input formatting

### Verification Checklist

**Format Accuracy:**
- [ ] Verify රු symbol displays correctly with proper Unicode
- [ ] Confirm comma separators follow South Asian convention (1,00,000)
- [ ] Test decimal precision with 0, 1, 2 decimal places
- [ ] Validate whole number display hides .00 when option set
- [ ] Check negative amounts format with parentheses correctly

**Locale Support:**
- [ ] Verify en-LK locale applies proper formatting rules
- [ ] Test fallback behavior when locale not available
- [ ] Confirm Asia/Colombo timezone considerations (if applicable)
- [ ] Validate thousand separator placement for lakhs/crores
- [ ] Test with various numeric input types (string, number, bigint)

**Edge Cases:**
- [ ] Test with zero amount displays as රු 0.00
- [ ] Verify very large numbers (> 10 crores) format correctly
- [ ] Check very small amounts (< 1 rupee) show proper decimals
- [ ] Test null/undefined inputs return safe defaults
- [ ] Validate NaN inputs are handled gracefully

**Functionality:**
- [ ] Confirm compact notation works for lakhs (L) and millions (M)
- [ ] Test parseCurrency accurately reverses formatting
- [ ] Verify currency range formatting shows min-max correctly
- [ ] Check configuration integration retrieves store settings
- [ ] Validate all exported functions have proper TypeScript types

---

## Task 78: Create Price Display Utility

**Estimated Time:** 30 minutes  
**Complexity:** Low  
**Dependencies:** Task 77 (Currency Formatter)

### Overview

Build a specialized price display utility that handles various product pricing scenarios including regular prices, sale prices, price ranges, and special cases like free items. This utility builds upon the currency formatter to provide rich price display logic with visual indicators for discounts, strikethrough styling for original prices, and percentage savings calculations. It ensures consistent price presentation across all product displays in the webstore.

### Dependencies and Prerequisites

**Required Completion:**
- Task 77: Currency formatter must be functional
- Tasks 61-70: Product store for price data access
- Tasks 71-76: Query utilities for product pricing

**Technical Prerequisites:**
- Understanding of product pricing models (regular, sale, variant pricing)
- Knowledge of discount display best practices
- Familiarity with price range calculations
- CSS class naming conventions for styling hooks

**Data Requirements:**
- Product objects with regular_price and sale_price fields
- Variant pricing data for products with options
- Discount percentage calculations
- Free item identification logic

### Instructions

1. **Create Price Display Utilities File**
   - Create file at `lib/utils/price.ts` in the webstore project
   - Import formatCurrency and related functions from currency utility
   - Define TypeScript interfaces for price display options
   - Set up types for price data structures (Product, Variant pricing)

2. **Define Price Display Options Interface**
   - Create interface for display options including show/hide elements
   - Add flag for displaying original price when on sale
   - Include option for showing discount percentage
   - Add configuration for displaying "Free" text vs රු 0.00
   - Include CSS class prefix option for styling hooks
   - Add compact mode flag for condensed displays

3. **Implement Main Price Display Function**
   - Create displayPrice function accepting price data and options
   - Handle null/undefined prices with appropriate defaults
   - Determine if product is on sale by comparing regular vs sale price
   - Return object with formatted strings and metadata
   - Include boolean flags: isOnSale, isFree, hasRange
   - Add CSS class suggestions for styling

4. **Add Sale Price Logic**
   - Implement detection of sale pricing (sale_price < regular_price)
   - Calculate discount percentage: ((regular - sale) / regular) × 100
   - Format both regular and sale prices with proper styling indicators
   - Add metadata for strikethrough application on regular price
   - Ensure minimum discount threshold (e.g., only show if > 5%)
   - Handle edge case where sale_price equals regular_price

5. **Create Price Range Formatting**
   - Implement formatPriceRange for min-max pricing scenarios
   - Handle products with variants having different prices
   - Calculate minimum and maximum prices from variant array
   - Display as "රු X - රු Y" with proper formatting
   - Add option to show "From රු X" for starting price only
   - Ensure range only displays when min ≠ max

6. **Implement Free Item Display**
   - Create logic to detect free items (price === 0 or price === null with free flag)
   - Return "Free" text instead of රු 0.00 based on options
   - Add localization support for "Free" label translation
   - Provide option to show original price with "Free" label
   - Handle free samples vs truly free products differently

7. **Add Discount Badge Generator**
   - Create getDiscountBadge function returning percentage string
   - Format as "-X%" for discount badges
   - Add rounding logic for clean percentages (e.g., -15% not -14.73%)
   - Provide option for absolute savings amount instead (Save රු X)
   - Include color coding suggestions (red, green based on discount level)

8. **Build Strikethrough Price Formatter**
   - Create formatStrikethroughPrice for original prices on sale
   - Add CSS class hint for strikethrough styling
   - Ensure proper spacing between original and sale price
   - Provide option to show in parentheses: (Was රු X)
   - Add accessibility text for screen readers

9. **Implement Price Comparison Utility**
   - Create comparePrices function to determine better deal
   - Calculate effective price per unit for quantity-based comparisons
   - Build getBestDeal function comparing multiple variants
   - Add logic to identify cheapest option with quality considerations
   - Return comparison metadata for display

10. **Add Special Price Labels**
    - Implement getSpecialLabel for promotional pricing
    - Support labels: "Clearance", "Limited Offer", "Today Only"
    - Add expiration awareness for time-sensitive deals
    - Create urgency indicators for ending soon promotions
    - Integrate with product metadata for label source

11. **Create Price Summary Function**
    - Build getPriceSummary returning comprehensive price object
    - Include all formatted strings: display, original, badge
    - Add calculated fields: savings amount, discount percentage
    - Provide CSS class recommendations for container styling
    - Include accessibility labels for screen reader support

12. **Add Documentation and Export**
    - Document all functions with JSDoc including examples
    - Provide usage scenarios for common price displays
    - Export all utility functions and type definitions
    - Add inline comments for complex logic
    - Create type guards for price validation

### Expected Outcome

**Deliverables:**
- Complete price.ts utility module with display functions
- TypeScript interfaces for price options and return types
- displayPrice main function with comprehensive formatting
- Helper functions: formatPriceRange, getDiscountBadge, formatStrikethroughPrice
- Price comparison utilities for variant analysis
- Full JSDoc documentation with usage examples

**Function Signatures:**

| Function | Parameters | Return Type | Description |
|----------|-----------|-------------|-------------|
| `displayPrice` | `priceData: PriceData, options?: DisplayOptions` | `PriceDisplay` | Main price formatter with metadata |
| `formatPriceRange` | `minPrice: number, maxPrice: number, options?: RangeOptions` | `string` | Format price range display |
| `getDiscountBadge` | `regularPrice: number, salePrice: number` | `string` | Generate discount percentage badge |
| `formatStrikethroughPrice` | `price: number` | `PriceStrikethrough` | Format with styling hints |
| `getPriceSummary` | `product: Product, options?: SummaryOptions` | `PriceSummary` | Complete price information object |
| `isFree` | `priceData: PriceData` | `boolean` | Check if item is free |

**Return Type Structures:**

```typescript
PriceDisplay {
  displayPrice: string           // Main formatted price
  originalPrice?: string         // Strikethrough price if on sale
  discountBadge?: string        // "-X%" discount label
  isOnSale: boolean             // Sale status flag
  isFree: boolean               // Free item flag
  hasRange: boolean             // Price range present
  cssClasses: string[]          // Recommended classes
  ariaLabel: string             // Accessibility label
}
```

**Integration Points:**
- ProductCard component for listing displays
- ProductDetail page for full price breakdown
- Cart items showing individual price calculations
- Checkout summary for order total context
- Price filter components in search/category pages

### Verification Checklist

**Display Accuracy:**
- [ ] Verify sale prices show with original price struck through
- [ ] Confirm discount percentage calculates correctly
- [ ] Test "Free" displays instead of රු 0.00 when appropriate
- [ ] Validate price ranges show min-max correctly
- [ ] Check spacing and formatting between price elements

**Sale Price Logic:**
- [ ] Test sale detection when sale_price < regular_price
- [ ] Verify no sale indication when prices equal
- [ ] Confirm discount badge only shows for significant discounts (> 5%)
- [ ] Test edge case of very small discounts (< 1 rupee)
- [ ] Validate percentage rounding for clean display

**Price Ranges:**
- [ ] Test range displays only when min ≠ max
- [ ] Verify "From රු X" option works correctly
- [ ] Confirm range formats with proper currency symbols
- [ ] Test with identical min/max showing single price
- [ ] Validate variant price extraction and sorting

**Special Cases:**
- [ ] Test free items display "Free" text correctly
- [ ] Verify zero price handling matches expectations
- [ ] Check null/undefined price handling
- [ ] Test products with no sale_price field
- [ ] Validate promotional label display logic

**Accessibility:**
- [ ] Confirm CSS classes provided for styling hooks
- [ ] Verify ARIA labels include complete price information
- [ ] Test screen reader output for sale prices
- [ ] Check color contrast recommendations for discount badges
- [ ] Validate semantic HTML structure suggestions

---

## Task 79: Create Discount Calculator

**Estimated Time:** 30 minutes  
**Complexity:** Low  
**Dependencies:** Task 77 (Currency Formatter)

### Overview

Develop a comprehensive discount calculation utility supporting various promotional scenarios including percentage discounts, fixed amount discounts, bulk purchase discounts, and tiered pricing. This utility provides accurate calculation functions used throughout the cart, checkout, and promotional display systems. All calculations maintain precision to avoid rounding errors and support Sri Lankan pricing conventions.

### Dependencies and Prerequisites

**Required Completion:**
- Task 77: Currency formatter for discount displays
- Tasks 61-70: Product and cart stores for data access

**Technical Prerequisites:**
- Understanding of discount calculation methods
- Knowledge of floating-point arithmetic precision issues
- Familiarity with promotional discount rules
- Tax calculation interaction awareness

**Business Rules:**
- Discounts applied before tax calculations
- Minimum order requirements for certain discounts
- Maximum discount caps on percentage-based promotions
- Stackability rules for multiple discounts

### Instructions

1. **Create Discount Utilities File**
   - Create file at `lib/utils/discount.ts` in the webstore project
   - Import currency formatting utilities for display
   - Define TypeScript interfaces for discount types and rules
   - Set up enums for discount types (PERCENTAGE, FIXED, BUY_X_GET_Y)

2. **Define Discount Configuration Interfaces**
   - Create DiscountRule interface with type and value fields
   - Add MinimumRequirement interface for threshold rules
   - Include DiscountResult interface for calculation returns
   - Define StackingRules interface for multiple discount handling
   - Add validation rules interface for discount constraints

3. **Implement Percentage Discount Calculator**
   - Create calculatePercentageDiscount function accepting amount and percentage
   - Validate percentage is between 0 and 100
   - Calculate discount: (amount × percentage) / 100
   - Round to 2 decimal places using precise rounding
   - Return both discount amount and final price after discount
   - Add maximum discount cap enforcement

4. **Create Fixed Amount Discount Calculator**
   - Implement calculateFixedDiscount with amount and discount value
   - Ensure discount doesn't exceed original amount
   - Handle case where discount > amount (apply partial)
   - Return discount amount and final price
   - Add minimum purchase requirement validation
   - Prevent negative final prices

5. **Build Discount Percentage Calculator**
   - Create calculateDiscountPercentage to determine savings percentage
   - Accept original price and discounted price
   - Calculate: ((original - discounted) / original) × 100
   - Round to 2 decimal places for display
   - Handle edge cases (zero prices, invalid inputs)
   - Return formatted percentage string

6. **Implement Save Amount Calculator**
   - Create calculateSaveAmount determining absolute savings
   - Accept original and sale prices
   - Calculate simple difference: original - sale
   - Format with currency utility
   - Add validation for valid price ranges
   - Return both numeric and formatted string

7. **Add Apply Discount Function**
   - Create applyDiscount function applying discount rule to amount
   - Accept discount rule object and original amount
   - Route to appropriate calculator based on discount type
   - Apply any minimum/maximum constraints
   - Return comprehensive DiscountResult object
   - Include metadata for display (percentage, amount, type)

8. **Implement Bulk Discount Calculator**
   - Create calculateBulkDiscount for quantity-based discounts
   - Accept quantity, unit price, and tier rules
   - Determine applicable tier based on quantity
   - Calculate total with tiered pricing applied
   - Return per-unit effective price and total savings
   - Support progressive tiers (different rates per tier)

9. **Build Buy X Get Y Discount Calculator**
   - Implement calculateBuyXGetY for promotional offers
   - Accept quantity, unit price, buy count, get count
   - Calculate number of free items: (quantity / (X + Y)) × Y
   - Compute discount value based on free items
   - Return total price with discount and free item count
   - Handle remainders (e.g., buy 5 when rule is buy 2 get 1)

10. **Create Stacked Discount Calculator**
    - Build calculateStackedDiscounts for multiple promotions
    - Accept array of discount rules and original amount
    - Apply discounts in specified order (percentage first typically)
    - Calculate cumulative savings and final price
    - Track each discount application for transparency
    - Enforce stacking rules and maximum combined discount limits

11. **Add Discount Validation Functions**
    - Create isDiscountValid checking rule against constraints
    - Implement meetsMinimumRequirement for threshold validation
    - Build canStackWith checking compatibility between discounts
    - Add isExpired checking date-based discount validity
    - Create getDiscountEligibility determining applicability

12. **Implement Helper and Display Functions**
    - Create formatDiscountValue formatting discount for display
    - Build getDiscountSummary generating human-readable description
    - Implement compareDiscounts finding best discount option
    - Add calculateMaxDiscount determining highest possible savings
    - Create discount priority sorter for optimal application order

### Expected Outcome

**Deliverables:**
- Complete discount.ts utility module with calculation functions
- TypeScript interfaces for discount rules and results
- Multiple calculator functions for different discount types
- Stacked discount support with rule enforcement
- Validation utilities for discount applicability
- Comprehensive JSDoc documentation

**Function Signatures:**

| Function | Parameters | Return Type | Description |
|----------|-----------|-------------|-------------|
| `calculatePercentageDiscount` | `amount: number, percentage: number` | `DiscountResult` | Calculate percentage-based discount |
| `calculateFixedDiscount` | `amount: number, discount: number` | `DiscountResult` | Apply fixed amount discount |
| `calculateDiscountPercentage` | `original: number, discounted: number` | `number` | Get discount percentage |
| `calculateSaveAmount` | `original: number, sale: number` | `number` | Calculate savings amount |
| `applyDiscount` | `rule: DiscountRule, amount: number` | `DiscountResult` | Apply discount rule to amount |
| `calculateBulkDiscount` | `quantity: number, unitPrice: number, tiers: TierRule[]` | `BulkDiscountResult` | Calculate tiered bulk discount |
| `calculateBuyXGetY` | `quantity: number, unitPrice: number, buyX: number, getY: number` | `PromoResult` | Calculate BOGO-style discount |
| `calculateStackedDiscounts` | `rules: DiscountRule[], amount: number` | `StackedResult` | Apply multiple discounts |

**Discount Flow:**

```
Discount Application Flow
==========================

┌─────────────────┐
│ Original Amount │
│   රු 10,000     │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  1. Validate Discount Rules     │
│     - Check expiration          │
│     - Verify min requirements   │
│     - Check stackability        │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  2. Apply Primary Discount      │
│     - Calculate by type         │
│     - Apply constraints         │
│     - Track savings             │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  3. Apply Stackable Discounts   │
│     - Check stacking rules      │
│     - Apply in priority order   │
│     - Cumulative calculation    │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  4. Apply Maximum Caps          │
│     - Check max discount limit  │
│     - Ensure min final price    │
│     - Round to precision        │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────┐
│  Final Price    │
│   රු 7,500      │
│  (25% savings)  │
└─────────────────┘
```

**Integration Points:**
- Cart store for calculating item-level discounts
- Checkout flow for coupon code application
- Product pages showing promotional savings
- Order summary displaying discount breakdown
- Admin reporting for discount effectiveness analysis

### Verification Checklist

**Calculation Accuracy:**
- [ ] Verify percentage discounts calculate precisely
- [ ] Confirm fixed amount discounts don't exceed original price
- [ ] Test discount percentage calculation with edge cases
- [ ] Validate save amount returns correct difference
- [ ] Check rounding maintains 2 decimal precision

**Discount Types:**
- [ ] Test percentage-based discounts (5%, 10%, 50% off)
- [ ] Verify fixed amount discounts (රු 100 off, රු 500 off)
- [ ] Confirm bulk discounts apply correct tier rates
- [ ] Test Buy X Get Y calculations with various quantities
- [ ] Validate complex promotional scenarios

**Stacking Logic:**
- [ ] Test multiple discounts apply in correct order
- [ ] Verify stacking rules enforce correctly
- [ ] Confirm maximum combined discount respected
- [ ] Test non-stackable discounts only apply best one
- [ ] Validate cumulative savings tracking

**Edge Cases:**
- [ ] Test discount equals or exceeds original amount
- [ ] Verify zero amount inputs handled gracefully
- [ ] Check negative discount inputs rejected
- [ ] Test minimum requirements enforcement
- [ ] Validate expired discount rejection

**Validation:**
- [ ] Confirm discount validation catches invalid rules
- [ ] Test minimum requirement checking works correctly
- [ ] Verify eligibility checks return accurate results
- [ ] Check stacking compatibility detection
- [ ] Validate date-based expiration logic

---

## Task 80: Create Image URL Helper

**Estimated Time:** 20 minutes  
**Complexity:** Low  
**Dependencies:** Tasks 61-76 (Store State Management)

### Overview

Implement an image URL utility that generates properly formatted URLs for product images, category images, and other media assets. This utility supports multiple image sizes (thumbnail, medium, large, original), CDN integration, fallback image handling, and responsive image srcset generation. It ensures optimal image delivery across different devices and contexts while maintaining consistent URL structure throughout the webstore.

### Dependencies and Prerequisites

**Required Completion:**
- Tasks 61-70: Configuration store for CDN and media settings
- Tasks 71-76: Asset management query utilities

**Technical Prerequisites:**
- Understanding of image optimization strategies
- Knowledge of responsive image techniques (srcset, sizes)
- Familiarity with CDN URL structures
- Image format awareness (WebP, JPEG, PNG)

**Configuration Requirements:**
- CDN base URL configuration
- Image size definitions (dimensions for thumb, medium, large)
- Default fallback image paths
- Image format preferences

### Instructions

1. **Create Image URL Utilities File**
   - Create file at `lib/utils/image.ts` in the webstore project
   - Import configuration store for CDN and media settings
   - Define TypeScript enums for image sizes
   - Set up constants for default image paths and dimensions

2. **Define Image Configuration Interfaces**
   - Create ImageSize enum: THUMBNAIL, MEDIUM, LARGE, ORIGINAL
   - Define ImageOptions interface with size, format, quality parameters
   - Add ResponsiveImageSet interface for srcset generation
   - Include FallbackOptions for error handling
   - Create ImageDimensions interface mapping sizes to dimensions

3. **Implement Base URL Generator**
   - Create getBaseImageUrl function retrieving CDN base URL
   - Fallback to local storage URL if CDN unavailable
   - Add environment detection (development vs production)
   - Ensure trailing slash handling for consistent paths
   - Support multiple CDN providers (Cloudflare, AWS CloudFront)

4. **Create Main Image URL Function**
   - Implement getImageUrl accepting image path and options
   - Handle null/undefined paths returning fallback image
   - Construct full URL combining base URL and image path
   - Apply size transformations based on options
   - Add query parameters for format and quality if supported

5. **Add Size-Specific URL Generators**
   - Create getThumbnailUrl shorthand for thumbnail size
   - Implement getMediumUrl for medium-sized images
   - Build getLargeUrl for large display images
   - Add getOriginalUrl returning unmodified image URL
   - Ensure consistent parameter passing to main function

6. **Implement CDN Transformation Support**
   - Add buildCDNTransformations for CDN-specific URL modifications
   - Support Cloudflare Images transformation syntax
   - Implement AWS CloudFront resize parameters
   - Add ImageKit transformation URL building
   - Fallback to original URL if CDN doesn't support transforms

7. **Create Responsive Image Set Generator**
   - Build getResponsiveImageSet generating srcset attribute value
   - Accept base image path and size multipliers (1x, 2x, 3x)
   - Generate URLs for each pixel density
   - Format as proper srcset string: "url 1x, url 2x, url 3x"
   - Add sizes attribute suggestion based on breakpoints

8. **Add Fallback Image Handling**
   - Implement getFallbackImageUrl for missing images
   - Support category-specific fallbacks (product, user avatar, category)
   - Return placeholder images with appropriate sizing
   - Add option for SVG placeholders vs static images
   - Ensure fallback images always resolve successfully

9. **Create Image Validation Function**
   - Build isValidImageUrl checking URL format validity
   - Verify allowed file extensions (jpg, jpeg, png, webp, svg)
   - Check URL protocol (https required for CDN)
   - Validate CDN domain matches configuration
   - Return boolean indicating valid image URL

10. **Implement Format Optimization**
    - Create getOptimalFormat determining best image format
    - Check browser support for WebP and AVIF
    - Fallback to JPEG for older browsers
    - Add PNG preservation for transparency requirements
    - Build format query parameter appending logic

11. **Add Image Dimension Helpers**
    - Create getImageDimensions returning width/height for size
    - Implement predefined dimension mappings (thumb: 200x200, etc.)
    - Build aspectRatio calculator for responsive layouts
    - Add getDimensionsFromUrl extracting size from URL
    - Support custom dimension overrides

12. **Create Image Loading Utilities**
    - Implement getImageLoadingStrategy suggesting eager/lazy loading
    - Build preloadImage function for critical above-fold images
    - Add priority determination logic based on position
    - Create blur placeholder data URL generator
    - Support progressive image loading indicators

### Expected Outcome

**Deliverables:**
- Complete image.ts utility module with URL generation
- TypeScript interfaces and enums for image handling
- getImageUrl main function with full option support
- Size-specific shorthand functions (getThumbnailUrl, etc.)
- Responsive image set generator for srcset attributes
- Fallback image handling with category-specific defaults
- CDN transformation support for multiple providers

**Function Signatures:**

| Function | Parameters | Return Type | Description |
|----------|-----------|-------------|-------------|
| `getImageUrl` | `path: string, options?: ImageOptions` | `string` | Main image URL generator |
| `getThumbnailUrl` | `path: string` | `string` | Generate thumbnail URL |
| `getMediumUrl` | `path: string` | `string` | Generate medium size URL |
| `getLargeUrl` | `path: string` | `string` | Generate large size URL |
| `getResponsiveImageSet` | `path: string, multipliers?: number[]` | `ResponsiveImageSet` | Generate srcset data |
| `getFallbackImageUrl` | `category?: string` | `string` | Get placeholder image |
| `isValidImageUrl` | `url: string` | `boolean` | Validate image URL format |

**Image Size Mappings:**

| Size | Dimensions | Use Case | CDN Transform |
|------|-----------|----------|---------------|
| **THUMBNAIL** | 200×200 | Product grid, cart items | `/cdn-cgi/image/width=200,height=200,fit=cover` |
| **MEDIUM** | 600×600 | Product quick view, mobile detail | `/cdn-cgi/image/width=600,height=600,fit=cover` |
| **LARGE** | 1200×1200 | Desktop product detail, zoom | `/cdn-cgi/image/width=1200,height=1200,fit=contain` |
| **ORIGINAL** | As uploaded | Download, print quality | No transformation |

**Integration Points:**
- ProductCard components for listing images
- ProductImage component with zoom functionality
- Category pages showing category banner images
- User profile displaying avatars
- Cart showing product thumbnails

### Verification Checklist

**URL Generation:**
- [ ] Verify getImageUrl constructs valid URLs with CDN base
- [ ] Confirm size-specific functions apply correct transformations
- [ ] Test null/undefined paths return fallback images
- [ ] Validate query parameters append correctly for CDN
- [ ] Check environment-based URL differences (dev vs prod)

**CDN Integration:**
- [ ] Test Cloudflare Images transformation syntax works
- [ ] Verify AWS CloudFront parameters format correctly
- [ ] Confirm fallback to original URL when CDN unavailable
- [ ] Test CDN domain validation matches configuration
- [ ] Validate HTTPS protocol enforcement

**Responsive Images:**
- [ ] Test srcset generation for 1x, 2x, 3x densities
- [ ] Verify sizes attribute suggestions are appropriate
- [ ] Confirm responsive set works with different base sizes
- [ ] Test format optimization detects browser capabilities
- [ ] Validate WebP fallback to JPEG for older browsers

**Fallback Handling:**
- [ ] Test missing image returns appropriate placeholder
- [ ] Verify category-specific fallbacks work correctly
- [ ] Confirm SVG placeholders render properly
- [ ] Test fallback images always load successfully
- [ ] Validate fallback dimensions match requested size

**Validation:**
- [ ] Test image URL validation catches invalid formats
- [ ] Verify allowed extensions filter works correctly
- [ ] Confirm invalid protocols rejected
- [ ] Test dimension extraction from URLs
- [ ] Validate aspect ratio calculations are accurate

---

## Task 81: Create Product URL Helper

**Estimated Time:** 30 minutes  
**Complexity:** Low  
**Dependencies:** Tasks 61-76 (Store State Management)

### Overview

Develop a comprehensive product URL generation utility that creates SEO-friendly URLs for product pages, product listings, and filtered/sorted product views. This utility ensures consistent URL structure, proper slug formatting, query parameter handling for filters and pagination, and canonical URL generation. All URLs follow best practices for Sri Lankan e-commerce SEO with support for Sinhala and Tamil language characters in slugs.

### Dependencies and Prerequisites

**Required Completion:**
- Tasks 61-70: Product store for product data access
- Tasks 71-76: Query utilities for product filters

**Technical Prerequisites:**
- Understanding of URL encoding and slug generation
- Knowledge of SEO best practices for e-commerce URLs
- Familiarity with query string parameter handling
- Route structure awareness for Next.js or chosen framework

**URL Structure Requirements:**
- Product detail: `/product/{slug}` or `/product/{id}/{slug}`
- Product listing: `/products` with query parameters
- Category products: `/category/{category-slug}/products`
- Search results: `/search?q={query}`

### Instructions

1. **Create Product URL Utilities File**
   - Create file at `lib/utils/product-url.ts` in the webstore project
   - Import necessary types for Product, Filter, Sort options
   - Define TypeScript interfaces for URL generation options
   - Set up constants for base paths and default parameters

2. **Define URL Configuration Interfaces**
   - Create ProductUrlOptions interface with ID and slug fields
   - Define FilterParams interface for filter query parameters
   - Add SortParams interface for sorting options
   - Include PaginationParams for page and limit parameters
   - Create CanonicalUrlOptions for SEO canonical generation

3. **Implement Slug Generator**
   - Create generateSlug function converting product names to URLs
   - Normalize Unicode characters (Sinhala, Tamil) to ASCII where appropriate
   - Replace spaces with hyphens, remove special characters
   - Convert to lowercase for consistency
   - Handle duplicate slugs with numeric suffixes
   - Ensure slug length limits (max 100 characters)

4. **Create Main Product URL Function**
   - Implement getProductUrl accepting product object or ID/slug
   - Construct URL following pattern: `/product/{slug}` or `/product/{id}/{slug}`
   - Add optional variant parameters for specific product options
   - Include utm parameters if provided in options
   - Return absolute URL if base URL configured, relative otherwise

5. **Build Product Listing URL Generator**
   - Create getProductsUrl for listing page URLs
   - Accept filter parameters (category, price range, brand, etc.)
   - Convert filters to query string format
   - Add sorting parameters (sort_by, order)
   - Include pagination parameters (page, limit)
   - Ensure parameter order consistency for caching

6. **Add Filter Parameter Serialization**
   - Implement serializeFilters converting filter object to query string
   - Handle array parameters (multiple categories, brands)
   - Format price range as `price_min` and `price_max`
   - Add support for custom attribute filters
   - URL-encode parameter values properly
   - Remove default values to keep URLs clean

7. **Create Category Product URL Generator**
   - Build getCategoryProductsUrl combining category and filters
   - Construct URL pattern: `/category/{category-slug}/products`
   - Append filter and sort query parameters
   - Add pagination support
   - Ensure category slug is valid and formatted
   - Include breadcrumb trail parameters if needed

8. **Implement Search URL Generator**
   - Create getSearchUrl for search result pages
   - Accept search query and filter parameters
   - Construct URL: `/search?q={encoded-query}`
   - Add filters as additional query parameters
   - Support search suggestions and autocomplete URLs
   - Handle empty/invalid search queries

9. **Add Variant URL Parameters**
   - Implement addVariantParams appending variant selections
   - Format as query parameters: `?color=red&size=large`
   - Support multiple variant attributes
   - Ensure parameter names match variant attribute slugs
   - Add option for hash-based variants: `#variant-123`
   - Handle pre-selected variant deep linking

10. **Create Query Parameter Builders**
    - Build buildQueryString helper for consistent parameter formatting
    - Implement parseQueryString for extracting parameters
    - Create updateQueryParams for modifying existing URLs
    - Add removeQueryParam for filter removal
    - Support merging new parameters with existing ones
    - Maintain parameter order for consistent hashing

11. **Implement Canonical URL Generator**
    - Create getCanonicalProductUrl for SEO canonical tags
    - Strip tracking parameters (utm_*, fbclid, etc.)
    - Remove pagination parameters from canonical
    - Sort query parameters alphabetically
    - Convert relative URLs to absolute with domain
    - Handle multi-variant products (canonical to base product)

12. **Add URL Validation and Helpers**
    - Implement isValidProductUrl checking URL format
    - Create extractSlugFromUrl parsing slug from URL
    - Build getProductIdFromUrl extracting product ID
    - Add getUrlVariantParams parsing variant selections
    - Create compareUrls checking if URLs point to same resource

### Expected Outcome

**Deliverables:**
- Complete product-url.ts utility module with generation functions
- TypeScript interfaces for URL options and parameters
- getProductUrl main function with variant support
- Product listing URL generator with filter serialization
- Category and search URL generators
- Canonical URL generation for SEO
- Query parameter manipulation utilities

**Function Signatures:**

| Function | Parameters | Return Type | Description |
|----------|-----------|-------------|-------------|
| `getProductUrl` | `product: Product \| {id, slug}, options?: ProductUrlOptions` | `string` | Generate product detail URL |
| `getProductsUrl` | `filters?: FilterParams, sort?: SortParams, pagination?: PaginationParams` | `string` | Generate listing URL with filters |
| `getCategoryProductsUrl` | `categorySlug: string, filters?: FilterParams` | `string` | Category product listing URL |
| `getSearchUrl` | `query: string, filters?: FilterParams` | `string` | Search results URL |
| `generateSlug` | `name: string` | `string` | Convert name to URL slug |
| `getCanonicalProductUrl` | `product: Product` | `string` | Generate canonical URL |
| `serializeFilters` | `filters: FilterParams` | `string` | Convert filters to query string |

**URL Structure Examples:**

```
Product URLs
============

Simple Product:
/product/apple-iphone-15-pro-max

Product with ID:
/product/123/apple-iphone-15-pro-max

Product with Variants:
/product/samsung-galaxy-s24?color=blue&storage=256gb

Listing URLs
============

All Products:
/products

Filtered Products:
/products?category=smartphones&brand=apple&price_min=50000&price_max=150000

Sorted & Paginated:
/products?sort_by=price&order=asc&page=2&limit=24

Category URLs
=============

Category Products:
/category/electronics/smartphones

Category with Filters:
/category/electronics?brand=samsung&price_max=100000

Search URLs
===========

Basic Search:
/search?q=laptop

Search with Filters:
/search?q=laptop&category=computers&price_max=200000
```

**Integration Points:**
- Product links in navigation and listings
- Filter sidebar updating URL on selection
- Pagination components generating page links
- SEO metadata using canonical URLs
- Share functionality copying product URLs

### Verification Checklist

**Slug Generation:**
- [ ] Verify slugs convert to lowercase and replace spaces with hyphens
- [ ] Confirm special characters are removed or normalized
- [ ] Test Unicode support for Sinhala/Tamil product names
- [ ] Validate duplicate slug handling with numeric suffixes
- [ ] Check slug length limits enforced (max 100 chars)

**URL Construction:**
- [ ] Test product URL format matches expected pattern
- [ ] Verify variant parameters append correctly
- [ ] Confirm listing URLs include all filter parameters
- [ ] Test category URLs combine path and query parameters
- [ ] Validate search URLs encode query strings properly

**Filter Serialization:**
- [ ] Test array parameters serialize correctly (multiple values)
- [ ] Verify price range formats as min/max parameters
- [ ] Confirm default values omitted from query string
- [ ] Test URL encoding of special characters in filters
- [ ] Validate empty filters produce clean URLs without parameters

**Canonical URLs:**
- [ ] Test canonical URLs strip tracking parameters
- [ ] Verify pagination removed from canonical
- [ ] Confirm parameters sorted alphabetically
- [ ] Test relative to absolute URL conversion
- [ ] Validate variant products canonical to base product

**Edge Cases:**
- [ ] Test null/undefined product objects handled gracefully
- [ ] Verify empty filter objects produce base URLs
- [ ] Check invalid category slugs handled properly
- [ ] Test very long product names truncated correctly
- [ ] Validate special characters in search queries encoded

---

## Task 82: Create Category URL Helper

**Estimated Time:** 30 minutes  
**Complexity:** Low  
**Dependencies:** Task 81 (Product URL Helper)

### Overview

Build a comprehensive category URL generation utility that creates SEO-friendly URLs for category pages, category hierarchies, and breadcrumb navigation. This utility handles nested categories, generates proper breadcrumb trails, creates URLs with inherited filters, and supports both flat and hierarchical category structures. It ensures consistent category URL formatting across the webstore with proper slug handling and query parameter management.

### Dependencies and Prerequisites

**Required Completion:**
- Task 81: Product URL helper for shared URL utilities
- Tasks 61-70: Category store for hierarchy data
- Tasks 71-76: Query utilities for category filtering

**Technical Prerequisites:**
- Understanding of hierarchical data structures
- Knowledge of breadcrumb navigation patterns
- Familiarity with nested route handling
- SEO best practices for category pages

**Category Structure:**
- Support flat categories (single level)
- Support nested categories (parent/child relationships)
- Handle category trees (multiple levels deep)
- Manage category aliases and redirects

### Instructions

1. **Create Category URL Utilities File**
   - Create file at `lib/utils/category-url.ts` in the webstore project
   - Import necessary types for Category, Breadcrumb structures
   - Define TypeScript interfaces for category URL options
   - Set up constants for category path patterns

2. **Define Category URL Interfaces**
   - Create CategoryUrlOptions interface with slug and hierarchy
   - Define BreadcrumbItem interface with name, url, and position
   - Add CategoryPathOptions for path generation configurations
   - Include CategoryFilterOptions for filtered category views
   - Create RedirectOptions for category alias handling

3. **Implement Category Slug Generator**
   - Create generateCategorySlug converting category names to slugs
   - Apply same normalization as product slugs (lowercase, hyphens)
   - Handle parent category prefixes for nested categories
   - Ensure unique slugs within same parent level
   - Support manual slug overrides from category data
   - Maintain slug history for redirect management

4. **Create Main Category URL Function**
   - Implement getCategoryUrl accepting category object or slug
   - Construct URL following pattern: `/category/{slug}` or `/shop/{slug}`
   - Support hierarchical URLs: `/category/parent-slug/child-slug`
   - Add optional filter and sort parameters
   - Return absolute or relative URL based on configuration
   - Handle category aliases resolving to canonical URLs

5. **Build Hierarchical Category Path Generator**
   - Create getCategoryPath generating full path for nested categories
   - Traverse parent relationships to build complete path
   - Format as array of slug segments or single URL string
   - Handle circular references in category data
   - Add maximum depth limit (e.g., 5 levels) for safety
   - Cache path calculations for performance

6. **Implement Breadcrumb Generator**
   - Create getCategoryBreadcrumbs generating navigation trail
   - Start with home/root and build through hierarchy
   - Include category name, URL, and position for each item
   - Add structured data hints for SEO (schema.org/BreadcrumbList)
   - Handle missing parent categories gracefully
   - Support custom breadcrumb labels different from category names

7. **Add Parent Category URL Function**
   - Build getParentCategoryUrl navigating up one level
   - Handle root categories returning shop/home URL
   - Maintain filter context when moving to parent
   - Support "View All in Parent" use case
   - Return null if already at root level

8. **Create Child Categories URL Generator**
   - Implement getChildCategoriesUrl for listing subcategories
   - Accept parent category and generate child listing
   - Support different views: grid, list, featured children
   - Add filter for showing only categories with products
   - Include product counts in URL parameters if needed

9. **Build Category Filter URL Functions**
   - Create addCategoryFilter appending filter to category URL
   - Implement removeCategoryFilter stripping specific filter
   - Build clearCategoryFilters removing all filters but keeping category
   - Support filter inheritance from parent categories
   - Maintain sort order when modifying filters

10. **Implement Category Comparison Functions**
    - Create isChildOf checking if category is child of another
    - Build isDescendantOf checking any level of nesting
    - Implement getCategoryDepth calculating nesting level
    - Add getCommonAncestor finding shared parent
    - Create isInCategoryPath checking if category in current path

11. **Add Category Redirect Handling**
    - Implement getCanonicalCategoryUrl for SEO canonical tags
    - Create resolveCategoryAlias mapping old slugs to new ones
    - Build category redirect chain resolution
    - Add support for merged categories (multiple slugs, one category)
    - Handle deleted category redirects to parent or alternative

12. **Create Category URL Validation**
    - Build isValidCategoryUrl checking URL format validity
    - Implement extractCategorySlug parsing slug from URL
    - Create getCategoryFromUrl resolving category object from URL
    - Add validateCategoryPath checking all segments exist
    - Build category slug uniqueness checker

### Expected Outcome

**Deliverables:**
- Complete category-url.ts utility module with generation functions
- TypeScript interfaces for category URLs and breadcrumbs
- getCategoryUrl main function with hierarchy support
- Breadcrumb generation with structured data hints
- Category hierarchy navigation utilities
- Filter management for category URLs
- Redirect and alias resolution functions

**Function Signatures:**

| Function | Parameters | Return Type | Description |
|----------|-----------|-------------|-------------|
| `getCategoryUrl` | `category: Category \| string, options?: CategoryUrlOptions` | `string` | Generate category page URL |
| `getCategoryPath` | `category: Category` | `string[]` | Get hierarchical path segments |
| `getCategoryBreadcrumbs` | `category: Category, includeHome?: boolean` | `BreadcrumbItem[]` | Generate breadcrumb trail |
| `getParentCategoryUrl` | `category: Category` | `string \| null` | Get parent category URL |
| `isChildOf` | `child: Category, parent: Category` | `boolean` | Check parent-child relation |
| `getCanonicalCategoryUrl` | `category: Category` | `string` | Generate canonical URL |
| `generateCategorySlug` | `name: string, parent?: Category` | `string` | Convert name to URL slug |

**Category URL Patterns:**

```
Category URL Structures
========================

Flat Category:
/category/smartphones
/shop/electronics

Hierarchical Category:
/category/electronics/smartphones
/category/electronics/smartphones/android

Category with Filters:
/category/smartphones?brand=apple&price_max=150000

Breadcrumb Navigation:
Home > Electronics > Smartphones > Android

Structured Data:
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "/"},
    {"@type": "ListItem", "position": 2, "name": "Electronics", "item": "/category/electronics"},
    {"@type": "ListItem", "position": 3, "name": "Smartphones", "item": "/category/electronics/smartphones"}
  ]
}
```

**Breadcrumb Example Structure:**

```
Category Hierarchy and Breadcrumbs
===================================

Category Tree:
├── Electronics (id: 1, slug: electronics)
│   ├── Smartphones (id: 10, slug: smartphones, parent: 1)
│   │   ├── Android (id: 100, slug: android, parent: 10)
│   │   └── iOS (id: 101, slug: ios, parent: 10)
│   └── Laptops (id: 11, slug: laptops, parent: 1)
└── Fashion (id: 2, slug: fashion)

Breadcrumbs for Android:
┌──────┬─────────────┬────────────────────────────────────────┬──────────┐
│ Pos  │    Name     │                  URL                   │   Type   │
├──────┼─────────────┼────────────────────────────────────────┼──────────┤
│  1   │    Home     │ /                                      │   root   │
│  2   │ Electronics │ /category/electronics                  │  parent  │
│  3   │ Smartphones │ /category/electronics/smartphones      │  parent  │
│  4   │   Android   │ /category/electronics/smartphones/...  │  current │
└──────┴─────────────┴────────────────────────────────────────┴──────────┘
```

**Integration Points:**
- Category navigation menus (mega menu, sidebar)
- Breadcrumb components on product and category pages
- SEO metadata generation (canonical, structured data)
- Category filter sidebar maintaining context
- Category management admin interface

### Verification Checklist

**URL Generation:**
- [ ] Verify category URLs follow expected pattern structure
- [ ] Confirm hierarchical categories build complete path
- [ ] Test flat categories generate simple single-segment URLs
- [ ] Validate filter parameters append correctly to category URLs
- [ ] Check absolute vs relative URL generation based on config

**Breadcrumbs:**
- [ ] Test breadcrumb generation includes all hierarchy levels
- [ ] Verify home/root item appears first in breadcrumb trail
- [ ] Confirm current category marked appropriately in trail
- [ ] Test structured data format matches schema.org spec
- [ ] Validate breadcrumb URLs navigate correctly

**Hierarchy Navigation:**
- [ ] Test parent URL navigation moves up one level correctly
- [ ] Verify child category listing generates proper URLs
- [ ] Confirm isChildOf and isDescendantOf logic works correctly
- [ ] Test circular reference detection prevents infinite loops
- [ ] Validate maximum depth limit enforced

**Slug Generation:**
- [ ] Test category slug normalization matches product slug logic
- [ ] Verify parent prefixes apply correctly for nested categories
- [ ] Confirm duplicate slug handling within same parent
- [ ] Test Unicode character handling for Sinhala/Tamil names
- [ ] Validate manual slug overrides respected

**Edge Cases:**
- [ ] Test root category (no parent) handled correctly
- [ ] Verify deleted parent categories don't break breadcrumbs
- [ ] Check orphaned categories (parent missing) handled gracefully
- [ ] Test very deep nesting (>5 levels) respects limits
- [ ] Validate empty category names generate fallback slugs

---

## Task 83: Create Cart Total Calculator

**Estimated Time:** 1 hour  
**Complexity:** Medium  
**Dependencies:** Tasks 77 (Currency Formatter), 79 (Discount Calculator)

### Overview

Develop a comprehensive cart total calculation utility that computes all financial aspects of a shopping cart including subtotals, item totals, discounts, taxes following Sri Lankan regulations, shipping costs, and final totals. This utility must handle complex scenarios like tiered shipping rates, tax exemptions, multi-item discounts, and coupon codes while maintaining precision and providing detailed breakdowns for display in cart and checkout interfaces.

### Dependencies and Prerequisites

**Required Completion:**
- Task 77: Currency formatter for displaying calculated amounts
- Task 79: Discount calculator for applying promotions
- Tasks 61-70: Cart store for cart data access
- Tasks 71-76: Query utilities for pricing rules

**Technical Prerequisites:**
- Understanding of Sri Lankan VAT tax system (8% standard rate)
- Knowledge of tax calculation rules and exemptions
- Familiarity with shipping cost calculation methods
- Precision arithmetic to avoid rounding errors

**Business Rules:**
- VAT (8%) applied to most products
- Some items exempt from VAT (essentials, books, etc.)
- Shipping calculated by weight, zone, or order value
- Free shipping threshold configurable per store
- Discounts applied before tax calculation
- Multiple discount stacking rules enforced

### Instructions

1. **Create Cart Calculator Utilities File**
   - Create file at `lib/utils/cart-calculator.ts` in the webstore project
   - Import currency formatter and discount calculator
   - Define TypeScript interfaces for cart calculation results
   - Set up constants for tax rates and calculation parameters

2. **Define Cart Calculation Interfaces**
   - Create CartItem interface with product, quantity, price fields
   - Define CartTotals interface with all calculated amounts
   - Add TaxCalculation interface with rate, amount, breakdown
   - Include ShippingCalculation interface with method and cost
   - Create DiscountApplication interface tracking applied discounts
   - Add CalculationOptions for controlling calculation behavior

3. **Implement Item Total Calculator**
   - Create calculateItemTotal for individual cart item
   - Multiply unit price by quantity with precision
   - Apply item-level discounts if present
   - Handle variant pricing differences
   - Account for custom price adjustments
   - Return both regular and discounted item totals

4. **Build Subtotal Calculator**
   - Implement calculateSubtotal summing all item totals
   - Iterate through cart items calculating each total
   - Apply item-level discounts first
   - Sum all discounted item amounts
   - Return object with subtotal before and after item discounts
   - Include item count and weight totals for shipping

5. **Create Tax Calculator**
   - Build calculateTax implementing Sri Lankan VAT rules
   - Apply 8% VAT rate to taxable items
   - Identify tax-exempt items from product metadata
   - Calculate tax on discounted prices (after discount, before shipping)
   - Support different tax classes (standard, reduced, exempt)
   - Return detailed tax breakdown by rate and item

6. **Implement Shipping Cost Calculator**
   - Create calculateShipping determining shipping charges
   - Support multiple calculation methods: flat rate, weight-based, value-based
   - Implement zone-based shipping for different regions
   - Check free shipping threshold and apply when qualified
   - Handle multiple shipping methods (standard, express, pickup)
   - Return shipping cost with method details

7. **Build Order-Level Discount Applicator**
   - Implement applyOrderDiscounts for cart-wide promotions
   - Handle coupon codes with validation
   - Apply minimum purchase requirements
   - Calculate percentage and fixed amount discounts
   - Enforce maximum discount limits
   - Track multiple discount applications with priority

8. **Create Total Calculator**
   - Build calculateTotal computing final cart total
   - Sum subtotal + tax + shipping - discounts
   - Apply order-level discounts after subtotal calculation
   - Recalculate tax if needed after discounts
   - Ensure non-negative total (minimum 0)
   - Return comprehensive total breakdown

9. **Implement Calculation Orchestrator**
   - Create calculateCartTotals main function orchestrating all calculations
   - Accept cart items array and calculation options
   - Execute calculations in correct order: items → subtotal → discounts → tax → shipping → total
   - Handle empty cart returning zero totals
   - Apply business rules and constraints throughout
   - Return complete CartTotals object with all breakdowns

10. **Add Tax Breakdown Generator**
    - Build getTaxBreakdown detailing tax by rate and category
    - Group items by tax class
    - Calculate tax for each group
    - Sum total tax amount
    - Format breakdown for display in checkout summary
    - Include tax-exempt item notice if applicable

11. **Create Savings Calculator**
    - Implement calculateTotalSavings summing all discounts
    - Include item-level discount savings
    - Add order-level discount savings
    - Calculate shipping savings if free shipping applied
    - Format total savings amount for prominent display
    - Calculate savings percentage relative to original prices

12. **Add Cart Summary Generator**
    - Build getCartSummary generating display-ready summary
    - Format all monetary values with currency utility
    - Include item count and total weight
    - Add estimated delivery date based on shipping method
    - Provide cart action hints (e.g., "Add රු 500 for free shipping")
    - Generate human-readable discount descriptions

### Expected Outcome

**Deliverables:**
- Complete cart-calculator.ts utility module with calculation functions
- TypeScript interfaces for cart totals and breakdowns
- calculateCartTotals main orchestrator function
- Individual calculators: item, subtotal, tax, shipping, discount
- Tax breakdown with Sri Lankan VAT compliance
- Comprehensive cart summary generation
- Savings calculation and display formatting

**Function Signatures:**

| Function | Parameters | Return Type | Description |
|----------|-----------|-------------|-------------|
| `calculateItemTotal` | `item: CartItem` | `number` | Calculate single item total |
| `calculateSubtotal` | `items: CartItem[]` | `number` | Sum all item totals |
| `calculateTax` | `subtotal: number, items: CartItem[]` | `TaxCalculation` | Calculate VAT and other taxes |
| `calculateShipping` | `weight: number, zone: string, subtotal: number` | `ShippingCalculation` | Determine shipping cost |
| `calculateTotal` | `subtotal: number, tax: number, shipping: number, discounts: number` | `number` | Compute final total |
| `calculateCartTotals` | `items: CartItem[], options?: CalculationOptions` | `CartTotals` | Orchestrate all calculations |
| `getTaxBreakdown` | `items: CartItem[]` | `TaxBreakdown` | Generate tax detail breakdown |
| `calculateTotalSavings` | `totals: CartTotals` | `number` | Sum all discount savings |

**Cart Totals Structure:**

```typescript
CartTotals {
  // Item Calculations
  itemCount: number              // Total items in cart
  totalWeight: number            // Total weight for shipping
  
  // Price Calculations
  subtotal: number               // Sum of all items before discounts
  subtotalAfterItemDiscounts: number  // After item-level discounts
  
  // Discount Calculations
  itemDiscounts: number          // Sum of item-level discounts
  orderDiscounts: number         // Cart-level discount amount
  totalDiscounts: number         // All discounts combined
  
  // Tax Calculations
  taxableAmount: number          // Amount subject to tax
  taxAmount: number              // Total VAT/tax
  taxRate: number                // Effective tax rate (%)
  taxBreakdown: TaxBreakdown     // Detailed tax by rate
  
  // Shipping Calculations
  shippingCost: number           // Calculated shipping charge
  shippingMethod: string         // Selected shipping method
  freeShippingThreshold?: number // Amount to reach free shipping
  
  // Final Total
  total: number                  // Final amount to pay
  
  // Savings
  totalSavings: number           // Total amount saved
  savingsPercentage: number      // Savings as percentage
  
  // Formatted Strings (for display)
  formatted: {
    subtotal: string
    discounts: string
    tax: string
    shipping: string
    total: string
    savings: string
  }
}
```

**Calculation Flow:**

```
Cart Total Calculation Flow
============================

┌─────────────────────┐
│   Cart Items (3)    │
│  Item A: රු 1,000   │
│  Item B: රු 2,500   │
│  Item C: රු 500     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  Step 1: Calculate Item Totals      │
│  • Apply item discounts              │
│  • Sum quantities                    │
│  Result: Subtotal = රු 4,000        │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  Step 2: Apply Order Discounts      │
│  • Validate coupon codes             │
│  • Apply cart-level promotions       │
│  Result: -රු 400 (10% off)          │
│  New Subtotal: රු 3,600             │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  Step 3: Calculate Tax (8% VAT)     │
│  • Identify taxable items            │
│  • Apply 8% to taxable amount        │
│  Result: Tax = රු 288               │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  Step 4: Calculate Shipping         │
│  • Weight: 2.5 kg                    │
│  • Zone: Colombo                     │
│  • Method: Standard                  │
│  Result: Shipping = රු 250          │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  Step 5: Calculate Final Total      │
│  Subtotal:  රු 3,600                │
│  Tax:       රු 288                   │
│  Shipping:  රු 250                   │
│  ─────────────────────              │
│  TOTAL:     රු 4,138                │
│  (Saved: රු 400)                    │
└─────────────────────────────────────┘
```

**Integration Points:**
- Cart page displaying totals and breakdown
- Checkout summary showing detailed calculation
- Cart widget in header showing quick total
- Order confirmation showing final amounts
- Invoice generation with tax details

### Verification Checklist

**Calculation Accuracy:**
- [ ] Verify subtotal sums all item totals correctly
- [ ] Confirm tax calculates at 8% on taxable items
- [ ] Test item discounts apply before order discounts
- [ ] Validate shipping calculation follows business rules
- [ ] Check final total matches manual calculation

**Tax Compliance:**
- [ ] Test 8% VAT applies to standard rate items
- [ ] Verify tax-exempt items excluded from tax calculation
- [ ] Confirm tax calculated on discounted prices
- [ ] Test tax breakdown groups items correctly
- [ ] Validate tax rounding follows regulations (round half up)

**Discount Application:**
- [ ] Test item-level discounts apply per item
- [ ] Verify order-level discounts apply to subtotal
- [ ] Confirm coupon codes validate before application
- [ ] Test minimum purchase requirements enforced
- [ ] Validate maximum discount caps respected

**Shipping Calculation:**
- [ ] Test free shipping threshold triggers correctly
- [ ] Verify weight-based shipping calculates accurately
- [ ] Confirm zone-based rates apply for different regions
- [ ] Test multiple shipping method options
- [ ] Validate shipping never negative

**Edge Cases:**
- [ ] Test empty cart returns zero totals
- [ ] Verify single item cart calculates correctly
- [ ] Check very large quantities don't overflow
- [ ] Test cart with all free items
- [ ] Validate cart with all tax-exempt items
- [ ] Test maximum discount exceeding subtotal caps at subtotal

**Precision:**
- [ ] Verify all calculations maintain 2 decimal precision
- [ ] Test rounding consistency across all calculations
- [ ] Confirm no precision loss in repeated calculations
- [ ] Validate total never shows more than 2 decimal places
- [ ] Test very small amounts (< 1 rupee) handled correctly

---

## Task 84: Create Stock Checker Utility

**Estimated Time:** 20 minutes  
**Complexity:** Low  
**Dependencies:** Tasks 61-76 (Store State Management)

### Overview

Implement a stock checking utility that determines product availability, stock levels, and appropriate stock status messages. This utility provides functions to check if items are in stock, determine stock level categories (in stock, low stock, out of stock), and generate customer-facing messages about availability. It supports inventory tracking, backorder management, and low stock threshold alerts for both display and operational purposes.

### Dependencies and Prerequisites

**Required Completion:**
- Tasks 61-70: Product store for inventory data access
- Tasks 71-76: Inventory query utilities

**Technical Prerequisites:**
- Understanding of inventory management concepts
- Knowledge of stock level thresholds
- Familiarity with backorder and preorder functionality
- Configuration management for stock settings

**Business Rules:**
- Low stock threshold (e.g., ≤ 5 units)
- Out of stock when quantity = 0 or null
- Support backorders for out of stock items (if enabled)
- Show estimated restock dates when available
- Consider reserved quantities (in carts, pending orders)

### Instructions

1. **Create Stock Utilities File**
   - Create file at `lib/utils/stock.ts` in the webstore project
   - Import product and inventory types
   - Define TypeScript enums for stock status
   - Set up constants for stock level thresholds

2. **Define Stock Status Enums and Interfaces**
   - Create StockStatus enum: IN_STOCK, LOW_STOCK, OUT_OF_STOCK, BACKORDERED, PREORDER
   - Define StockLevel interface with quantity and reserved fields
   - Add StockCheck interface with status and availability details
   - Include StockMessage interface for display messages
   - Create StockThreshold interface for configurable limits

3. **Implement Basic Stock Checker**
   - Create isInStock function checking if product available
   - Accept product object or inventory level as parameter
   - Return true if quantity > 0 (or > reserved quantity)
   - Handle null/undefined quantities as out of stock
   - Consider backorder flag (in stock if backorders enabled)
   - Support variant-level stock checking

4. **Add Stock Level Retriever**
   - Implement getStockLevel returning numeric inventory quantity
   - Accept product object with inventory data
   - Return available quantity (total - reserved)
   - Handle variant stock levels separately
   - Return 0 for out of stock or unavailable products
   - Support "unlimited" stock for digital products

5. **Create Stock Status Determiner**
   - Build getStockStatus returning StockStatus enum value
   - Check quantity against thresholds: 0, low stock limit, unlimited
   - Return OUT_OF_STOCK if quantity = 0 and no backorders
   - Return LOW_STOCK if quantity ≤ threshold (e.g., 5)
   - Return IN_STOCK if quantity > threshold
   - Return BACKORDERED if out of stock but backorders enabled
   - Return PREORDER if product has future availability date

6. **Implement Stock Message Generator**
   - Create getStockMessage generating customer-facing text
   - Return appropriate message based on stock status:
     - In Stock: "In Stock" or "Only X left"
     - Low Stock: "Only X remaining"
     - Out of Stock: "Out of Stock"
     - Backordered: "Available for backorder"
     - Preorder: "Pre-order now, ships {date}"
   - Support internationalization for message translations
   - Add urgency messaging for low stock

7. **Add Available Quantity Calculator**
   - Build getAvailableQuantity calculating purchasable amount
   - Subtract reserved quantities from total stock
   - Account for pending orders and active carts
   - Return maximum quantity customer can add to cart
   - Handle negative results as 0 (oversold situations)
   - Support maximum per-order quantity limits

8. **Create Stock Threshold Checker**
   - Implement isLowStock checking if below threshold
   - Accept product and threshold configuration
   - Return true if quantity ≤ threshold and > 0
   - Support custom thresholds per product or category
   - Handle variant-specific low stock checks

9. **Build Restock Information Provider**
   - Create getRestockInfo returning expected availability details
   - Check for restock_date field in product data
   - Return estimated date when product will be available
   - Format as human-readable text: "Back in stock on {date}"
   - Return null if no restock information available
   - Support "Notify Me" functionality trigger

10. **Add Multi-Variant Stock Checker**
    - Implement checkVariantsStock for products with variants
    - Return object with stock status per variant
    - Identify if any variant is in stock
    - Calculate total available units across all variants
    - Provide variant-specific stock messages
    - Support variant combination stock checking (size + color)

11. **Create Cart Addition Validator**
    - Build canAddToCart checking if quantity can be added
    - Accept desired quantity and current cart quantity
    - Verify total doesn't exceed available stock
    - Check maximum per-order limits
    - Return boolean with reason message if false
    - Support "add what's available" functionality

12. **Implement Stock Display Helper**
    - Create getStockDisplay generating display-ready stock info
    - Return object with status, message, badge color, icon suggestion
    - Provide CSS class recommendations for styling
    - Include accessibility labels for screen readers
    - Add urgency level (high, medium, low) for UI emphasis
    - Generate structured data for product availability schema

### Expected Outcome

**Deliverables:**
- Complete stock.ts utility module with checking functions
- TypeScript enums and interfaces for stock status
- isInStock main availability checker
- Stock status determination with multiple states
- Customer-facing message generation
- Variant-level stock checking support
- Cart addition validation logic

**Function Signatures:**

| Function | Parameters | Return Type | Description |
|----------|-----------|-------------|-------------|
| `isInStock` | `product: Product \| quantity: number` | `boolean` | Check if product available |
| `getStockLevel` | `product: Product` | `number` | Get available quantity |
| `getStockStatus` | `product: Product, threshold?: number` | `StockStatus` | Determine stock status |
| `getStockMessage` | `status: StockStatus, quantity?: number` | `string` | Generate display message |
| `getAvailableQuantity` | `product: Product` | `number` | Calculate purchasable amount |
| `isLowStock` | `product: Product, threshold?: number` | `boolean` | Check if below threshold |
| `canAddToCart` | `product: Product, quantity: number, cartQuantity: number` | `{canAdd: boolean, reason?: string}` | Validate cart addition |
| `getStockDisplay` | `product: Product` | `StockDisplay` | Get complete display info |

**Stock Status Values and Messages:**

| Status | Condition | Message Example | Badge Color | Display Priority |
|--------|-----------|-----------------|-------------|------------------|
| **IN_STOCK** | quantity > threshold | "In Stock" | Green | Normal |
| **LOW_STOCK** | quantity ≤ threshold & > 0 | "Only 3 left" | Orange | High |
| **OUT_OF_STOCK** | quantity = 0, no backorder | "Out of Stock" | Red | Highest |
| **BACKORDERED** | quantity = 0, backorder enabled | "Available for backorder" | Blue | Medium |
| **PREORDER** | future availability date set | "Pre-order, ships Feb 15" | Purple | Medium |

**Stock Check Flow:**

```
Stock Availability Check Flow
==============================

┌─────────────────┐
│ Product Request │
│   quantity: ?   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Get Current Stock Level            │
│  • Total inventory: 100             │
│  • Reserved (carts): 15             │
│  • Reserved (orders): 10            │
│  Available = 100 - 15 - 10 = 75    │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Check Against Thresholds           │
│  • Low stock: 5                      │
│  • Available: 75                     │
│  • Status: IN_STOCK ✓               │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Validate Requested Quantity        │
│  • Requested: 10                     │
│  • Available: 75                     │
│  • Can fulfill: YES ✓               │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Generate Display Message           │
│  Status: "In Stock"                  │
│  Badge: Green                        │
│  Can Add to Cart: YES               │
└─────────────────────────────────────┘
```

**Integration Points:**
- Product cards showing stock badges
- Product detail page availability section
- Cart validation on item addition
- Checkout stock verification
- Low stock alerts in admin dashboard

### Verification Checklist

**Basic Functionality:**
- [ ] Verify isInStock returns true for positive quantities
- [ ] Confirm getStockLevel returns correct available amount
- [ ] Test getStockStatus identifies all status types correctly
- [ ] Validate stock messages display appropriate text
- [ ] Check reserved quantities subtracted from available stock

**Status Detection:**
- [ ] Test IN_STOCK status for quantities above threshold
- [ ] Verify LOW_STOCK triggers at configured threshold
- [ ] Confirm OUT_OF_STOCK when quantity = 0
- [ ] Test BACKORDERED status when backorders enabled
- [ ] Validate PREORDER status with future availability dates

**Edge Cases:**
- [ ] Test null/undefined quantity handled as out of stock
- [ ] Verify negative quantities (oversold) return 0 available
- [ ] Check unlimited stock (digital products) never shows low/out
- [ ] Test reserved > total inventory handled correctly
- [ ] Validate variant-level stock independent from parent

**Cart Validation:**
- [ ] Test canAddToCart prevents over-purchasing
- [ ] Verify maximum per-order limits enforced
- [ ] Confirm quantity + cart quantity checked against available
- [ ] Test partial availability suggestions
- [ ] Validate backorder quantities allowed when enabled

**Display Generation:**
- [ ] Test stock messages match status correctly
- [ ] Verify badge colors appropriate for each status
- [ ] Confirm urgency levels set correctly
- [ ] Test CSS class suggestions provided
- [ ] Validate accessibility labels generated

---

## Summary

This document has covered the implementation of eight core utility functions (Tasks 77-84) for the LankaCommerce Cloud webstore. These utilities provide essential functionality across the entire e-commerce platform, ensuring consistent formatting, accurate calculations, and proper URL structures throughout the application.

### Tasks Completed

**Tasks 77-84 Overview:**
- ✅ **Task 77:** Currency Formatter - LKR/රු formatting with South Asian numbering
- ✅ **Task 78:** Price Display Utility - Sale prices, ranges, discount badges
- ✅ **Task 79:** Discount Calculator - Percentage, fixed, bulk, and stacked discounts
- ✅ **Task 80:** Image URL Helper - Multi-size URLs with CDN support
- ✅ **Task 81:** Product URL Helper - SEO-friendly product and listing URLs
- ✅ **Task 82:** Category URL Helper - Hierarchical URLs and breadcrumbs
- ✅ **Task 83:** Cart Total Calculator - Complete cart calculations with Sri Lankan VAT
- ✅ **Task 84:** Stock Checker Utility - Availability and stock status management

### Key Deliverables

**Utility Modules Created:**
- `lib/utils/currency.ts` - Currency formatting and display
- `lib/utils/price.ts` - Price presentation logic
- `lib/utils/discount.ts` - Discount calculations
- `lib/utils/image.ts` - Image URL generation
- `lib/utils/product-url.ts` - Product URL management
- `lib/utils/category-url.ts` - Category URL and breadcrumb generation
- `lib/utils/cart-calculator.ts` - Cart financial calculations
- `lib/utils/stock.ts` - Inventory and availability checking

**Sri Lankan Localization Features:**
- LKR (රු) currency symbol with proper formatting
- South Asian numbering system (lakhs, crores)
- 8% VAT tax calculation compliance
- en-LK locale support
- Asia/Colombo timezone awareness
- +94 phone number formatting support (prepared)

**Technical Achievements:**
- Pure, testable utility functions with no side effects
- Comprehensive TypeScript interfaces and type safety
- Precision arithmetic preventing rounding errors
- Performance-optimized with minimal overhead
- Extensive edge case handling
- Full JSDoc documentation

### Integration Points

**Component Integration:**
- Product display components using price and image utilities
- Cart and checkout using calculation utilities
- Navigation components using URL helpers
- Filter and sort components using query parameter utilities
- SEO components using canonical URL generators

**Store Integration:**
- Configuration store providing settings for utilities
- Product store supplying data for calculations
- Cart store using total calculation utilities
- Category store feeding URL and breadcrumb generation

**External Integration:**
- CDN services for optimized image delivery
- Payment gateways receiving calculated totals
- Tax reporting systems using calculation breakdowns
- SEO tools consuming structured data

### Testing Considerations

**Unit Testing Requirements:**
- Test all utility functions with comprehensive input variations
- Validate edge cases: null, undefined, zero, negative, very large numbers
- Verify Sri Lankan localization formatting accuracy
- Test precision maintenance in all calculations
- Validate URL encoding and special character handling

**Integration Testing:**
- Test utility functions with real product and cart data
- Verify calculation accuracy matches business rules
- Test CDN URL generation with actual image paths
- Validate SEO URL structures with routing framework
- Test currency formatting across all display contexts

**Performance Testing:**
- Measure execution time for cart calculations with large carts
- Test URL generation performance with deep category hierarchies
- Validate image URL caching effectiveness
- Benchmark discount calculation with multiple stacked discounts

### Next Steps

**Immediate Next Actions:**
1. Proceed to [Group-F Document 02](02_Tasks-85-88_Types-Testing.md) for TypeScript types and testing setup
2. Implement comprehensive unit tests for all utility functions
3. Create integration tests with store systems
4. Set up E2E tests for user-facing workflows using utilities
5. Document usage examples and best practices

**Upcoming Development:**
- **Group-F Document 02 (Tasks 85-88):** TypeScript type definitions and testing framework
- **Group-G:** API integration utilities for backend communication
- **Group-H:** Advanced utilities for analytics, tracking, and reporting

**Quality Assurance:**
- Code review focusing on calculation accuracy
- Tax calculation validation with accounting team
- URL structure review for SEO best practices
- Performance profiling of utility functions
- Accessibility testing of generated display data

### Sri Lankan Market Alignment

**Compliance and Localization:**
- ✅ LKR currency with රු symbol implementation complete
- ✅ 8% VAT tax calculation ready for Sri Lankan regulations
- ✅ South Asian numbering conventions supported
- ✅ en-LK locale formatting implemented
- ⏳ Sinhala/Tamil language support in URLs prepared (requires further localization)
- ⏳ Phone number formatting (+94) utilities to be added in future group

**Market-Specific Features:**
- Free shipping threshold configuration for competitive positioning
- Tiered pricing support for bulk purchases common in Sri Lanka
- Cash on delivery consideration in payment flow (handled by checkout, not utilities)
- Mobile-first responsive image optimization for Sri Lankan internet speeds
- Efficient URL structures for SEO in Sri Lankan search market

### Documentation and Maintenance

**Developer Documentation:**
- All functions documented with JSDoc comments
- Usage examples provided for common scenarios
- Type definitions exported for IDE autocomplete
- Integration guidelines included in each task section

**Maintenance Plan:**
- Regular updates for tax rate changes (VAT adjustments)
- CDN provider configuration updates as needed
- Currency formatting updates for new localization requirements
- Performance optimization based on usage metrics

**Knowledge Transfer:**
- Utility function architecture documented
- Calculation logic explained with diagrams
- URL structure patterns established
- Sri Lankan localization requirements captured

---

### Document Completion

**Phase 08 - SubPhase 01 - Group F - Document 01: Complete**

This document has provided comprehensive instructions for implementing eight core utility functions essential for the LankaCommerce Cloud webstore. All tasks maintain focus on what to implement rather than how to code, include detailed verification checklists, emphasize Sri Lankan localization, and provide clear integration points.

**Estimated Total Time:** 4.5 hours  
**Complexity:** Low to Medium  
**Tasks Covered:** 77-84 (8 tasks)  
**Lines:** ~990 lines

**Next Document:** [02_Tasks-85-88_Types-Testing.md](02_Tasks-85-88_Types-Testing.md)

---

**Document Navigation:**
- **Previous:** [Group-E Document 02 - Extended Stores & Query Management](../Group-E_Store-State-Management/02_Tasks-71-76_Extended-Stores-Query.md)
- **Next:** [Group-F Document 02 - Types & Testing](02_Tasks-85-88_Types-Testing.md)
- **Parent:** [Group-F Overview](00_GROUP_OVERVIEW.md)
- **Phase:** [Phase-08 Overview](../../00_PHASE_OVERVIEW.md)

---

*Document generated for LankaCommerce Cloud - Sri Lankan Multi-Tenant ERP & E-Commerce Platform*  
*Last Updated: January 2026*
