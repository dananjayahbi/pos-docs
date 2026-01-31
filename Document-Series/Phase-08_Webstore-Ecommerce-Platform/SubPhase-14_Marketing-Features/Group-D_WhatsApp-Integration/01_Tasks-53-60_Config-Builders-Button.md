# Tasks 53-60: Config, Builders, and Button

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 14 - Marketing Features  
> **Group:** D - WhatsApp Integration  
> **Document:** 01 of 02  
> **Tasks Covered:** 53, 54, 55, 56, 57, 58, 59, 60

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-61-68_Widget-Pages-Verify.md](02_Tasks-61-68_Widget-Pages-Verify.md)

---

## Document Overview

This document covers the foundational WhatsApp integration components including configuration setup for Sri Lankan phone numbers (+94 format), number store management, link building utilities (wa.me format), message template builders for products, orders, and carts, the core WhatsAppButton component, and the branded WhatsApp icon. These components form the core infrastructure for enabling click-to-chat functionality throughout the webstore.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 53 | Create WhatsApp Config | Low | 20 min |
| 54 | Create WhatsApp Number Store | Low | 25 min |
| 55 | Create WhatsApp Link Builder | Medium | 30 min |
| 56 | Create Product Message Builder | Medium | 35 min |
| 57 | Create Order Message Builder | Medium | 35 min |
| 58 | Create Cart Message Builder | Medium | 40 min |
| 59 | Create WhatsAppButton Component | Medium | 45 min |
| 60 | Create WhatsApp Icon | Low | 20 min |

---

## Task 53: Create WhatsApp Config

### Overview
Create the WhatsApp configuration module that defines settings for Sri Lankan phone number formatting, default business hours, and tenant-specific WhatsApp number management. This configuration ensures consistent phone number formatting (+94 format) and provides a centralized location for WhatsApp-related settings throughout the application.

### Dependencies
- SubPhase-13 (Customer Engagement) must be complete
- Frontend infrastructure established
- Tenant context available

### Instructions

1. **Create config directory structure**
   - Navigate to `frontend/config/` directory
   - Create `whatsapp.config.ts` file
   - Ensure proper TypeScript configuration

2. **Define Sri Lankan phone format constants**
   - Country code: +94 (Sri Lanka)
   - Format without plus: 94XXXXXXXXX (11 digits total)
   - Format with plus: +94XXXXXXXXX (for display)
   - Mobile number patterns: 94(70-79)XXXXXXX

3. **Create configuration object structure**
   - Define default WhatsApp number (fallback)
   - Set country code and format specifications
   - Configure business hours format
   - Set default greeting messages

4. **Add phone number validation rules**
   - Validate Sri Lankan mobile numbers
   - Check for proper 94 prefix
   - Ensure 9-digit mobile number after country code
   - Validate mobile number ranges (70-79 series)

5. **Define default messages structure**
   - Default greeting message in English and Sinhala/Tamil
   - Placeholder text for different scenarios
   - Message length limits

6. **Add tenant configuration options**
   - Allow tenant-specific WhatsApp numbers
   - Business hours per tenant
   - Custom greeting messages per tenant
   - Fallback to default if not set

7. **Export configuration object**
   - Export as named constant
   - Include TypeScript types for type safety
   - Document each configuration property

### Configuration Structure

| Setting | Type | Purpose | Default Value |
|---------|------|---------|---------------|
| countryCode | string | Sri Lanka code | "+94" |
| phoneFormat | string | Display format | "+94 XX XXX XXXX" |
| linkFormat | string | wa.me format | "94XXXXXXXXX" |
| defaultNumber | string | Fallback number | From tenant |
| businessHours | string | Operating hours | "9:00 AM - 6:00 PM" |
| defaultGreeting | string | Initial message | "Hi, I'd like to know more about" |

### Phone Number Format Specifications

```
Display Format (User-facing)
└── +94 XX XXX XXXX
    Example: +94 77 123 4567

Link Format (wa.me)
└── 94XXXXXXXXX
    Example: 94771234567
    (No spaces, no plus sign, no hyphens)

Storage Format (Database)
└── +94XXXXXXXXX
    Example: +94771234567
```

### Sri Lankan Mobile Number Ranges

| Operator | Range | Example |
|----------|-------|---------|
| Dialog | 077, 076 | 94771234567 |
| Mobitel | 071, 070 | 94711234567 |
| Hutch | 078 | 94781234567 |
| Airtel | 075, 072 | 94751234567 |

### Configuration Object Schema

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| country | object | Yes | Country-specific settings |
| phone | object | Yes | Phone formatting rules |
| messages | object | Yes | Default message templates |
| validation | object | Yes | Validation rules |
| tenantSettings | object | No | Per-tenant overrides |

### Validation Rules

