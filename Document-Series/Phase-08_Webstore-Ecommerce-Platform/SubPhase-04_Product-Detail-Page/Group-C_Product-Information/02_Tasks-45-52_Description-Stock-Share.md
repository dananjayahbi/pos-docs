# Tasks 45-52: Description, Stock Status & Share Buttons

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 04 - Product Detail Page  
> **Group:** C - Product Information  
> **Document:** 02 of 02  
> **Tasks Covered:** 45, 46, 47, 48, 49, 50, 51, 52

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-35-44_Info-Rating-Price.md](01_Tasks-35-44_Info-Rating-Price.md)
- **→ Next Group:** [Group-D_Variant-Cart-Actions](../Group-D_Variant-Cart-Actions/)

---

## Document Overview

This document covers implementation of product short description, stock status indicators with low stock warnings, delivery estimates with free shipping notifications, and social share functionality optimized for Sri Lanka (WhatsApp primary, Facebook secondary).

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 45 | Create Short Description | Low | 20 min |
| 46 | Create Stock Status | Low | 25 min |
| 47 | Create Low Stock Warning | Low | 20 min |
| 48 | Create Delivery Estimate | Low | 30 min |
| 49 | Create Free Shipping Note | Low | 15 min |
| 50 | Create Share Buttons | Low | 25 min |
| 51 | Create WhatsApp Share | Low | 25 min |
| 52 | Create Facebook Share | Low | 20 min |

---

## Task 45: Create Short Description

### Overview
Implement the short product description component that displays a concise overview of the product's key features and benefits. This component supports truncation, expandable text, basic formatting, and provides quick product highlights above the full details tab.

### Dependencies
- Task 35: Product Info Container
- Task 44: Tax Info (appears after)
- Rich text rendering utilities
- Product data types defined

### Instructions

1. **Create short description component file**
   - Navigate to `frontend/components/storefront/product/ProductInfo/` directory
   - Create `ShortDescription.tsx` file
   - Accept description text as prop

2. **Define TypeScript interfaces**
   - Create `ShortDescriptionProps` interface
   - Include description string (required)
   - Add maxLength number (character limit)
   - Include expandable boolean (show more/less)
   - Add sanitized HTML support boolean

3. **Implement text rendering**
   - Display plain text by default
   - Support basic HTML formatting (bold, italic, lists)
   - Sanitize HTML to prevent XSS
   - Preserve line breaks
   - Handle markdown if applicable