| Rule | Check | Error Message |
|------|-------|---------------|
| Country Code | Starts with 94 | "Invalid country code" |
| Length | Exactly 11 digits | "Invalid phone length" |
| Mobile Range | 70-79 series | "Invalid mobile range" |
| Format | Only digits | "Only numbers allowed" |

### Expected Outcome
- Centralized WhatsApp configuration file
- Sri Lankan phone number formatting rules
- Validation utilities for phone numbers
- Tenant-specific configuration support
- Type-safe configuration object

### Verification Checklist
- [ ] `frontend/config/whatsapp.config.ts` file created
- [ ] Sri Lankan country code (+94) configured
- [ ] Phone format specifications defined
- [ ] Validation rules implemented
- [ ] Default messages configured
- [ ] Tenant override support added
- [ ] Configuration exported properly
- [ ] TypeScript types defined

---

## Task 54: Create WhatsApp Number Store

### Overview
Create a state management store for WhatsApp numbers using Zustand or React Context. This store manages the current tenant's WhatsApp business number, availability status, business hours, and provides utilities for updating and retrieving the WhatsApp contact information. Ensures the correct WhatsApp number is used throughout the application.

### Dependencies
- Task 53: Create WhatsApp Config

### Instructions

1. **Choose state management approach**
   - Option A: Zustand store (recommended for simplicity)
   - Option B: React Context + Provider
   - Option C: Redux/Redux Toolkit slice
   - Consider application's existing state pattern

2. **Create store file**
   - Navigate to `frontend/lib/store/` or `frontend/stores/`
   - Create `whatsapp-number.store.ts` file
   - Import necessary state management utilities

3. **Define store state interface**
   - WhatsApp number (string)
   - Is available (boolean)
   - Business hours (string)
   - Last updated timestamp
   - Loading state

4. **Implement state getters**
   - Get current WhatsApp number
   - Get availability status
   - Get business hours
   - Get formatted number for display
   - Get formatted number for link

5. **Implement state setters**
   - Set WhatsApp number
   - Update availability status
   - Update business hours
   - Batch update all properties

6. **Add utility methods**
   - Format number for wa.me link
   - Format number for display
   - Validate phone number format
   - Check if currently available (based on hours)

7. **Implement tenant-specific loading**
   - Load WhatsApp number from tenant settings
   - Fall back to config default if not set
   - Handle loading states and errors

8. **Add persistence (optional)**
   - Consider local storage for caching
   - Reduce API calls for repeated access
   - Clear on tenant switch

### Store State Schema

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| number | string | WhatsApp number | "" |
| isAvailable | boolean | Currently available | true |
| businessHours | string | Operating hours | "9:00 AM - 6:00 PM" |
| isLoading | boolean | Loading state | false |
| lastUpdated | Date \| null | Last update time | null |

### Store Actions

| Action | Parameters | Purpose |
|--------|------------|---------|
| setNumber | (number: string) | Update WhatsApp number |
| setAvailability | (available: boolean) | Update availability |
| setBusinessHours | (hours: string) | Update business hours |
| loadFromTenant | (tenantId: string) | Load tenant config |
| reset | () | Clear all state |

### Number Formatting Methods

| Method | Input | Output | Purpose |
|--------|-------|--------|---------|
| formatForLink | +94771234567 | 94771234567 | wa.me URL |
| formatForDisplay | 94771234567 | +94 77 123 4567 | User display |
| validateFormat | (number) | boolean | Validation |

### Availability Check Logic

```
Business Hours: 9:00 AM - 6:00 PM
Current Time: 10:30 AM
└── Within hours? Yes → isAvailable = true

Current Time: 7:00 PM
└── Within hours? No → isAvailable = false
    └── Show: "Available during business hours"
```

### Store Usage Flow

```
1. App Initialization
   └── Load WhatsApp number from tenant settings
       └── Fallback to config default

2. User Navigates to Product Page
   └── Get WhatsApp number from store
       └── Build wa.me link
           └── Display WhatsApp button

3. Tenant Settings Updated
   └── Update store with new number
       └── Re-render all WhatsApp components
```

### Zustand Implementation Pattern

| Section | Purpose |
|---------|---------|
| Interface | Define state shape |
| Create Store | Define state and actions |
| Selectors | Compute derived values |
| Export | Export hooks and store |

### Expected Outcome
- Functional state store for WhatsApp numbers
- Tenant-specific number management
- Availability checking based on business hours
- Number formatting utilities
- Type-safe store with TypeScript

### Verification Checklist
- [ ] Store file created in appropriate directory
- [ ] State interface defined with all properties
- [ ] Getter methods implemented
- [ ] Setter methods implemented
- [ ] Number formatting utilities added
- [ ] Tenant loading functionality works
- [ ] Availability checking logic implemented
- [ ] Store exports properly for use in components
- [ ] TypeScript types complete

---

## Task 55: Create WhatsApp Link Builder

### Overview
Create utility functions for building WhatsApp click-to-chat links in the wa.me format. This builder handles phone number formatting, message URL encoding, and constructs proper WhatsApp web/mobile links. Ensures all WhatsApp links throughout the application follow the correct format and work reliably across devices.

### Dependencies
- Task 53: Create WhatsApp Config

### Instructions

1. **Create utility file**
   - Navigate to `frontend/lib/marketing/` or `frontend/utils/`
   - Create `whatsapp.ts` or `whatsapp-link-builder.ts`
   - Import WhatsApp config

2. **Implement base link builder function**
   - Accept phone number parameter
   - Accept optional message parameter
   - Return complete wa.me URL
   - Handle missing or invalid inputs

3. **Add phone number formatting**
   - Remove all non-digit characters
   - Ensure 94 country code prefix
   - Validate number length (11 digits)
   - Handle numbers with or without plus sign

4. **Implement message encoding**
   - URL-encode message text properly
   - Handle special characters (spaces, symbols)
   - Preserve line breaks as %0A
   - Handle emojis correctly

5. **Create link structure**
   - Base URL: `https://wa.me/`
   - Append formatted phone number
   - Append `?text=` parameter if message provided
   - Append encoded message text

6. **Add validation**
   - Validate phone number format
   - Return null or throw error for invalid inputs
   - Log warnings for debugging
   - Provide helpful error messages

7. **Create convenience builders**
   - Product inquiry link builder
   - Order inquiry link builder
   - Cart inquiry link builder
   - Generic message link builder

8. **Add mobile/web detection (optional)**
   - Detect mobile vs desktop
   - Use `wa.me` for universal compatibility
   - Consider `api.whatsapp.com` for specific cases

### Link Builder Functions

| Function | Parameters | Returns | Purpose |
|----------|------------|---------|---------|
| buildWhatsAppLink | (phone, message?) | string | Basic link builder |
| buildProductLink | (phone, product) | string | Product inquiry |
| buildOrderLink | (phone, orderId) | string | Order inquiry |
| buildCartLink | (phone, items) | string | Cart inquiry |
| formatPhoneForLink | (phone) | string | Format helper |
| encodeMessage | (message) | string | Encoding helper |

### URL Structure

```
Basic Structure
https://wa.me/{phone}

With Message
https://wa.me/{phone}?text={encoded_message}

Complete Example
https://wa.me/94771234567?text=Hi%2C%20I'm%20interested%20in%20Product%20XYZ
```

### Phone Number Formatting Logic

```
Input: +94 77 123 4567
Step 1: Remove spaces → +94771234567
Step 2: Remove plus → 94771234567
Step 3: Validate length → 11 digits ✓
Output: 94771234567

Input: 0771234567
Step 1: Remove leading 0 → 771234567
Step 2: Add country code → 94771234567
Step 3: Validate length → 11 digits ✓
Output: 94771234567
```

### Message Encoding Examples

| Original | Encoded | Purpose |
|----------|---------|---------|
| "Hi, how are you?" | "Hi%2C%20how%20are%20you%3F" | URL safe |
| "Line 1\nLine 2" | "Line%201%0ALine%202" | Preserve breaks |
| "Price: ₨1,000" | "Price%3A%20%E2%82%A81%2C000" | Special chars |

### Link Building Flow

```
1. Accept Parameters
   ├── Phone: +94771234567
   └── Message: "Hi, interested in Product A"

2. Format Phone
   └── Output: 94771234567

3. Encode Message
   └── Output: "Hi%2C%20interested%20in%20Product%20A"

4. Construct URL
   └── https://wa.me/94771234567?text=Hi%2C%20interested%20in%20Product%20A

5. Return Complete Link
```

### Validation Rules

| Check | Rule | Action |
|-------|------|--------|
| Phone exists | Not null/undefined | Throw error |
| Phone format | Matches 94XXXXXXXXX | Attempt fix |
| Phone length | Exactly 11 digits | Throw error |
| Message length | < 1000 chars | Warn/truncate |

### Error Handling

| Error | Message | Resolution |
|-------|---------|------------|
| No phone | "Phone number required" | Return null |
| Invalid format | "Invalid phone format" | Attempt auto-fix |
| Too long | "Message too long" | Truncate |

### Expected Outcome
- Utility functions for building WhatsApp links
- Proper phone number formatting for wa.me
- Message URL encoding support
- Validation and error handling
- Reusable across all WhatsApp features

### Verification Checklist
- [ ] Link builder utility file created
- [ ] Base link builder function implemented
- [ ] Phone number formatting works correctly
- [ ] Message encoding handles special characters
- [ ] wa.me URL structure is correct
- [ ] Validation rules implemented
- [ ] Error handling for edge cases
- [ ] Convenience builders created
- [ ] Functions exported properly
- [ ] TypeScript types defined

---

## Task 56: Create Product Message Builder