4. **Set up truncation logic**
   - Default max length: 200-250 characters
   - Truncate at word boundary (don't cut words)
   - Add ellipsis (...) at truncation point
   - Show "Read more" link if truncated
   - Full text in description tab (Group E)

5. **Implement expand/collapse functionality**
   - "Read more" expands text inline
   - "Read less" collapses back to truncated
   - Toggle state management
   - Smooth height transition
   - Keyboard accessible toggle

6. **Set up styling**
   - Font size: 14-15px
   - Line height: 1.6 (readable spacing)
   - Color: Secondary text (gray-700)
   - Margin: 16px top and bottom
   - Max width for readability

7. **Handle empty state**
   - Hide component if no description
   - Show placeholder in admin mode
   - Graceful degradation
   - No empty container rendered

8. **Add accessibility features**
   - Semantic HTML (paragraph tags)
   - ARIA expanded state for toggle
   - Keyboard navigation for read more
   - Screen reader friendly truncation

### Text Truncation Logic

```
Original: "This premium wireless mouse features ergonomic design, 
          5 programmable buttons, and long battery life perfect 
          for work and gaming." (length: 155)

If maxLength = 100:
Truncated: "This premium wireless mouse features ergonomic design, 
           5 programmable buttons, and long..." + [Read more]

Click "Read more":
Expanded: Full text + [Read less]
```

### Styling Specifications

| Property | Value | Notes |
|----------|-------|-------|
| Font Size | 15px | Slightly larger than small text |
| Line Height | 1.6 | Comfortable reading |
| Color | gray-700 | Secondary text color |
| Margin Top | 16px | Space from price section |
| Margin Bottom | 16px | Space to stock section |
| Max Width | 100% | Full container width |

### Truncation Configuration

| Setting | Value | Reason |
|---------|-------|--------|
| Max Length | 200 characters | 2-3 sentences typical |
| Truncate At | Word boundary | Avoid cutting words |
| Ellipsis | "..." | Standard indication |
| Toggle Link | "Read more" / "Read less" | Clear action |

### HTML Sanitization

Allow these HTML tags for formatting:
- `<b>`, `<strong>` - Bold text
- `<i>`, `<em>` - Italic text
- `<ul>`, `<ol>`, `<li>` - Lists
- `<br>` - Line breaks
- `<p>` - Paragraphs

Block dangerous tags:
- `<script>` - JavaScript
- `<iframe>` - Embedded content
- `<object>`, `<embed>` - External content
- Event handlers (onclick, etc.)

### Expected Outcome
- Concise product description displayed
- Text truncated to 200 characters with ellipsis
- "Read more" expands full text inline
- Supports basic HTML formatting safely
- Proper spacing and typography
- Accessible to screen readers

### Verification Checklist
- [ ] Component renders description text
- [ ] Text truncates at 200 characters
- [ ] Truncation at word boundary (no cut words)
- [ ] "Read more" link appears if truncated
- [ ] Click expands to full text
- [ ] "Read less" collapses back
- [ ] HTML tags rendered safely (if applicable)
- [ ] Empty description hides component
- [ ] Accessibility attributes present
- [ ] TypeScript types correct

---

## Task 46: Create Stock Status

### Overview
Build the stock status indicator component that displays product availability with color-coded visual states. This component shows In Stock, Low Stock, and Out of Stock states, integrates with inventory data, and provides clear availability information to customers.

### Dependencies
- Task 35: Product Info Container
- Task 45: Short Description (appears after)
- Inventory data types defined
- Real-time stock updates (if applicable)

### Instructions

1. **Create stock status component file**
   - Navigate to `frontend/components/storefront/product/ProductInfo/` directory
   - Create `StockStatus.tsx` file
   - Accept stock data as props

2. **Define TypeScript interfaces**
   - Create `StockStatusProps` interface
   - Include stockQuantity number
   - Include inStock boolean
   - Add lowStockThreshold number (default 10)
   - Include backorderAvailable boolean

3. **Implement status determination logic**
   - In Stock: stockQuantity > lowStockThreshold
   - Low Stock: stockQuantity > 0 && <= lowStockThreshold
   - Out of Stock: stockQuantity === 0
   - Pre-order: Special status if applicable
   - Backorder: Available even when out of stock

4. **Set up color-coded indicators**
   - In Stock: Green (green-600)
   - Low Stock: Orange/amber (amber-600)
   - Out of Stock: Red (red-600)
   - Pre-order: Blue (blue-600)
   - Include icon for each state

5. **Implement status text**
   - In Stock: "In Stock"
   - Low Stock: "Only X left in stock" (handled in Task 47)
   - Out of Stock: "Out of Stock"
   - Pre-order: "Pre-order available"
   - Backorder: "Available on backorder"

6. **Add status icon**
   - In Stock: Check circle icon
   - Low Stock: Warning icon
   - Out of Stock: X circle icon
   - Use icon library (Heroicons, FontAwesome)
   - 16-20px size, inline with text

7. **Set up styling**
   - Font size: 14px
   - Font weight: Medium (500-600)
   - Flex layout: icon + text
   - Gap: 6-8px between icon and text
   - Badge style: Can use pill background

8. **Implement real-time updates**
   - Subscribe to stock updates (if WebSocket)
   - Refresh on page focus
   - Update without full page reload
   - Show stale data indicator if needed

### Status Determination Logic

```
stockQuantity = 25
lowStockThreshold = 10

if (stockQuantity > lowStockThreshold) {
  status = "IN_STOCK"
  color = "green"
  text = "In Stock"
} else if (stockQuantity > 0) {
  status = "LOW_STOCK"
  color = "amber"
  text = "Only 25 left in stock"
} else {
  status = "OUT_OF_STOCK"
  color = "red"
  text = "Out of Stock"
}
```

### Status Configuration Table

| Status | Condition | Color | Icon | Text |
|--------|-----------|-------|------|------|
| In Stock | qty > threshold | green-600 | CheckCircle | "In Stock" |
| Low Stock | qty > 0 && <= threshold | amber-600 | Warning | See Task 47 |
| Out of Stock | qty === 0 | red-600 | XCircle | "Out of Stock" |
| Pre-order | preorder flag | blue-600 | Clock | "Pre-order" |
| Backorder | backorder flag | gray-600 | ArrowPath | "Backorder" |

### Styling Specifications

| Property | Value | Tailwind Class |
|----------|-------|----------------|
| Font Size | 14px | text-sm |
| Font Weight | Medium | font-medium |
| Icon Size | 18px | w-5 h-5 |
| Gap | 8px | gap-2 |
| Display | Flex | flex items-center |

### Badge Style Option

Instead of plain text, can use badge/pill style:
- Background: Matching color with opacity (bg-green-100)
- Border: Optional 1px border
- Padding: px-3 py-1
- Border radius: Full rounded pill
- Text color: Darker shade (text-green-800)

### Expected Outcome
- Clear stock status indicator with color coding
- Green for In Stock, amber for Low Stock, red for Out of Stock
- Icon representing stock state
- Proper text messaging for each state
- Real-time updates if stock changes
- Accessible to screen readers

### Verification Checklist
- [ ] Component renders stock status
- [ ] Status determined correctly from quantity
- [ ] In Stock shows green with check icon
- [ ] Low Stock shows amber with warning icon
- [ ] Out of Stock shows red with X icon
- [ ] Text accurate for each status
- [ ] Color coding consistent
- [ ] Icon size and alignment correct
- [ ] Accessible to screen readers
- [ ] TypeScript types correct

---

## Task 47: Create Low Stock Warning

### Overview
Implement the low stock warning component that displays prominent notification when product inventory is running low. This component shows remaining quantity, creates urgency, and integrates with the stock status indicator to enhance conversion.

### Dependencies
- Task 46: Stock Status (appears together)
- Inventory threshold configuration
- Urgency messaging strategy

### Instructions

1. **Create low stock warning component file**
   - Navigate to `frontend/components/storefront/product/ProductInfo/` directory
   - Create `LowStockWarning.tsx` file
   - Accept stock quantity and threshold props

2. **Define TypeScript interfaces**
   - Create `LowStockWarningProps` interface
   - Include stockQuantity number
   - Include lowStockThreshold number
   - Add urgencyLevel (low, medium, high)
   - Include customMessage string (optional)

3. **Implement visibility logic**
   - Show only when 0 < stockQuantity <= threshold
   - Hide when in stock or out of stock
   - Calculate urgency level based on quantity
   - Conditional rendering based on status

4. **Set up warning text**
   - "Only X left in stock!"
   - "Hurry! Only X remaining"
   - "Almost sold out - X left"
   - Include quantity in message
   - Emphasize urgency

5. **Implement styling**
   - Color: Amber/orange (amber-700)
   - Background: Light amber (amber-50 or amber-100)
   - Font weight: Medium to bold (500-600)
   - Icon: Warning triangle or alert icon
   - Border: Optional left border accent

6. **Add urgency levels**
   - High urgency: 1-3 items (red accent)
   - Medium urgency: 4-7 items (amber accent)
   - Low urgency: 8-10 items (yellow accent)
   - Adjust colors based on urgency

7. **Set up layout**
   - Position directly below stock status
   - Or integrate into stock status component
   - Small padding and margin
   - Icon + text horizontal layout
   - Optional badge style

8. **Add animation (subtle)**
   - Gentle pulse for high urgency
   - Fade in entrance
   - Respect reduced motion preferences
   - Don't overdo animation

### Urgency Level Logic

```
stockQuantity = 3
lowStockThreshold = 10

if (stockQuantity <= 3) {
  urgency = "HIGH"
  color = "red"
  message = "Hurry! Only 3 left!"
} else if (stockQuantity <= 7) {
  urgency = "MEDIUM"
  color = "amber"
  message = "Only 3 left in stock"
} else {
  urgency = "LOW"
  color = "yellow"
  message = "Limited stock available"
}
```

### Urgency Configuration

| Stock Qty | Urgency | Color | Message |
|-----------|---------|-------|---------|
| 1-3 | High | red-600 | "Hurry! Only X left!" |
| 4-7 | Medium | amber-600 | "Only X left in stock" |
| 8-10 | Low | yellow-600 | "Limited availability" |
| 11+ | None | - | Hidden (use standard status) |

### Styling Specifications

| Property | Value | Notes |
|----------|-------|-------|
| Background | amber-50 | Light warning background |
| Text Color | amber-900 | Dark amber for contrast |
| Font Size | 13-14px | Slightly smaller than normal |
| Font Weight | 600 | Semi-bold for emphasis |
| Padding | 8px 12px | Comfortable padding |
| Border Left | 3px amber-500 | Accent border |
| Margin Top | 8px | Space from stock status |
| Icon Size | 16px | Small warning icon |

### Display Options

**Option 1: Separate Component**
```
Stock Status: ✓ In Stock (green)
Low Stock Warning: ⚠️ Only 5 left in stock! (amber box)
```

**Option 2: Integrated**
```
Stock Status: ⚠️ Only 5 left in stock! (amber with icon)
```

**Option 3: Badge Style**
```
Stock Status: Only 5 left (amber pill badge)
```

### Expected Outcome
- Prominent low stock warning for scarce items
- Shows only when inventory below threshold
- Clear quantity messaging with urgency
- Amber/orange color scheme
- Optional urgency-based color adjustment
- Subtle animation for high urgency items

### Verification Checklist
- [ ] Component renders when stock low
- [ ] Hidden when stock sufficient or zero
- [ ] Displays correct remaining quantity
- [ ] Urgency level calculated correctly
- [ ] High urgency (1-3) shows red accent
- [ ] Medium urgency (4-7) shows amber
- [ ] Text emphasizes scarcity
- [ ] Icon present and aligned
- [ ] Accessible to screen readers
- [ ] TypeScript types correct

---

## Task 48: Create Delivery Estimate

### Overview
Build the delivery estimate component that displays expected delivery date ranges based on customer location, shipping method, and product availability. This component enhances trust, sets expectations, and integrates with Sri Lankan logistics for accurate estimates.

### Dependencies
- Task 35: Product Info Container
- Task 47: Low Stock Warning (appears after)
- Location detection (IP or user profile)
- Shipping calculation service
- Date formatting utilities

### Instructions

1. **Create delivery estimate component file**
   - Navigate to `frontend/components/storefront/product/ProductInfo/` directory
   - Create `DeliveryEstimate.tsx` file
   - Accept delivery data as props

2. **Define TypeScript interfaces**
   - Create `DeliveryEstimateProps` interface
   - Include estimatedDays number (or date range)
   - Include deliveryDate Date object
   - Add location string (city/region)
   - Include shippingMethod string
   - Add loading state boolean

3. **Implement date calculation**
   - Calculate delivery date from current date + processing + shipping
   - Account for business days only (exclude weekends)
   - Account for Sri Lankan public holidays
   - Add buffer for processing time
   - Use date libraries (date-fns, dayjs)

4. **Set up location-based estimates**
   - Detect user location (IP geolocation or profile)
   - Colombo/Western Province: 1-2 days
   - Other major cities: 2-3 days
   - Remote areas: 3-5 days
   - Default estimate if location unknown

5. **Implement display formats**
   - "Delivery by Mon, Jan 20"
   - "Expected delivery: Jan 18 - Jan 20"
   - "Get it by tomorrow" (next day)
   - "Arrives in 3-5 business days"
   - Format dates in readable way

6. **Add delivery icon**
   - Truck icon (delivery vehicle)
   - 20px size
   - Position before text
   - Gray or theme color

7. **Set up styling**
   - Font size: 14px
   - Color: Secondary text (gray-700)
   - Icon color: Gray-500
   - Flex layout: icon + text
   - Gap: 8px

8. **Handle special scenarios**
   - Next day delivery (eligible items)
   - Same day delivery (premium, specific areas)
   - Pre-order items (future date)
   - Out of stock (no delivery estimate)
   - Backordered (extended timeline)

9. **Add loading state**
   - Skeleton while calculating
   - Smooth transition when loaded
   - Handle calculation errors gracefully

### Date Calculation Logic

```
Today: January 15, 2026 (Wednesday)
Processing Time: 1 business day
Shipping Time (Colombo): 1 business day
Total: 2 business days

Calculation:
  Jan 15 (Wed) + 1 processing = Jan 16 (Thu)
  Jan 16 (Thu) + 1 shipping = Jan 17 (Fri)

Result: "Delivery by Fri, Jan 17"
```

### Location-Based Estimates

| Location | Processing | Shipping | Total | Display |
|----------|-----------|----------|-------|---------|
| Colombo | 1 day | 1 day | 2 days | "By [Date]" |
| Western Province | 1 day | 1-2 days | 2-3 days | "[Date] - [Date]" |
| Major Cities | 1 day | 2 days | 3 days | "By [Date]" |
| Remote Areas | 1 day | 3-5 days | 4-6 days | "[Date] - [Date]" |
| Unknown | 1 day | 2-4 days | 3-5 days | "3-5 business days" |

### Display Format Examples

| Scenario | Display |
|----------|---------|
| Specific Date | "Delivery by Mon, Jan 20" |
| Date Range | "Expected: Jan 18 - Jan 20" |
| Next Day | "Get it by tomorrow" |
| Same Day | "Order in 3h for same-day delivery" |
| Days Count | "Arrives in 3-5 business days" |
| Pre-order | "Ships on March 1, 2026" |

### Styling Specifications

| Property | Value | Tailwind |
|----------|-------|----------|
| Font Size | 14px | text-sm |
| Color | gray-700 | text-gray-700 |
| Icon Size | 20px | w-5 h-5 |
| Icon Color | gray-500 | text-gray-500 |
| Display | Flex | flex items-center |
| Gap | 8px | gap-2 |
| Margin Top | 12px | mt-3 |

### Expected Outcome
- Accurate delivery date estimate displayed
- Location-based calculation (Colombo vs remote)
- Truck icon with readable date format
- Business days calculation (excluding weekends)
- Loading skeleton during calculation
- Graceful handling of unknown location

### Verification Checklist
- [ ] Component renders delivery estimate
- [ ] Date calculated correctly (business days)
- [ ] Colombo shows 1-2 day estimate
- [ ] Other cities show 2-5 day range
- [ ] Date format readable: "Mon, Jan 20"
- [ ] Truck icon displayed and aligned
- [ ] Weekends excluded from calculation
- [ ] Loading skeleton shows during fetch
- [ ] Accessible to screen readers
- [ ] TypeScript types correct

---

## Task 49: Create Free Shipping Note

### Overview
Implement the free shipping notification component that displays when a product qualifies for free shipping or shows the threshold to reach free shipping. This component enhances perceived value, encourages larger orders, and integrates with shipping policy configuration.

### Dependencies
- Task 48: Delivery Estimate (appears together)
- Shipping policy configuration
- Cart total calculation (for threshold)

### Instructions

1. **Create free shipping component file**
   - Navigate to `frontend/components/storefront/product/ProductInfo/` directory
   - Create `FreeShippingNote.tsx` file
   - Accept product price and policy data

2. **Define TypeScript interfaces**
   - Create `FreeShippingNoteProps` interface
   - Include productPrice number
   - Include freeShippingThreshold number (e.g., 5000)
   - Add cartTotal number (optional, for threshold progress)
   - Include alwaysFreeShipping boolean
   - Add customMessage string

3. **Implement eligibility logic**
   - Product qualifies: productPrice >= threshold
   - Product doesn't qualify: Show threshold message
   - Always free: Specific products/categories
   - Conditional: Based on location or promotion

4. **Set up messaging variations**
   - Eligible: "Free shipping on this item"
   - Near threshold: "Add ₨ 500 more for free shipping"
   - Below threshold: "Free shipping on orders over ₨ 5,000"
   - Premium: "Always free shipping"
   - Location-based: "Free shipping in Colombo"

5. **Implement visual styling**
   - Color: Green or success color (green-600)
   - Icon: Checkmark or shipping icon
   - Font size: 13-14px
   - Font weight: Medium (500)
   - Background: Optional light green (green-50)

6. **Set up badge/pill style**
   - Small badge format
   - Rounded corners
   - Inline with delivery estimate
   - Or separate line below
   - Prominent but not overwhelming

7. **Add progress indicator (optional)**
   - If showing threshold, add progress bar
   - Visual representation of how close
   - "₨ 500 away from free shipping"
   - Encourage cart value increase

8. **Handle conditional display**
   - Show only if free shipping available
   - Hide if no free shipping policy
   - Adjust message based on cart context
   - Update dynamically as cart changes

### Eligibility Logic

```
freeShippingThreshold = 5000
productPrice = 6000
cartTotal = 6000 (single item cart)

if (productPrice >= freeShippingThreshold) {
  message = "Free shipping on this item"
  eligible = true
} else {
  amountNeeded = freeShippingThreshold - cartTotal
  message = `Add ₨ ${amountNeeded} for free shipping`
  eligible = false
}
```

### Message Variations

| Scenario | Message | Color |
|----------|---------|-------|
| Item qualifies | "Free shipping on this item" | Green |
| Always free | "Always free shipping" | Green |
| Order qualifies | "Free shipping on your order" | Green |
| Near threshold | "Add ₨ 500 for free shipping" | Amber |
| Below threshold | "Free on orders over ₨ 5,000" | Gray |
| Location-based | "Free shipping in Colombo" | Green |

### Styling Specifications

| Property | Value | Notes |
|----------|-------|-------|
| Color | green-600 | Success color |
| Background | Optional green-50 | Light background |
| Font Size | 13px | Slightly smaller |
| Font Weight | 500 | Medium weight |
| Icon | ✓ or truck | Checkmark or shipping |
| Icon Size | 16px | Small icon |
| Padding | 6px 10px | If badge style |
| Border Radius | 4px | Subtle rounding |

### Display Options

**Option 1: Inline with Delivery**
```
🚚 Delivery by Mon, Jan 20  ✓ Free Shipping
```

**Option 2: Separate Line**
```
🚚 Delivery by Mon, Jan 20
✓ Free shipping on this item
```

**Option 3: Badge Style**
```
🚚 Delivery by Mon, Jan 20  [FREE SHIPPING]
```

### Progress Indicator (Optional)

```
Free Shipping on orders over ₨ 5,000
[████████░░] ₨ 500 away

Current: ₨ 4,500
Needed: ₨ 500
Progress: 90%
```

### Expected Outcome
- Clear free shipping notification when eligible
- Threshold messaging when not qualified
- Green checkmark icon for qualified items
- Optional progress bar for threshold
- Encourages higher order values
- Updates dynamically with cart

### Verification Checklist
- [ ] Component renders when free shipping applicable
- [ ] Message correct for eligible items
- [ ] Threshold displayed for ineligible items
- [ ] Progress calculation accurate (if shown)
- [ ] Green color for qualified
- [ ] Icon displayed and aligned
- [ ] Font size and weight correct
- [ ] Hidden when no free shipping policy
- [ ] Accessible to screen readers
- [ ] TypeScript types correct

---

## Task 50: Create Share Buttons

### Overview
Build the share buttons container component that houses social sharing functionality optimized for Sri Lanka. This component manages WhatsApp (primary) and Facebook (secondary) sharing, implements Web Share API with fallbacks, and tracks sharing analytics.

### Dependencies
- Task 35: Product Info Container
- Task 49: Free Shipping Note (appears after)
- Web Share API support detection
- Social media integration setup

### Instructions

1. **Create share buttons component file**
   - Navigate to `frontend/components/storefront/product/ProductInfo/` directory
   - Create `ShareButtons.tsx` file
   - Accept product data for sharing

2. **Define TypeScript interfaces**
   - Create `ShareButtonsProps` interface
   - Include productName string
   - Include productUrl string
   - Include productImage string (optional)
   - Add customMessage string (optional)
   - Include showLabel boolean

3. **Implement container structure**
   - Horizontal flex layout
   - Label: "Share:" (optional)
   - Button slots for each platform
   - Appropriate spacing between buttons
   - Responsive stacking on mobile

4. **Set up Web Share API integration**
   - Detect Web Share API support
   - Use native share if available (mobile)
   - Fall back to direct links if not
   - Handle share cancellation gracefully

5. **Implement share data preparation**
   - Construct share text/message
   - Include product name and URL
   - Add custom message if provided
   - Format for each platform's requirements

6. **Add analytics tracking**
   - Track share button clicks
   - Track successful shares
   - Track platform distribution
   - Send to analytics service

7. **Set up visual styling**
   - Button size: 36-40px square
   - Icon size: 20px
   - Border: 1px solid gray-300
   - Hover: Background color change
   - Gap: 8-12px between buttons

8. **Handle responsive behavior**
   - Desktop: Horizontal row
   - Mobile: Horizontal or stacked
   - Maintain touch-friendly sizing
   - Ensure accessibility on all devices

### Share Data Structure

```javascript
const shareData = {
  title: "Premium Wireless Mouse",
  text: "Check out this product on our store!",
  url: "https://example.com/products/wireless-mouse",
  image: "https://example.com/images/mouse.jpg" // Some APIs
}
```

### Web Share API Flow

```
User Clicks Share Button
    ↓
Check Web Share API Support
    ↓
├── Supported (mobile)
│   ├── Call navigator.share(shareData)
│   ├── User selects share target
│   └── Track share completion
│
└── Not Supported (desktop)
    ├── Open platform-specific URL
    ├── WhatsApp: wa.me share link
    ├── Facebook: facebook share dialog
    └── Track share initiation
```

### Container Layout

```
Share Buttons Container
├── Label (optional)
│   └── "Share:" text
├── WhatsApp Button (Task 51)
│   └── WhatsApp icon + action
└── Facebook Button (Task 52)
    └── Facebook icon + action
```

### Styling Specifications

| Element | Property | Value |
|---------|----------|-------|
| Container | Display | flex, items-center |
| Container | Gap | 12px |
| Label | Font Size | 14px |
| Label | Color | gray-700 |
| Label | Font Weight | 500 |
| Button | Size | 36px × 36px |
| Button | Border | 1px solid gray-300 |
| Button | Radius | rounded-md (6px) |
| Button | Hover | bg-gray-50 |

### Analytics Events

| Event | Trigger | Data |
|-------|---------|------|
| share_button_click | Button clicked | platform, product_id |
| share_initiated | Share dialog opened | platform, product_id |
| share_completed | Native share success | platform, product_id |
| share_cancelled | User cancelled share | platform |

### Expected Outcome
- Container with share buttons displayed
- Web Share API integration for mobile
- WhatsApp and Facebook buttons (Tasks 51-52)
- Analytics tracking for share actions
- Responsive layout across devices
- Accessible to keyboard navigation

### Verification Checklist
- [ ] Component renders share container
- [ ] Label "Share:" displayed (if enabled)
- [ ] WhatsApp and Facebook buttons visible
- [ ] Horizontal layout with proper spacing
- [ ] Web Share API detected correctly
- [ ] Native share works on mobile
- [ ] Analytics events fire on interaction
- [ ] Responsive behavior works
- [ ] Keyboard accessible
- [ ] TypeScript types correct

---

## Task 51: Create WhatsApp Share

### Overview
Implement the WhatsApp share button component optimized for Sri Lanka where WhatsApp is the primary communication platform. This component generates proper share URLs, formats messages, handles desktop vs mobile scenarios, and provides one-click sharing functionality.

### Dependencies
- Task 50: Share Buttons Container
- WhatsApp Web/App URL schemes
- Mobile detection utilities

### Instructions

1. **Create WhatsApp share component file**
   - Navigate to `frontend/components/storefront/product/ProductInfo/` directory
   - Create `WhatsAppShare.tsx` file
   - Accept product data for message generation

2. **Define TypeScript interfaces**
   - Create `WhatsAppShareProps` interface
   - Include productName string
   - Include productUrl string
   - Include productPrice string/number (formatted)
   - Add customMessage string (optional)
   - Include buttonSize (default, small, large)

3. **Implement message formatting**
   - Create compelling share message
   - Include product name
   - Include price (optional)
   - Include product URL
   - Format: "Check out this product: [Name] - [URL]"

4. **Set up URL generation**
   - WhatsApp Web: `https://web.whatsapp.com/send?text=[message]`
   - WhatsApp App: `https://wa.me/?text=[message]`
   - Mobile: Use wa.me (opens app directly)
   - Desktop: Use web.whatsapp.com
   - URL encode message properly

5. **Implement device detection**
   - Detect mobile vs desktop
   - Use appropriate URL scheme
   - Check if WhatsApp installed (if possible)
   - Fallback to web version

6. **Set up button styling**
   - WhatsApp brand color: #25D366 (green)
   - White WhatsApp icon
   - 36px × 36px button (default)
   - Rounded corners
   - Hover: Darken slightly

7. **Add click handler**
   - Generate share URL on click
   - Open in new window/tab
   - Track share initiation
   - Handle errors gracefully

8. **Implement accessibility**
   - ARIA label: "Share on WhatsApp"
   - Keyboard accessible
   - Focus visible outline
   - Screen reader friendly

### Message Template

```
Template: "Check out this product: {productName} - {productUrl}"

Example:
"Check out this product: Premium Wireless Mouse - 
https://example.com/products/wireless-mouse"

With Price:
"Check out this product: Premium Wireless Mouse 
₨ 2,500 - https://example.com/products/wireless-mouse"

Custom:
"{customMessage} 
https://example.com/products/wireless-mouse"
```

### URL Generation Logic

```javascript
const isMobile = /Mobile|Android|iPhone/i.test(navigator.userAgent)

const message = encodeURIComponent(
  `Check out this product: ${productName} - ${productUrl}`
)

const whatsappUrl = isMobile
  ? `https://wa.me/?text=${message}`
  : `https://web.whatsapp.com/send?text=${message}`

// Open URL
window.open(whatsappUrl, '_blank')
```

### Device-Specific URLs

| Device | URL Scheme | Opens |
|--------|------------|-------|
| Mobile (iOS) | `https://wa.me/?text=[msg]` | WhatsApp App |
| Mobile (Android) | `https://wa.me/?text=[msg]` | WhatsApp App |
| Desktop | `https://web.whatsapp.com/send?text=[msg]` | WhatsApp Web |
| Fallback | `https://wa.me/?text=[msg]` | Universal link |

### Styling Specifications

| Property | Value | Notes |
|----------|-------|-------|
| Background | #25D366 | WhatsApp brand green |
| Icon Color | White | High contrast |
| Size | 36px × 36px | Touch-friendly |
| Border Radius | 6px | Rounded corners |
| Hover Background | #22BF5B | Slightly darker |
| Icon Size | 20px | Centered in button |
| Transition | 150ms | Smooth hover |

### Button Variants

| Variant | Size | Use Case |
|---------|------|----------|
| Small | 32px | Compact displays |
| Default | 36px | Standard (Product page) |
| Large | 44px | Emphasis |
| Icon Only | 36px | No text label |
| With Text | Width auto | "Share on WhatsApp" |

### Expected Outcome
- WhatsApp share button with brand colors
- Device-appropriate URL generation
- Mobile opens WhatsApp app directly
- Desktop opens WhatsApp Web
- Pre-formatted message with product details
- Click opens in new window
- Analytics tracking for shares

### Verification Checklist
- [ ] Component renders WhatsApp button
- [ ] Button styled with WhatsApp green (#25D366)
- [ ] White WhatsApp icon displayed
- [ ] Mobile detection works correctly
- [ ] Mobile opens WhatsApp app
- [ ] Desktop opens WhatsApp Web
- [ ] Message formatted correctly
- [ ] URL properly encoded
- [ ] Click opens new window/tab
- [ ] Analytics event fires
- [ ] Keyboard accessible
- [ ] ARIA label present
- [ ] TypeScript types correct

---

## Task 52: Create Facebook Share

### Overview
Implement the Facebook share button component for secondary social sharing. This component uses Facebook's Share Dialog, handles authentication requirements, provides proper Open Graph tags integration, and offers an alternative sharing channel to WhatsApp.

### Dependencies
- Task 50: Share Buttons Container
- Facebook SDK initialization (optional)
- Open Graph meta tags configured

### Instructions

1. **Create Facebook share component file**
   - Navigate to `frontend/components/storefront/product/ProductInfo/` directory
   - Create `FacebookShare.tsx` file
   - Accept product data for sharing

2. **Define TypeScript interfaces**
   - Create `FacebookShareProps` interface
   - Include productUrl string
   - Include quote string (optional text)
   - Include hashtag string (optional)
   - Add buttonSize variant
   - Include useFacebookSDK boolean

3. **Implement share URL generation**
   - Facebook Share Dialog: `https://www.facebook.com/sharer/sharer.php?u=[url]`
   - Include product URL parameter
   - Add quote parameter if provided
   - Add hashtag parameter if provided
   - URL encode all parameters

4. **Set up Facebook SDK integration (optional)**
   - Use FB.ui share dialog if SDK loaded
   - Provides better experience
   - Requires Facebook App ID
   - Falls back to URL if SDK not available

5. **Implement Open Graph integration**
   - Ensure og:title meta tag set
   - Ensure og:description set
   - Ensure og:image set (product image)
   - Ensure og:url set (canonical URL)
   - Facebook scrapes these for preview

6. **Set up button styling**
   - Facebook brand color: #1877F2 (blue)
   - White Facebook icon (f logo)
   - 36px × 36px button
   - Rounded corners
   - Hover: Darken slightly

7. **Add click handler**
   - Generate share URL
   - Open popup window (600x400px)
   - Center popup on screen
   - Track share initiation
   - Handle popup blockers

8. **Implement analytics tracking**
   - Track button clicks
   - Track share dialog opened
   - Track share completion (if SDK)
   - Send to analytics service

### Share URL Format

```
Base URL:
https://www.facebook.com/sharer/sharer.php

Parameters:
- u: URL to share (required)
- quote: Text to include (optional)
- hashtag: Hashtag to include (optional)

Full Example:
https://www.facebook.com/sharer/sharer.php?
  u=https://example.com/products/wireless-mouse
  &quote=Check out this amazing product!
  &hashtag=#TechGadgets
```

### Facebook SDK Share Dialog

```javascript
// If Facebook SDK loaded
FB.ui({
  method: 'share',
  href: 'https://example.com/products/wireless-mouse',
  quote: 'Check out this amazing product!'
}, function(response) {
  if (response && !response.error_message) {
    // Share successful
    trackShareSuccess('facebook', productId)
  } else {
    // Share cancelled or error
    trackShareCancelled('facebook')
  }
})
```

### Open Graph Tags Required

| Tag | Content | Purpose |
|-----|---------|---------|
| og:title | Product Name | Title in share preview |
| og:description | Product Description | Description in preview |
| og:image | Product Image URL | Image in preview |
| og:url | Product Page URL | Canonical URL |
| og:type | product | Content type |
| og:site_name | Store Name | Site identification |

### Styling Specifications

| Property | Value | Notes |
|----------|-------|-------|
| Background | #1877F2 | Facebook brand blue |
| Icon Color | White | Facebook logo |
| Size | 36px × 36px | Consistent with WhatsApp |
| Border Radius | 6px | Rounded corners |
| Hover Background | #1565D8 | Slightly darker |
| Icon Size | 20px | Centered |
| Transition | 150ms | Smooth hover effect |

### Popup Window Configuration

| Property | Value | Reason |
|----------|-------|--------|
| Width | 600px | Optimal for share dialog |
| Height | 400px | Sufficient height |
| Position | Centered | User-friendly placement |
| Scrollbars | yes | If content overflows |
| Toolbar | no | Clean appearance |
| Menubar | no | Minimal chrome |

### Share URL vs SDK Comparison

| Aspect | Share URL | Facebook SDK |
|--------|-----------|--------------|
| Setup | Simple, no config | Requires App ID |
| Preview | Open Graph tags | Same + API data |
| Tracking | Limited | Full callbacks |
| User Auth | Not required | Optional |
| Experience | Popup window | Native dialog |

### Expected Outcome
- Facebook share button with brand colors
- Share dialog opens in popup window
- Product preview with OG tags
- Optional Facebook SDK integration
- Analytics tracking for shares
- Graceful handling of popup blockers

### Verification Checklist
- [ ] Component renders Facebook button
- [ ] Button styled with Facebook blue (#1877F2)
- [ ] White Facebook icon displayed
- [ ] Click opens share dialog
- [ ] Dialog opens in popup (600x400)
- [ ] Product URL passed correctly
- [ ] Open Graph tags present on page
- [ ] Share preview shows correct info
- [ ] Analytics event fires
- [ ] Popup blockers handled gracefully
- [ ] Keyboard accessible
- [ ] ARIA label present
- [ ] TypeScript types correct

---

## End of Document

### Summary of Tasks Completed

This document covered 8 tasks related to product description, stock status, delivery information, and social sharing:

- ✅ Task 45: Short Description - Truncated product overview
- ✅ Task 46: Stock Status - Color-coded availability indicator
- ✅ Task 47: Low Stock Warning - Urgency messaging for scarce items
- ✅ Task 48: Delivery Estimate - Location-based delivery dates
- ✅ Task 49: Free Shipping Note - Shipping qualification messaging
- ✅ Task 50: Share Buttons - Social sharing container
- ✅ Task 51: WhatsApp Share - Primary share button (Sri Lanka)
- ✅ Task 52: Facebook Share - Secondary share button

### Group C Complete

All 18 tasks in Group C (Product Information) are now fully documented:
- Tasks 35-44: Product info, rating, and price (Document 01)
- Tasks 45-52: Description, stock, and sharing (Document 02)

### Next Steps

Continue to Group D for:
- Variant selection (color, size, options)
- Quantity selector
- Add to cart functionality
- Buy now button
- Wishlist integration

**→ Next Group:** [Group-D_Variant-Cart-Actions](../Group-D_Variant-Cart-Actions/)