### Overview
Create a message template builder specifically for product inquiries. This builder constructs formatted WhatsApp messages that include product name, URL, price in Sri Lankan Rupees (₨), and a polite inquiry message. Used when customers click WhatsApp buttons on product pages to inquire about specific products.

### Dependencies
- Task 55: Create WhatsApp Link Builder

### Instructions

1. **Create message builder function**
   - Add to `whatsapp.ts` utility file
   - Accept product object parameter
   - Accept optional custom message parameter
   - Return formatted message string

2. **Define product message template**
   - Greeting: "Hi, I'm interested in:"
   - Product name with emphasis
   - Product URL for reference
   - Current price in ₨ (LKR)
   - Stock availability mention
   - Polite question: "Is this available?"

3. **Extract product information**
   - Product name/title
   - Product SKU or ID
   - Current price (format as ₨X,XXX)
   - Product URL (webstore link)
   - Stock status (optional)

4. **Format price in Sri Lankan Rupees**
   - Use ₨ symbol prefix
   - Add thousand separators (1,000)
   - Format: ₨1,500 or ₨15,000
   - Handle decimal places if needed (.00 or .50)

5. **Build product URL**
   - Use full webstore URL
   - Include product slug
   - Format: https://store.example.lk/products/product-slug
   - Ensure URL is accessible publicly

6. **Construct complete message**
   - Combine all elements with line breaks
   - Keep message concise and readable
   - Use proper formatting for WhatsApp
   - Ensure message is not too long

7. **Add customization options**
   - Allow custom question text
   - Optional quantity mention
   - Optional variant specification
   - Language preference (English/Sinhala/Tamil)

8. **Integrate with link builder**
   - Call buildWhatsAppLink with phone and message
   - Return complete wa.me URL
   - Handle encoding automatically

### Product Message Template

```
Hi, I'm interested in:

*[Product Name]*
Price: ₨[X,XXX]
[Product URL]

Is this available?
```

### Example Product Messages

| Product | Generated Message |
|---------|-------------------|
| Rice Cooker | "Hi, I'm interested in:\n\n*Philips Rice Cooker 1.8L*\nPrice: ₨12,500\nhttps://store.lk/products/rice-cooker\n\nIs this available?" |
| Tea Packets | "Hi, I'm interested in:\n\n*Dilmah Premium Tea 200g*\nPrice: ₨850\nhttps://store.lk/products/dilmah-tea\n\nIs this available?" |

### Message Structure Breakdown

| Section | Content | Purpose |
|---------|---------|---------|
| Greeting | "Hi, I'm interested in:" | Polite opening |
| Product | *Product Name* | Identify item |
| Price | "Price: ₨X,XXX" | Show cost |
| Link | Product URL | Reference |
| Question | "Is this available?" | Clear inquiry |

### Product Object Interface

| Property | Type | Required | Example |
|----------|------|----------|---------|
| id | string | Yes | "prod_123" |
| name | string | Yes | "Rice Cooker" |
| price | number | Yes | 12500 |
| slug | string | Yes | "rice-cooker" |
| sku | string | No | "RC-001" |
| inStock | boolean | No | true |

### Price Formatting Examples

| Amount | Formatted | Display |
|--------|-----------|---------|
| 1500 | "1,500" | ₨1,500 |
| 12500 | "12,500" | ₨12,500 |
| 125000 | "125,000" | ₨125,000 |
| 1500.50 | "1,500.50" | ₨1,500.50 |

### Message Variations

| Scenario | Message Adjustment |
|----------|-------------------|
| Out of Stock | "When will this be available?" |
| With Variant | Mention variant (color/size) |
| Bulk Inquiry | "Price for 10 units?" |
| Custom | Use provided custom text |

### URL Construction

```
Base URL: https://store.example.lk
Product Slug: rice-cooker-1-8l
Complete URL: https://store.example.lk/products/rice-cooker-1-8l
```

### Expected Outcome
- Message builder function for product inquiries
- Formatted messages with product details
- Sri Lankan Rupee price formatting
- Product URL inclusion
- Integration with link builder

### Verification Checklist
- [ ] Product message builder function created
- [ ] Message template includes all required fields
- [ ] Product name formatted with emphasis
- [ ] Price formatted with ₨ symbol and separators
- [ ] Product URL included correctly
- [ ] Message is concise and readable
- [ ] Customization options implemented
- [ ] Integration with link builder works
- [ ] Function exported and typed

---

## Task 57: Create Order Message Builder

### Overview
Create a message template builder for order-related inquiries. This builder constructs formatted WhatsApp messages that include order ID, current order status, order date, total amount in Sri Lankan Rupees, and inquiry questions about shipping or order updates. Used when customers want to inquire about their existing orders.

### Dependencies
- Task 55: Create WhatsApp Link Builder

### Instructions

1. **Create order message builder function**
   - Add to `whatsapp.ts` utility file
   - Accept order object parameter
   - Accept optional inquiry type parameter
   - Return formatted message string

2. **Define order message template**
   - Greeting: "Hi, about my order:"
   - Order ID with prefix (e.g., #ORD-12345)
   - Current order status
   - Order date
   - Total amount in ₨
   - Specific inquiry question

3. **Extract order information**
   - Order ID or order number
   - Order status (pending, processing, shipped, delivered)
   - Order date (formatted)
   - Total amount
   - Tracking number (if available)

4. **Format order ID display**
   - Prefix with # symbol
   - Include order prefix if exists (ORD-, INV-)
   - Format: #ORD-12345
   - Make it easily searchable for staff

5. **Add status-specific questions**
   - Pending: "When will this be processed?"
   - Processing: "When will this ship?"
   - Shipped: "Where is my delivery?"
   - Delivered: "I need support with this order"

6. **Format order date**
   - Use local date format (DD/MM/YYYY)
   - Or relative time (2 days ago)
   - Include time if relevant
   - Match Sri Lankan conventions

7. **Include total amount**
   - Format with ₨ symbol
   - Add thousand separators
   - Match invoice amount exactly

8. **Create inquiry type options**
   - Shipping status inquiry
   - Delivery time inquiry
   - Order modification request
   - Order cancellation request
   - Payment confirmation inquiry
   - General inquiry

### Order Message Template

```
Hi, about my order:

Order ID: #[ORDER-ID]
Status: [Current Status]
Date: [Order Date]
Total: ₨[X,XXX]

[Status-specific question]
```

### Example Order Messages

| Status | Generated Message |
|--------|-------------------|
| Processing | "Hi, about my order:\n\nOrder ID: #ORD-12345\nStatus: Processing\nDate: 28/01/2026\nTotal: ₨15,500\n\nWhen will this ship?" |
| Shipped | "Hi, about my order:\n\nOrder ID: #ORD-12345\nStatus: Shipped\nTracking: TRK123456\nTotal: ₨15,500\n\nWhere is my delivery?" |

### Order Object Interface

| Property | Type | Required | Example |
|----------|------|----------|---------|
| id | string | Yes | "ord_123" |
| orderNumber | string | Yes | "ORD-12345" |
| status | string | Yes | "processing" |
| date | Date | Yes | 2026-01-28 |
| total | number | Yes | 15500 |
| trackingNumber | string | No | "TRK123456" |

### Order Status Messages

| Status | Default Question |
|--------|------------------|
| Pending | "When will this be processed?" |
| Payment Pending | "How do I complete payment?" |
| Processing | "When will this ship?" |
| Packed | "When will this be picked up?" |
| Shipped | "Where is my delivery?" |
| Out for Delivery | "What time will it arrive?" |
| Delivered | "I need help with this order" |
| Cancelled | "Why was this cancelled?" |

### Date Formatting Examples

| Format | Example | When to Use |
|--------|---------|-------------|
| DD/MM/YYYY | 28/01/2026 | Standard display |
| D MMM YYYY | 28 Jan 2026 | Readable format |
| Relative | 2 days ago | Recent orders |
| Full | Monday, 28 January 2026 | Formal |

### Inquiry Type Options

| Type | Question Template |
|------|-------------------|
| shipping | "When will this ship?" |
| delivery | "What's the delivery status?" |
| modify | "Can I modify this order?" |
| cancel | "Can I cancel this order?" |
| payment | "Is my payment confirmed?" |
| general | "I have a question about this order" |

### Message Variations

```
With Tracking Number
├── Include tracking: "Tracking: TRK123456"
└── Question: "Where is my delivery?"

Without Tracking
├── Omit tracking line
└── Question: "When will I receive tracking?"

Multiple Items
├── Mention: "My order of 5 items"
└── Question: "Are all items shipped together?"
```

### Expected Outcome
- Message builder function for order inquiries
- Formatted messages with order details
- Status-specific inquiry questions
- Order ID and date formatting
- Flexible inquiry type support

### Verification Checklist
- [ ] Order message builder function created
- [ ] Message template includes order ID and status
- [ ] Order date formatted correctly (DD/MM/YYYY)
- [ ] Total amount formatted with ₨ symbol
- [ ] Status-specific questions implemented
- [ ] Tracking number included when available
- [ ] Inquiry type options supported
- [ ] Integration with link builder works
- [ ] Function exported and typed

---

## Task 58: Create Cart Message Builder

### Overview
Create a message template builder for cart-related inquiries. This builder constructs formatted WhatsApp messages that include a list of items in the cart, quantities, subtotal in Sri Lankan Rupees, and inquiry questions about proceeding with the order or requesting assistance. Used when customers want help with their shopping cart.

### Dependencies
- Task 55: Create WhatsApp Link Builder

### Instructions

1. **Create cart message builder function**
   - Add to `whatsapp.ts` utility file
   - Accept cart items array parameter
   - Accept cart total parameter
   - Return formatted message string

2. **Define cart message template**
   - Greeting: "Hi, I have items in my cart:"
   - List of products with quantities
   - Subtotal in ₨
   - Inquiry question
   - Call to action

3. **Format cart items list**
   - Each item on separate line
   - Format: "- Product Name (Qty: X)"
   - Include item price if helpful
   - Keep list concise (max 5-10 items)

4. **Handle multiple items**
   - List up to 10 items individually
   - If more than 10, show first 5 and add "...and X more items"
   - Calculate total item count
   - Show total quantity

5. **Calculate and format cart total**
   - Sum all item prices × quantities
   - Format with ₨ symbol
   - Add thousand separators
   - Label as "Subtotal" or "Total"

6. **Add inquiry questions**
   - Default: "Can I proceed with this order?"
   - Help: "I need help with checkout"
   - Discount: "Is there a discount available?"
   - Stock: "Are all items in stock?"
   - Delivery: "What's the delivery time?"

7. **Include cart summary**
   - Total items count
   - Total quantity
   - Subtotal amount
   - Optional: Expected delivery time

8. **Add urgency elements (optional)**
   - Mention if items have limited stock
   - Mention if discount is expiring
   - Mention if prices may change

### Cart Message Template

```
Hi, I have items in my cart:

- [Product 1] (Qty: X)
- [Product 2] (Qty: Y)
- [Product 3] (Qty: Z)

Total: ₨[X,XXX]

[Inquiry question]
```

### Example Cart Messages

| Scenario | Generated Message |
|----------|-------------------|
| Simple Cart | "Hi, I have items in my cart:\n\n- Rice Cooker (Qty: 1)\n- Tea Packets (Qty: 3)\n- Sugar 1kg (Qty: 2)\n\nTotal: ₨15,050\n\nCan I proceed with this order?" |
| Many Items | "Hi, I have items in my cart:\n\n- Rice Cooker (Qty: 1)\n- Tea Packets (Qty: 3)\n...and 8 more items\n\nTotal: ₨45,500\n\nI need help with checkout" |

### Cart Item Interface

| Property | Type | Required | Example |
|----------|------|----------|---------|
| id | string | Yes | "item_123" |
| name | string | Yes | "Rice Cooker" |
| quantity | number | Yes | 2 |
| price | number | Yes | 12500 |
| sku | string | No | "RC-001" |
| inStock | boolean | No | true |

### Item Formatting Examples

| Item | Formatted |
|------|-----------|
| Single | "- Rice Cooker (Qty: 1)" |
| Multiple | "- Tea Packets (Qty: 3)" |
| With Price | "- Sugar 1kg (Qty: 2) @ ₨250 each" |

### Cart Summary Calculations

| Metric | Calculation | Example |
|--------|-------------|---------|
| Total Items | Count unique items | 5 items |
| Total Quantity | Sum all quantities | 12 units |
| Subtotal | Sum (price × qty) | ₨15,050 |

### Message Length Management

```
Cart with ≤ 10 items
└── Show all items individually

Cart with > 10 items
├── Show first 5 items
├── Add "...and X more items"
└── Show total count and amount

Example:
- Item 1 (Qty: 2)
- Item 2 (Qty: 1)
- Item 3 (Qty: 3)
- Item 4 (Qty: 1)
- Item 5 (Qty: 2)
...and 7 more items

Total: 12 items, ₨45,500
```

### Inquiry Question Options

| Type | Question |
|------|----------|
| proceed | "Can I proceed with this order?" |
| help | "I need help with checkout" |
| discount | "Is there a discount available?" |
| stock | "Are all items in stock?" |
| delivery | "What's the delivery time?" |
| payment | "What payment methods do you accept?" |

### Cart State Scenarios

| Scenario | Message Adjustment |
|----------|-------------------|
| Empty Cart | "I'm browsing and have questions" |
| Single Item | Simpler format, no list |
| Many Items | Truncate with summary |
| High Value | Emphasize total amount |
| Low Stock | "Are these items available?" |

### Expected Outcome
- Message builder function for cart inquiries
- Formatted list of cart items with quantities
- Cart total formatted in ₨
- Flexible inquiry questions
- Smart handling of large carts

### Verification Checklist
- [ ] Cart message builder function created
- [ ] Item list formatted correctly
- [ ] Quantities displayed with each item
- [ ] Cart total calculated and formatted
- [ ] Large cart handling (>10 items) implemented
- [ ] Inquiry question options available
- [ ] Message is concise and readable
- [ ] Integration with link builder works
- [ ] Function exported and typed

---

## Task 59: Create WhatsAppButton Component

### Overview
Create a reusable WhatsAppButton component that renders a button styled with WhatsApp branding, accepts phone number and message props, and handles click events to open WhatsApp chat. This component is the core UI element used throughout the webstore for all WhatsApp click-to-chat functionality.

### Dependencies
- Task 55: Create WhatsApp Link Builder

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/marketing/whatsapp/`
   - Create directory structure if needed
   - Create `WhatsAppButton.tsx` file

2. **Define component props interface**
   - phone: string (required)
   - message: string (optional)
   - children: ReactNode (button content)
   - variant: "default" | "outline" | "icon" (optional)
   - size: "sm" | "md" | "lg" (optional)
   - className: string (optional)
   - onClick: callback (optional)

3. **Import required dependencies**
   - Import buildWhatsAppLink utility
   - Import WhatsApp icon (Task 60)
   - Import button styling utilities
   - Import tracking functions (for analytics)

4. **Implement click handler**
   - Call buildWhatsAppLink with phone and message
   - Open WhatsApp link in new tab/window
   - Fire analytics event (Task 67)
   - Call optional onClick callback

5. **Apply WhatsApp brand styling**
   - Background: WhatsApp green (#25D366)
   - Hover: Darker green (#128C7E)
   - Text: White color
   - Border radius: Rounded corners
   - Include WhatsApp icon

6. **Create variant styles**
   - Default: Solid green background, white text
   - Outline: Border only, green text, transparent bg
   - Icon: Icon only, no text, circular button

7. **Add size variants**
   - Small: Compact padding, smaller font
   - Medium: Standard button size
   - Large: Prominent button for main CTAs

8. **Implement accessibility**
   - Proper ARIA labels
   - Keyboard navigation support
   - Focus indicators
   - Descriptive alt text

9. **Add loading state (optional)**
   - Show spinner while opening link
   - Disable button during interaction
   - Provide feedback to user

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| phone | string | Yes | - | WhatsApp number |
| message | string | No | "" | Pre-filled message |
| children | ReactNode | No | "Chat on WhatsApp" | Button text |
| variant | string | No | "default" | Style variant |
| size | string | No | "md" | Button size |
| className | string | No | "" | Additional classes |
| onClick | function | No | undefined | Click callback |

### Button Variants

| Variant | Appearance | Use Case |
|---------|------------|----------|
| default | Solid green, white text | Primary CTA |
| outline | Green border, green text | Secondary action |
| icon | Icon only, circular | Floating widget |

### Size Specifications

| Size | Padding | Font Size | Icon Size | Height |
|------|---------|-----------|-----------|--------|
| sm | px-3 py-1.5 | text-sm | 16px | 32px |
| md | px-4 py-2 | text-base | 20px | 40px |
| lg | px-6 py-3 | text-lg | 24px | 48px |

### WhatsApp Brand Colors

| Purpose | Color | Hex Code |
|---------|-------|----------|
| Primary | WhatsApp Green | #25D366 |
| Hover | Dark Green | #128C7E |
| Text | White | #FFFFFF |
| Outline | WhatsApp Green | #25D366 |

### Button Structure

```
┌────────────────────────────────┐
│  [Icon]  Chat on WhatsApp      │
└────────────────────────────────┘
  └── Icon    └── Text (children)
```

### Click Behavior Flow

```
1. User Clicks Button
   └── Trigger onClick handler

2. Build WhatsApp Link
   └── Call buildWhatsAppLink(phone, message)

3. Fire Analytics Event
   └── Track: whatsapp_click

4. Open WhatsApp
   └── window.open(link, '_blank')

5. Optional Callback
   └── Execute props.onClick()
```

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| ARIA Label | "Chat on WhatsApp about [context]" |
| Role | button |
| Tab Index | 0 (keyboard accessible) |
| Focus Style | Ring with WhatsApp green |
| Screen Reader | Descriptive text |

### Styling Examples

| Variant | Tailwind Classes |
|---------|------------------|
| Default | `bg-[#25D366] hover:bg-[#128C7E] text-white` |
| Outline | `border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white` |
| Icon | `bg-[#25D366] rounded-full p-3 hover:bg-[#128C7E]` |

### Expected Outcome
- Reusable WhatsAppButton component
- Multiple style variants (default, outline, icon)
- Multiple size options (sm, md, lg)
- Proper WhatsApp brand styling
- Analytics tracking integration
- Accessibility compliance

### Verification Checklist
- [ ] `WhatsAppButton.tsx` file created
- [ ] Props interface defined completely
- [ ] Click handler opens WhatsApp correctly
- [ ] WhatsApp brand colors applied
- [ ] All variants (default, outline, icon) work
- [ ] All sizes (sm, md, lg) work
- [ ] WhatsApp icon displays correctly
- [ ] Accessibility features implemented
- [ ] Component exports properly
- [ ] TypeScript types complete

---

## Task 60: Create WhatsApp Icon

### Overview
Create or import the WhatsApp icon component to be used within WhatsAppButton and other WhatsApp-related UI elements. This ensures consistent branding with the official WhatsApp logo icon across the application.

### Dependencies
- Task 59: Create WhatsAppButton Component

### Instructions

1. **Choose icon approach**
   - Option A: Use icon library (Lucide React, React Icons)
   - Option B: Custom SVG component
   - Option C: Icon font
   - Consider consistency with other icons

2. **If using icon library (Option A)**
   - Install library if not already present
   - Import WhatsApp icon from library
   - Re-export from WhatsApp components
   - Configure size and color props

3. **If creating custom SVG (Option B)**
   - Create `WhatsAppIcon.tsx` in components/marketing/whatsapp/
   - Use official WhatsApp logo SVG path
   - Define SVG with proper viewBox
   - Add size and color props

4. **Define icon props interface**
   - size: number or string (width/height)
   - color: string (fill color)
   - className: string (additional styling)

5. **Set default WhatsApp green color**
   - Default color: #25D366 (WhatsApp brand)
   - Allow override via props
   - Ensure good contrast with backgrounds

6. **Create size variants**
   - Small: 16px
   - Medium: 20px (default)
   - Large: 24px
   - Extra Large: 32px (for widgets)

7. **Ensure accessibility**
   - Add aria-hidden="true" for decorative use
   - Or add proper ARIA label if standalone
   - Ensure SVG is properly defined

8. **Optimize SVG (if custom)**
   - Minimize path data
   - Remove unnecessary attributes
   - Ensure crisp rendering at all sizes

### Icon Implementation Options

| Option | Pros | Cons | Recommendation |
|--------|------|------|----------------|
| Lucide React | Consistent with UI, lightweight | May not have WhatsApp icon | Check availability |
| React Icons | Comprehensive library | Larger bundle | Good if already using |
| Custom SVG | Full control, official logo | Manual maintenance | Recommended |

### WhatsApp SVG Path Reference

```
Official WhatsApp Icon
├── Viewbox: 0 0 24 24
├── Primary Shape: Chat bubble
└── Secondary: Phone handset inside

Color: #25D366 (WhatsApp Green)
```

### Icon Props Interface

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| size | number \| string | No | 20 | Icon dimensions |
| color | string | No | "#25D366" | Fill color |
| className | string | No | "" | Additional styles |

### Size Specifications

| Size Name | Pixels | Use Case |
|-----------|--------|----------|
| xs | 12px | Small inline icons |
| sm | 16px | Button icons (small) |
| md | 20px | Default button icon |
| lg | 24px | Prominent buttons |
| xl | 32px | Floating widget |
| 2xl | 48px | Hero sections |

### Color Variations

| Context | Color | Hex |
|---------|-------|-----|
| Default | WhatsApp Green | #25D366 |
| Hover | Dark Green | #128C7E |
| White BG | WhatsApp Green | #25D366 |
| Dark BG | White | #FFFFFF |

### Icon Component Structure

```
<WhatsAppIcon>
  <svg viewBox="0 0 24 24">
    <path d="..." fill="currentColor"/>
  </svg>
</WhatsAppIcon>
```

### Integration with WhatsAppButton

```
<WhatsAppButton>
  <WhatsAppIcon size={20} />
  <span>Chat on WhatsApp</span>
</WhatsAppButton>
```

### Expected Outcome
- WhatsApp icon component available
- Official WhatsApp branding maintained
- Configurable size and color
- Lightweight and optimized
- Consistent across all uses

### Verification Checklist
- [ ] WhatsApp icon component created or imported
- [ ] Icon uses official WhatsApp logo design
- [ ] Default color is WhatsApp green (#25D366)
- [ ] Size prop works correctly
- [ ] Color prop allows customization
- [ ] Icon renders crisply at all sizes
- [ ] Icon integrates with WhatsAppButton
- [ ] Component exports properly
- [ ] TypeScript types defined
- [ ] Accessibility attributes added

---

## Summary

This document established the foundational WhatsApp integration infrastructure including configuration for Sri Lankan phone numbers, state management for WhatsApp numbers, link building utilities, specialized message builders for products, orders, and carts, the core WhatsAppButton component, and the WhatsApp brand icon. These components provide the building blocks for implementing WhatsApp click-to-chat functionality throughout the webstore.

### Completed Tasks
1. ✓ Created WhatsApp config with +94 Sri Lankan format
2. ✓ Created WhatsApp number store for tenant management
3. ✓ Created WhatsApp link builder (wa.me format)
4. ✓ Created product message builder with ₨ pricing
5. ✓ Created order message builder with status tracking
6. ✓ Created cart message builder with item lists
7. ✓ Created WhatsAppButton component with variants
8. ✓ Created WhatsApp icon with brand colors

### Next Steps
Proceed to [02_Tasks-61-68_Widget-Pages-Verify.md](02_Tasks-61-68_Widget-Pages-Verify.md) to create the floating WhatsApp widget, implement page-specific WhatsApp buttons, set up analytics tracking, and verify the complete integration.
