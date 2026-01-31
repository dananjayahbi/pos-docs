# Tasks 61-68: Widget, Page Buttons, and Verification

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 14 - Marketing Features  
> **Group:** D - WhatsApp Integration  
> **Document:** 02 of 02  
> **Tasks Covered:** 61, 62, 63, 64, 65, 66, 67, 68

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-53-60_Config-Builders-Button.md](01_Tasks-53-60_Config-Builders-Button.md)

---

## Document Overview

This document covers the implementation of the floating WhatsApp widget with animations and tooltips, integration of WhatsApp buttons on specific pages (product, cart, order), analytics tracking for WhatsApp interactions, and comprehensive verification of the complete WhatsApp integration. These components complete the customer engagement through WhatsApp across the webstore.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 61 | Create Floating WhatsApp Widget | Medium | 45 min |
| 62 | Create Widget Animation | Low | 25 min |
| 63 | Create Widget Tooltip | Low | 20 min |
| 64 | Create Product WhatsApp Button | Medium | 35 min |
| 65 | Create Cart WhatsApp Button | Medium | 35 min |
| 66 | Create Order WhatsApp Link | Medium | 35 min |
| 67 | Create WhatsApp Analytics | Medium | 40 min |
| 68 | Verify WhatsApp Integration | Low | 30 min |

---

## Task 61: Create Floating WhatsApp Widget

### Overview
Create a floating WhatsApp widget that appears fixed on the bottom-right corner of all webstore pages. This widget provides persistent access to WhatsApp chat with a circular button featuring the WhatsApp icon. The widget should be visible across all pages but can be configured to show/hide based on business hours or tenant settings.

### Dependencies
- Task 59: Create WhatsAppButton Component
- Task 60: Create WhatsApp Icon

### Instructions

1. **Create widget component file**
   - Navigate to `frontend/components/marketing/whatsapp/`
   - Create `FloatingWhatsAppWidget.tsx` file
   - Set up React functional component structure

2. **Define widget positioning**
   - Position: fixed
   - Bottom: 24px (1.5rem)
   - Right: 24px (1.5rem)
   - Z-index: 50 (above most content, below modals)

3. **Implement circular button design**
   - Circular shape (rounded-full)
   - WhatsApp green background (#25D366)
   - Large size (56px × 56px on desktop, 48px on mobile)
   - WhatsApp icon centered
   - Box shadow for elevation

4. **Add responsive adjustments**
   - Desktop: Bottom-right with 24px margin
   - Mobile: Slightly smaller button (48px)
   - Mobile: Adjusted position to avoid overlap with nav
   - Consider safe areas on mobile devices

5. **Implement visibility control**
   - Show/hide based on business hours
   - Show/hide based on tenant settings
   - Option to hide on specific pages
   - Manual close button (optional)

6. **Add click behavior**
   - Open WhatsApp with default message
   - Use WhatsApp number from store
   - Track click with analytics
   - Open in new tab/window

7. **Integrate with WhatsApp number store**
   - Retrieve phone number from store
   - Handle case when number not available
   - Show availability status

8. **Add accessibility features**
   - ARIA label: "Chat with us on WhatsApp"
   - Keyboard accessible (tab navigation)
   - Focus indicator
   - Screen reader friendly

### Widget Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| message | string | No | "Hi, I need help!" | Default message |
| position | object | No | {bottom: 24, right: 24} | Widget position |
| showWhenOffline | boolean | No | true | Show outside hours |
| customPhone | string | No | undefined | Override store number |
| onClose | function | No | undefined | Close callback |

### Widget Position Specifications

| Screen | Bottom | Right | Size | Z-Index |
|--------|--------|-------|------|---------|
| Desktop | 24px | 24px | 56px | 50 |
| Tablet | 20px | 20px | 52px | 50 |
| Mobile | 16px | 16px | 48px | 50 |

### Widget Structure

```
┌─────────────────────────────────────┐
│                                     │
│         Webstore Content            │
│                                     │
│                                     │
│                          ╔═══╗     │
│                          ║ W ║ ←── Widget
│                          ╚═══╝     │
└─────────────────────────────────────┘
                            ↑
                      Fixed Position
                     Bottom-Right Corner
```

### Circular Button Styling

| Property | Value | Purpose |
|----------|-------|---------|
| Shape | rounded-full | Circular |
| Background | bg-[#25D366] | WhatsApp brand |
| Size | w-14 h-14 (56px) | Prominent |
| Shadow | shadow-lg | Elevation |
| Hover | bg-[#128C7E] | Darker green |
| Transition | all 300ms | Smooth |

### Visibility Logic Flow

```
1. Check Business Hours
   ├── Within hours? → Show widget
   └── Outside hours?
       ├── showWhenOffline = true → Show
       └── showWhenOffline = false → Hide

2. Check Tenant Settings
   ├── WhatsApp enabled? → Show
   └── WhatsApp disabled? → Hide

3. Check Page Settings
   ├── Allowed page? → Show
   └── Excluded page? → Hide

4. Final Decision
   └── Show or Hide widget
```

### Mobile Positioning Considerations

```
Mobile Safe Areas
┌─────────────────────────┐
│  Status Bar             │
├─────────────────────────┤
│                         │
│  Content Area           │
│                         │
│                  ╔═══╗  │ ← Widget
│                  ║ W ║  │   (avoid notch)
├─────────────────────────┤
│  Navigation Bar         │
└─────────────────────────┘
```

### Widget States

| State | Appearance | Behavior |
|-------|------------|----------|
| Default | Green, visible | Ready to click |
| Hover | Darker green | Shows tooltip |
| Active | Pressed effect | Opening WhatsApp |
| Offline | Gray or hidden | Not available |

### Integration with Store

```
1. Widget Mounts
   └── Subscribe to WhatsApp number store

2. Retrieve Phone Number
   └── Get from store.number

3. Check Availability
   └── Get from store.isAvailable

4. User Clicks Widget
   └── Build link with buildWhatsAppLink()
       └── Open WhatsApp in new tab
```

### Expected Outcome
- Floating circular WhatsApp widget
- Fixed bottom-right position
- Responsive across all devices
- Visibility control based on settings
- Integration with number store
- Accessibility compliant

### Verification Checklist
- [ ] `FloatingWhatsAppWidget.tsx` file created
- [ ] Widget positioned correctly (bottom-right)
- [ ] Circular button with WhatsApp icon
- [ ] WhatsApp green branding applied
- [ ] Click opens WhatsApp correctly
- [ ] Responsive on mobile and desktop
- [ ] Visibility logic works correctly
- [ ] Integration with number store works
- [ ] Accessibility features implemented
- [ ] Component exports properly

---

## Task 62: Create Widget Animation

### Overview
Add smooth entrance and idle animations to the floating WhatsApp widget. Implement a bounce-in entrance animation when the widget first appears, and a subtle pulse or bounce idle animation to draw user attention periodically. Animations should be smooth, non-intrusive, and enhance rather than distract from the user experience.

### Dependencies
- Task 61: Create Floating WhatsApp Widget

### Instructions

1. **Choose animation approach**
   - Option A: CSS animations (keyframes)
   - Option B: Framer Motion library
   - Option C: Tailwind CSS animate utilities
   - Consider performance and bundle size

2. **Implement entrance animation**
   - Animation: Bounce in from bottom-right
   - Duration: 500-700ms
   - Delay: Show 3 seconds after page load
   - Easing: Ease-out or spring

3. **Create bounce-in keyframes**
   - Start: Scale 0, translate Y +50px
   - Mid: Scale 1.1 (overshoot)
   - End: Scale 1 (final position)
   - Include opacity fade-in

4. **Add idle animation**
   - Animation: Subtle pulse or bounce
   - Duration: 2-3 seconds
   - Repeat: Every 10-15 seconds
   - Effect: Scale 1 to 1.05 or subtle bounce

5. **Configure animation timing**
   - Entrance delay: 3000ms after mount
   - Idle start: After entrance completes
   - Idle interval: Every 12 seconds
   - Pause on hover

6. **Implement hover pause**
   - Pause idle animation on hover
   - Smooth transition to hover state
   - Resume animation after hover ends

7. **Add animation controls**
   - Respect prefers-reduced-motion
   - Option to disable animations
   - Smooth animation cancellation

8. **Optimize performance**
   - Use transform instead of position
   - Use scale instead of width/height
   - Enable GPU acceleration (will-change)
   - Avoid layout thrashing

### Animation Types

| Animation | When | Duration | Effect |
|-----------|------|----------|--------|
| Entrance | On mount | 600ms | Bounce in |
| Idle | Periodic | 2s | Subtle pulse |
| Hover | On hover | 300ms | Scale up |
| Click | On click | 200ms | Scale down |

### Entrance Animation Sequence

```
Timeline:
0ms      - Page loads, widget hidden
3000ms   - Animation starts
3100ms   - Widget appears (opacity 0 → 1)
3300ms   - Bounces up (scale 0 → 1.1)
3600ms   - Settles (scale 1.1 → 1)
3600ms+  - Fully visible, entrance complete
```

### Bounce-In Keyframes (CSS)

```
@keyframes bounceIn
├── 0%: scale(0), translateY(50px), opacity(0)
├── 50%: scale(1.1), translateY(-5px), opacity(1)
└── 100%: scale(1), translateY(0), opacity(1)
```

### Idle Animation Pattern

```
Idle Cycle (12 seconds)
├── 0-10s: No animation (rest)
├── 10-12s: Pulse animation
│   ├── 0%: scale(1)
│   ├── 50%: scale(1.05)
│   └── 100%: scale(1)
└── Repeat
```

### Animation Properties

| Property | Value | Reason |
|----------|-------|--------|
| transform | scale, translateY | GPU accelerated |
| opacity | 0 to 1 | Smooth fade |
| will-change | transform | Hint browser |
| animation-timing | ease-out | Natural feel |

### Framer Motion Variants

| Variant | Properties | Use Case |
|---------|------------|----------|
| initial | scale: 0, y: 50, opacity: 0 | Starting state |
| animate | scale: 1, y: 0, opacity: 1 | Entrance |
| hover | scale: 1.05 | Hover effect |
| tap | scale: 0.95 | Click feedback |

### Accessibility Considerations

```
prefers-reduced-motion: reduce
├── Disable entrance animation
├── Disable idle animation
└── Keep only essential transitions
```

### Performance Optimization

| Technique | Implementation |
|-----------|----------------|
| GPU Acceleration | use transform properties |
| Layout Stability | avoid width/height animations |
| Will-Change | hint browser for optimization |
| Debounce | limit animation triggers |

### Animation State Machine

```
States:
1. Hidden (before delay)
   └── Wait 3 seconds

2. Entering (bounce in)
   └── Run entrance animation

3. Visible (idle state)
   └── Run periodic pulse

4. Hovering
   └── Pause idle, show hover effect

5. Clicking
   └── Scale down briefly
```

### Expected Outcome
- Smooth bounce-in entrance animation
- Periodic subtle idle animation
- Hover and click animations
- Respects motion preferences
- Performance optimized

### Verification Checklist
- [ ] Entrance animation implemented (bounce-in)
- [ ] Animation delays 3 seconds after page load
- [ ] Idle animation pulses periodically
- [ ] Animations pause on hover
- [ ] prefers-reduced-motion respected
- [ ] Animations are smooth (60fps)
- [ ] No layout shifts during animation
- [ ] GPU acceleration enabled
- [ ] Performance tested on mobile

---

## Task 63: Create Widget Tooltip

### Overview
Add a tooltip to the floating WhatsApp widget that displays on hover with text like "Chat with us!" or "Need help? Message us on WhatsApp". The tooltip should appear to the left of the widget, be responsive, and provide clear context about the widget's purpose before users click.

### Dependencies
- Task 61: Create Floating WhatsApp Widget

### Instructions

1. **Create tooltip component**
   - Option A: Add to FloatingWhatsAppWidget.tsx
   - Option B: Separate Tooltip component
   - Option C: Use UI library tooltip
   - Consider reusability

2. **Define tooltip content**
   - Primary text: "Chat with us!"
   - Alternative: "Need help? Message us"
   - Keep concise (max 3-5 words)
   - Support multi-language

3. **Position tooltip**
   - Position: To the left of widget
   - Alignment: Vertically centered
   - Spacing: 12px gap from widget
   - Arrow pointing to widget

4. **Implement show/hide logic**
   - Show on hover (desktop)
   - Show on focus (keyboard navigation)
   - Hide after 3 seconds (optional)
   - Hide on click

5. **Style tooltip**
   - Background: Dark gray or black (#1F2937)
   - Text: White
   - Padding: px-3 py-2
   - Border radius: rounded-lg
   - Box shadow for depth
   - Arrow/pointer to widget

6. **Add tooltip animation**
   - Fade in (opacity 0 → 1)
   - Slide in from right slightly
   - Duration: 200-300ms
   - Smooth transition

7. **Handle mobile behavior**
   - Consider not showing on mobile (tap to use)
   - Or show briefly on first view
   - Avoid blocking content

8. **Add accessibility**
   - Use aria-label on widget itself
   - Tooltip is supplementary visual aid
   - Ensure keyboard accessible

### Tooltip Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| text | string | No | "Chat with us!" | Tooltip content |
| position | string | No | "left" | Tooltip position |
| showArrow | boolean | No | true | Show pointer arrow |
| autoHide | boolean | No | false | Hide after delay |

### Tooltip Position Layout

```
┌────────────────────────────────────┐
│                                    │
│                                    │
│              ┌──────────────┐     │
│              │ Chat with us!│→ ╔══╗│
│              └──────────────┘  ║W ║│
│                 ↑ Tooltip     ╚══╝│
│                                    │
└────────────────────────────────────┘
```

### Tooltip Styling Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Background | bg-gray-800 | Dark contrast |
| Text | text-white text-sm | Readable |
| Padding | px-3 py-2 | Breathing room |
| Radius | rounded-lg | Smooth corners |
| Shadow | shadow-lg | Elevation |
| Whitespace | nowrap | Single line |

### Tooltip Content Examples

| Context | Tooltip Text |
|---------|--------------|
| General | "Chat with us!" |
| Sales | "Got questions? Ask us!" |
| Support | "Need help? Message us" |
| Orders | "Track your order" |
| Sinhala | "අප සමඟ කතා කරන්න!" |
| Tamil | "எங்களிடம் பேசுங்கள்!" |

### Show/Hide Triggers

| Trigger | Action | Duration |
|---------|--------|----------|
| Mouse Enter | Show tooltip | Instant |
| Mouse Leave | Hide tooltip | Instant |
| Focus | Show tooltip | Instant |
| Blur | Hide tooltip | Instant |
| Auto (optional) | Hide after delay | 3000ms |

### Tooltip Arrow Implementation

```
CSS Triangle (Arrow)
├── Position: absolute
├── Right: -6px (points to widget)
├── Border: transparent on 3 sides
└── Border-left: matches tooltip color

Result:
┌──────────────┐
│ Chat with us!├→
└──────────────┘
```

### Animation Sequence

```
Hover Event
├── 0ms: opacity: 0, x: 5px
├── 200ms: opacity: 1, x: 0px
└── Tooltip fully visible

Leave Event
├── 0ms: opacity: 1
├── 200ms: opacity: 0
└── Tooltip hidden
```

### Responsive Behavior

| Device | Tooltip Behavior |
|--------|------------------|
| Desktop | Show on hover |
| Tablet | Show on hover |
| Mobile | Don't show (or brief flash) |
| Touch Device | Show on long press (optional) |

### Accessibility Implementation

| Feature | Implementation |
|---------|----------------|
| ARIA | aria-describedby on widget |
| Role | role="tooltip" on tooltip |
| Focus | Visible on keyboard focus |
| Contrast | Meets WCAG AA standards |

### Expected Outcome
- Tooltip appears on hover/focus
- Positioned to the left of widget
- Clear, concise messaging
- Smooth fade animation
- Accessible and responsive

### Verification Checklist
- [ ] Tooltip displays on hover
- [ ] Tooltip text is clear and concise
- [ ] Positioned correctly (left of widget)
- [ ] Arrow points to widget
- [ ] Smooth fade-in animation
- [ ] Hides on mouse leave
- [ ] Mobile behavior appropriate
- [ ] Accessibility features implemented
- [ ] Contrast ratio meets standards

---

## Task 64: Create Product WhatsApp Button

### Overview
Create a specialized WhatsApp button component for product detail pages (PDP) that pre-fills a message with product information. This button allows customers to inquire about specific products directly via WhatsApp with all relevant product details automatically included in the message.

### Dependencies
- Task 56: Create Product Message Builder
- Task 59: Create WhatsAppButton Component

### Instructions

1. **Create product button component**
   - Navigate to `frontend/components/marketing/whatsapp/`
   - Create `ProductWhatsAppButton.tsx` file
   - Extend or wrap WhatsAppButton component

2. **Define component props**
   - product: Product object (required)
   - customMessage: string (optional)
   - variant: "default" | "outline" | "icon"
   - size: "sm" | "md" | "lg"
   - showIcon: boolean

3. **Integrate product message builder**
   - Import buildProductMessage utility
   - Pass product object to builder
   - Receive formatted message
   - Pass to WhatsAppButton

4. **Retrieve WhatsApp number**
   - Get phone from WhatsApp number store
   - Handle case when number not available
   - Show error or disable button

5. **Position on product page**
   - Location 1: Near "Add to Cart" button
   - Location 2: Product info section
   - Make prominent but not primary CTA
   - Responsive placement

6. **Customize button text**
   - Default: "Ask about this product"
   - With icon: Icon + "Ask on WhatsApp"
   - Mobile: "Ask" or icon only
   - Multi-language support

7. **Add click analytics**
   - Track: whatsapp_product_click
   - Include: product ID, product name
   - Send to analytics (Task 67)

8. **Handle edge cases**
   - Product out of stock: "When available?"
   - No WhatsApp number: Hide or disable
   - Missing product data: Fallback message

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| product | Product | Yes | - | Product data |
| customMessage | string | No | undefined | Override message |
| variant | string | No | "default" | Button style |
| size | string | No | "md" | Button size |
| className | string | No | "" | Additional classes |
| showIcon | boolean | No | true | Show WhatsApp icon |

### Product Page Button Placement

```
Product Detail Page Layout
┌────────────────────────────────────┐
│  Product Images                    │
│  ┌──────────┐                      │
│  │  Image   │  Product Name        │
│  │          │  Price: ₨XX,XXX      │
│  └──────────┘  ⭐⭐⭐⭐⭐           │
│                                     │
│  [  Add to Cart  ]                 │
│  [📞 Ask on WhatsApp]  ←── Button │
│                                     │
│  Description...                    │
└────────────────────────────────────┘
```

### Button Text Options

| Context | Button Text | Icon |
|---------|-------------|------|
| Desktop | "Ask about this product" | ✓ |
| Desktop Short | "Ask on WhatsApp" | ✓ |
| Mobile | "Ask" | ✓ |
| Icon Only | - | ✓ |

### Pre-filled Message Example

```
User clicks button on "Rice Cooker" product
└── Generate message via buildProductMessage()
    └── Result:
        "Hi, I'm interested in:
        
        *Philips Rice Cooker 1.8L*
        Price: ₨12,500
        https://store.lk/products/rice-cooker
        
        Is this available?"
```

### Product Object Requirements

| Field | Type | Used For |
|-------|------|----------|
| id | string | Analytics |
| name | string | Message |
| price | number | Message (₨ formatted) |
| slug | string | URL construction |
| inStock | boolean | Button text variation |

### Button Positioning Options

| Location | Position | Priority |
|----------|----------|----------|
| Primary CTA Area | Next to Add to Cart | High |
| Product Info | Below price | Medium |
| Sticky Bar (mobile) | Bottom of screen | High |
| Floating Widget | Always visible | Medium |

### Stock Status Variations

| Stock Status | Button Text | Message Variation |
|--------------|-------------|-------------------|
| In Stock | "Ask about this product" | "Is this available?" |
| Out of Stock | "Ask when available" | "When will this be available?" |
| Low Stock | "Ask about availability" | "How many are left?" |
| Pre-Order | "Ask about pre-order" | "When will this ship?" |

### Analytics Event Data

| Property | Value | Purpose |
|----------|-------|---------|
| event | whatsapp_product_click | Event name |
| product_id | product.id | Track product |
| product_name | product.name | Context |
| product_price | product.price | Analysis |
| source | "product_page" | Tracking |

### Error Handling

| Error | UI Behavior | User Message |
|-------|-------------|--------------|
| No phone | Hide button | - |
| No product | Disable button | "Product info unavailable" |
| Network error | Show retry | "Failed to open WhatsApp" |

### Expected Outcome
- Product-specific WhatsApp button component
- Automatic message pre-filling with product details
- Strategic placement on product pages
- Analytics tracking integration
- Responsive and accessible

### Verification Checklist
- [ ] `ProductWhatsAppButton.tsx` file created
- [ ] Button integrates buildProductMessage()
- [ ] Product data passed correctly
- [ ] Message includes name, price, URL
- [ ] Button positioned appropriately on PDP
- [ ] Click opens WhatsApp with pre-filled message
- [ ] Analytics event fires on click
- [ ] Button text responsive (desktop/mobile)
- [ ] Stock status variations work
- [ ] Component exports properly

---

## Task 65: Create Cart WhatsApp Button

### Overview
Create a specialized WhatsApp button for the shopping cart page that pre-fills a message with all cart items, quantities, and total amount. This button enables customers to quickly get help with their cart or proceed with checkout assistance via WhatsApp.

### Dependencies
- Task 58: Create Cart Message Builder
- Task 59: Create WhatsAppButton Component

### Instructions

1. **Create cart button component**
   - Navigate to `frontend/components/marketing/whatsapp/`
   - Create `CartWhatsAppButton.tsx` file
   - Extend or wrap WhatsAppButton component

2. **Define component props**
   - cartItems: CartItem[] (required)
   - cartTotal: number (required)
   - inquiryType: "help" | "proceed" | "discount"
   - variant: "default" | "outline"
   - size: "sm" | "md" | "lg"

3. **Integrate cart message builder**
   - Import buildCartMessage utility
   - Pass cart items and total
   - Receive formatted message with item list
   - Pass to WhatsAppButton

4. **Retrieve WhatsApp number**
   - Get phone from WhatsApp number store
   - Handle unavailability gracefully

5. **Position on cart page**
   - Location 1: Cart summary section
   - Location 2: Below total amount
   - Location 3: Empty cart state
   - Make accessible but not primary CTA

6. **Customize button text**
   - Default: "Need help with your cart?"
   - Proceed: "Complete order on WhatsApp"
   - Empty cart: "Chat with us"
   - Include icon

7. **Handle cart states**
   - Empty cart: Generic message
   - Single item: Simplified message
   - Many items: Truncated list
   - High value: Emphasize amount

8. **Add click analytics**
   - Track: whatsapp_cart_click
   - Include: item count, cart total
   - Include: inquiry type
   - Send to analytics

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| cartItems | CartItem[] | Yes | - | Items in cart |
| cartTotal | number | Yes | - | Total amount |
| inquiryType | string | No | "help" | Message type |
| variant | string | No | "default" | Button style |
| size | string | No | "md" | Button size |
| className | string | No | "" | Additional classes |

### Cart Page Button Placement

```
Shopping Cart Layout
┌────────────────────────────────────┐
│  Your Cart (3 items)               │
│  ┌──────────────────────────────┐ │
│  │ Item 1  Qty: 2   ₨5,000     │ │
│  │ Item 2  Qty: 1   ₨3,500     │ │
│  │ Item 3  Qty: 3   ₨2,100     │ │
│  └──────────────────────────────┘ │
│                                     │
│  Subtotal: ₨10,600                 │
│  [  Proceed to Checkout  ]         │
│  [📞 Need help?]  ←── Button      │
└────────────────────────────────────┘
```

### Button Text Variations

| Scenario | Button Text |
|----------|-------------|
| Normal Cart | "Need help with your cart?" |
| Large Cart | "Complete order on WhatsApp" |
| Empty Cart | "Chat with us" |
| High Value | "Get assistance with order" |

### Pre-filled Message Example

```
User clicks button with 3 items in cart
└── Generate message via buildCartMessage()
    └── Result:
        "Hi, I have items in my cart:
        
        - Rice Cooker (Qty: 1)
        - Tea Packets (Qty: 3)
        - Sugar 1kg (Qty: 2)
        
        Total: ₨15,050
        
        Can I proceed with this order?"
```

### Inquiry Type Messages

| Type | Question |
|------|----------|
| help | "Can you help me with this?" |
| proceed | "Can I proceed with this order?" |
| discount | "Is there a discount available?" |
| stock | "Are all items in stock?" |
| delivery | "What's the delivery time?" |

### Cart State Scenarios

| State | Items | Button Behavior |
|-------|-------|-----------------|
| Empty | 0 | Generic greeting message |
| Single | 1 | Simpler format |
| Normal | 2-10 | Full item list |
| Large | 10+ | Truncated list |

### Cart Summary in Message

```
Cart with 5 items (Total: ₨25,500)
└── Message includes:
    ├── Item 1 (Qty: 2)
    ├── Item 2 (Qty: 1)
    ├── Item 3 (Qty: 3)
    ├── Item 4 (Qty: 1)
    ├── Item 5 (Qty: 2)
    └── Total: ₨25,500

Cart with 15 items (Total: ₨45,000)
└── Message includes:
    ├── Item 1 (Qty: 2)
    ├── Item 2 (Qty: 1)
    ├── ...and 13 more items
    └── Total: ₨45,000
```

### Analytics Event Data

| Property | Value | Purpose |
|----------|-------|---------|
| event | whatsapp_cart_click | Event name |
| item_count | cartItems.length | Context |
| cart_total | cartTotal | Value |
| inquiry_type | inquiryType | Intent |
| source | "cart_page" | Tracking |

### Empty Cart Handling

| State | Button Display | Message |
|-------|----------------|---------|
| Empty | Show button | "Hi, I'm browsing your store" |
| Empty | Alternative: Hide button | - |
| Empty | Show as help | "I need help finding products" |

### Expected Outcome
- Cart-specific WhatsApp button component
- Automatic message with cart items and total
- Strategic placement on cart page
- Support for different inquiry types
- Analytics tracking integration

### Verification Checklist
- [ ] `CartWhatsAppButton.tsx` file created
- [ ] Button integrates buildCartMessage()
- [ ] Cart items formatted in message
- [ ] Cart total included with ₨ symbol
- [ ] Button positioned on cart page
- [ ] Large cart truncation works
- [ ] Empty cart handled gracefully
- [ ] Inquiry type variations work
- [ ] Analytics event fires on click
- [ ] Component exports properly

---

## Task 66: Create Order WhatsApp Link

### Overview
Create a WhatsApp link component for order detail pages that pre-fills a message with order information including order ID, status, and inquiry. This enables customers to quickly contact support about specific orders directly via WhatsApp with context already included.

### Dependencies
- Task 57: Create Order Message Builder
- Task 59: Create WhatsAppButton Component

### Instructions

1. **Create order link component**
   - Navigate to `frontend/components/marketing/whatsapp/`
   - Create `OrderWhatsAppLink.tsx` file
   - Can be button or text link with icon

2. **Define component props**
   - order: Order object (required)
   - inquiryType: "status" | "shipping" | "modify" | "cancel"
   - variant: "button" | "link"
   - size: "sm" | "md" | "lg"
   - className: string

3. **Integrate order message builder**
   - Import buildOrderMessage utility
   - Pass order object and inquiry type
   - Receive formatted message
   - Pass to WhatsAppButton or link

4. **Retrieve WhatsApp number**
   - Get phone from WhatsApp number store
   - Handle missing number

5. **Position on order page**
   - Location 1: Order actions section
   - Location 2: Order status card
   - Location 3: Order tracking section
   - Clear and accessible

6. **Customize link/button text**
   - Button: "Ask about this order"
   - Link: "Contact us on WhatsApp"
   - Icon: WhatsApp icon + text
   - Responsive sizing

7. **Add status-aware messaging**
   - Pending: "When will this process?"
   - Shipped: "Track my delivery"
   - Delivered: "Order support"
   - Adapt inquiry based on status

8. **Add click analytics**
   - Track: whatsapp_order_click
   - Include: order ID, status
   - Include: inquiry type
   - Send to analytics

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| order | Order | Yes | - | Order data |
| inquiryType | string | No | "status" | Message type |
| variant | string | No | "button" | Display style |
| size | string | No | "md" | Size |
| className | string | No | "" | Additional classes |
| showIcon | boolean | No | true | Show WhatsApp icon |

### Order Page Link Placement

```
Order Detail Page Layout
┌────────────────────────────────────┐
│  Order #ORD-12345                  │
│  Status: Shipped                   │
│  Date: 28/01/2026                  │
│  Total: ₨15,500                    │
│                                     │
│  📦 Tracking: TRK123456            │
│  [📞 Track on WhatsApp]  ←── Link │
│                                     │
│  Items in Order...                 │
└────────────────────────────────────┘
```

### Display Style Options

| Variant | Appearance | Use Case |
|---------|------------|----------|
| button | Full button | Primary action |
| link | Text with icon | Secondary action |
| icon | Icon only | Compact layout |

### Pre-filled Message Example

```
User clicks link on order with status "Shipped"
└── Generate message via buildOrderMessage()
    └── Result:
        "Hi, about my order:
        
        Order ID: #ORD-12345
        Status: Shipped
        Tracking: TRK123456
        Total: ₨15,500
        
        Where is my delivery?"
```

### Order Object Requirements

| Field | Type | Used For |
|-------|------|----------|
| id | string | Analytics |
| orderNumber | string | Message |
| status | string | Message + inquiry |
| date | Date | Message |
| total | number | Message (₨ formatted) |
| trackingNumber | string | Message (if available) |

### Status-Aware Inquiry Types

| Status | Default Inquiry | Alternative Questions |
|--------|----------------|----------------------|
| Pending | "When will this be processed?" | "Can I modify?" |
| Processing | "When will this ship?" | "What's the status?" |
| Packed | "When will it be picked up?" | "Shipping today?" |
| Shipped | "Where is my delivery?" | "Estimated time?" |
| Delivered | "I need help with this order" | "Return/Exchange?" |
| Cancelled | "Why was this cancelled?" | "Can I reorder?" |

### Link Text Variations

| Context | Link/Button Text |
|---------|------------------|
| General | "Ask about this order" |
| Tracking | "Track on WhatsApp" |
| Status | "Get order status" |
| Support | "Contact support" |
| Modify | "Request changes" |

### Order Status Card Integration

```
┌──────────────────────────────────┐
│  Order Status: Shipped           │
│  ⬤⬤⬤⬤◯ Progress Bar            │
│                                   │
│  Tracking: TRK123456             │
│  Est. Delivery: Tomorrow          │
│                                   │
│  [📞 Track on WhatsApp]          │
└──────────────────────────────────┘
```

### Analytics Event Data

| Property | Value | Purpose |
|----------|-------|---------|
| event | whatsapp_order_click | Event name |
| order_id | order.id | Track order |
| order_status | order.status | Context |
| inquiry_type | inquiryType | Intent |
| order_value | order.total | Analysis |
| source | "order_page" | Tracking |

### Error Handling

| Error | UI Behavior |
|-------|-------------|
| No phone | Hide link |
| No order | Disable link |
| Invalid order | Generic message |

### Expected Outcome
- Order-specific WhatsApp link/button
- Automatic message with order details
- Status-aware inquiry questions
- Flexible display styles (button/link)
- Analytics tracking integration

### Verification Checklist
- [ ] `OrderWhatsAppLink.tsx` file created
- [ ] Component integrates buildOrderMessage()
- [ ] Order ID and status included in message
- [ ] Tracking number included when available
- [ ] Status-aware inquiry types work
- [ ] Button and link variants implemented
- [ ] Link positioned on order pages
- [ ] Click opens WhatsApp correctly
- [ ] Analytics event fires on click
- [ ] Component exports properly

---

## Task 67: Create WhatsApp Analytics

### Overview
Implement analytics tracking for all WhatsApp interactions across the webstore. Track button clicks, widget interactions, and conversions to measure the effectiveness of WhatsApp integration and understand customer behavior. Integrate with the existing analytics platform (Google Analytics, Mixpanel, or custom).

### Dependencies
- Task 59: Create WhatsAppButton Component
- Task 61: Create Floating WhatsApp Widget

### Instructions

1. **Choose analytics platform**
   - Option A: Google Analytics 4 (GA4)
   - Option B: Mixpanel
   - Option C: Custom analytics endpoint
   - Check existing implementation

2. **Create analytics utility file**
   - Navigate to `frontend/lib/analytics/` or `frontend/utils/`
   - Create `whatsapp-analytics.ts` file
   - Import analytics SDK or functions

3. **Define event tracking functions**
   - trackWhatsAppClick(source, context)
   - trackWhatsAppView(widget)
   - trackWhatsAppConversion(orderId)
   - Generic trackEvent wrapper

4. **Implement click event tracking**
   - Event name: "whatsapp_click"
   - Parameters: source, product_id, order_id, cart_value
   - Context: page URL, user ID (if available)
   - Timestamp

5. **Track different sources**
   - floating_widget: Floating widget clicks
   - product_page: Product button clicks
   - cart_page: Cart button clicks
   - order_page: Order link clicks

6. **Add contextual data**
   - Product clicks: Include product ID and name
   - Cart clicks: Include cart item count and total
   - Order clicks: Include order ID and status
   - Generic: Include page URL

7. **Implement view tracking (optional)**
   - Track widget impressions
   - Track button views on pages
   - Use Intersection Observer
   - Debounce to avoid spam

8. **Add conversion tracking**
   - Track if WhatsApp led to order
   - Use session storage or cookies
   - Set flag on WhatsApp click
   - Check on order completion

9. **Integrate with all WhatsApp components**
   - Update WhatsAppButton component
   - Update ProductWhatsAppButton
   - Update CartWhatsAppButton
   - Update OrderWhatsAppLink
   - Update FloatingWhatsAppWidget

10. **Add error tracking**
    - Track failed link generation
    - Track missing phone numbers
    - Log analytics errors silently
    - Don't block user actions

11. **Implement privacy compliance**
    - Respect user consent
    - Check analytics opt-in status
    - Comply with GDPR/CCPA
    - Anonymous tracking option

### Analytics Events

| Event Name | When | Data Included |
|------------|------|---------------|
| whatsapp_click | Any WhatsApp button clicked | source, context, value |
| whatsapp_widget_view | Floating widget viewed | page_url, session_id |
| whatsapp_conversion | Order placed after click | order_id, order_value |
| whatsapp_error | Error occurred | error_type, error_message |

### Event Parameters

| Parameter | Type | Example | Use Case |
|-----------|------|---------|----------|
| source | string | "product_page" | Track origin |
| product_id | string | "prod_123" | Product context |
| product_name | string | "Rice Cooker" | Reporting |
| order_id | string | "ord_456" | Order context |
| cart_total | number | 15500 | Value tracking |
| item_count | number | 3 | Cart size |

### Click Tracking Implementation

```
User clicks WhatsApp button
├── 1. Capture click event
├── 2. Gather context data
│   ├── Source (widget/product/cart/order)
│   ├── Product ID (if applicable)
│   ├── Cart value (if applicable)
│   └── Page URL
├── 3. Call trackWhatsAppClick()
├── 4. Send to analytics platform
└── 5. Continue with WhatsApp opening
```

### Source Tracking Matrix

| Source | Context Data | Example Values |
|--------|-------------|----------------|
| floating_widget | page_url | "/products/rice-cooker" |
| product_page | product_id, product_name, price | "prod_123", "Rice Cooker", 12500 |
| cart_page | item_count, cart_total | 3, 15500 |
| order_page | order_id, order_status, order_value | "ord_456", "shipped", 15500 |

### Google Analytics 4 Event Format

```
Event: whatsapp_click
Parameters:
  - source: "product_page"
  - product_id: "prod_123"
  - product_name: "Rice Cooker"
  - value: 12500
  - currency: "LKR"
  - page_url: "/products/rice-cooker"
```

### Conversion Attribution Flow

```
1. User Clicks WhatsApp Button
   └── Set flag: sessionStorage.setItem('whatsapp_intent', 'true')
       └── Include: timestamp, source, context

2. User Returns to Site
   └── Check flag: sessionStorage.getItem('whatsapp_intent')

3. User Completes Order
   └── If flag exists:
       ├── Track conversion: whatsapp_conversion
       ├── Include: order_id, order_value
       └── Clear flag
```

### Analytics Function Interface

| Function | Parameters | Returns | Purpose |
|----------|------------|---------|---------|
| trackWhatsAppClick | (source, context?) | void | Track clicks |
| trackWhatsAppView | (widget) | void | Track views |
| trackWhatsAppConversion | (orderId, value) | void | Track sales |
| isAnalyticsEnabled | () | boolean | Check consent |

### Privacy Compliance

| Requirement | Implementation |
|-------------|----------------|
| Consent Check | Check user analytics preference |
| Anonymous Mode | Track without user ID if no consent |
| Data Minimization | Only track necessary data |
| Opt-Out | Respect DNT header |

### Error Tracking

| Error Type | Event Data | Action |
|------------|------------|--------|
| Missing Phone | "whatsapp_error: no_phone" | Log, don't block |
| Link Build Fail | "whatsapp_error: link_failed" | Log, don't block |
| Analytics Fail | Silent fail | Don't retry |

### Integration Points

```
Component: WhatsAppButton
└── onClick handler
    ├── Build link
    ├── Track event ← trackWhatsAppClick()
    └── Open WhatsApp

Component: FloatingWhatsAppWidget
└── useEffect (visibility)
    └── Track view ← trackWhatsAppView()

Page: Order Confirmation
└── useEffect
    └── Check WhatsApp flag
        └── Track conversion ← trackWhatsAppConversion()
```

### Expected Outcome
- Comprehensive WhatsApp analytics tracking
- Click tracking for all WhatsApp interactions
- Source and context data collection
- Conversion attribution
- Privacy compliant implementation

### Verification Checklist
- [ ] Analytics utility file created
- [ ] trackWhatsAppClick function implemented
- [ ] All WhatsApp components integrated with tracking
- [ ] Source parameter tracked correctly
- [ ] Product/cart/order context included
- [ ] Conversion tracking implemented
- [ ] Privacy consent checked
- [ ] Error tracking doesn't block UI
- [ ] Analytics events visible in platform
- [ ] Functions exported and typed

---

## Task 68: Verify WhatsApp Integration

### Overview
Conduct comprehensive verification and testing of the complete WhatsApp integration across all components, pages, and scenarios. Ensure all WhatsApp buttons work correctly, messages are formatted properly, analytics track accurately, and the integration provides a seamless experience across devices and browsers.

### Dependencies
- Task 67: Create WhatsApp Analytics
- All previous tasks (53-67) complete

### Instructions

1. **Create verification checklist**
   - List all WhatsApp components
   - List all integration points
   - Define test scenarios
   - Define success criteria

2. **Test WhatsApp configuration**
   - Verify Sri Lankan phone format (+94)
   - Test phone number validation
   - Test tenant-specific numbers
   - Test fallback to default

3. **Test message builders**
   - Product messages: Verify formatting
   - Order messages: Verify all fields
   - Cart messages: Verify item lists
   - Test with edge cases (empty, large)

4. **Test WhatsApp buttons**
   - Test all button variants (default, outline, icon)
   - Test all sizes (sm, md, lg)
   - Test hover and click states
   - Test disabled states

5. **Test page integrations**
   - Product page button
   - Cart page button
   - Order page link
   - Test on all relevant pages

6. **Test floating widget**
   - Widget appears correctly
   - Position: bottom-right
   - Animations work smoothly
   - Tooltip appears on hover
   - Click opens WhatsApp

7. **Test responsive behavior**
   - Desktop: All features work
   - Tablet: Layout adjusts
   - Mobile: Buttons appropriately sized
   - Test widget on mobile

8. **Test WhatsApp link opening**
   - Links open in new tab
   - wa.me format correct
   - Messages pre-filled correctly
   - Works on desktop and mobile

9. **Test analytics tracking**
   - Click events fire correctly
   - Source parameter captured
   - Context data included
   - Events visible in analytics dashboard

10. **Test edge cases**
    - Missing WhatsApp number
    - Invalid phone format
    - Empty cart
    - Out of stock products
    - Cancelled orders

11. **Test accessibility**
    - Keyboard navigation works
    - Screen reader compatible
    - Focus indicators visible
    - ARIA labels present

12. **Test browser compatibility**
    - Chrome/Edge
    - Firefox
    - Safari
    - Mobile browsers

13. **Create test scenarios document**
    - Document test cases
    - Record results
    - Note any issues
    - Document resolutions

### Verification Checklist

#### Configuration & Setup
- [ ] WhatsApp config file exists
- [ ] Sri Lankan phone format (+94) configured
- [ ] WhatsApp number store works
- [ ] Tenant numbers load correctly
- [ ] Fallback to default number works

#### Message Builders
- [ ] Product message includes name, price, URL
- [ ] Order message includes ID, status, tracking
- [ ] Cart message includes item list and total
- [ ] Messages format correctly with ₨ symbol
- [ ] Long messages truncate appropriately

#### Components
- [ ] WhatsAppButton component works
- [ ] WhatsApp icon displays correctly
- [ ] All button variants render correctly
- [ ] All button sizes work
- [ ] Hover and click states function

#### Page Integrations
- [ ] Product page button appears and works
- [ ] Cart page button appears and works
- [ ] Order page link appears and works
- [ ] Buttons positioned correctly
- [ ] Messages pre-filled correctly

#### Floating Widget
- [ ] Widget appears bottom-right
- [ ] Widget is fixed position
- [ ] Entrance animation works
- [ ] Idle animation works
- [ ] Tooltip appears on hover
- [ ] Click opens WhatsApp
- [ ] Responsive on mobile

#### WhatsApp Functionality
- [ ] Links open in new tab
- [ ] wa.me URLs formatted correctly
- [ ] Phone numbers formatted correctly
- [ ] Messages URL-encoded properly
- [ ] WhatsApp opens on desktop
- [ ] WhatsApp opens on mobile

#### Analytics
- [ ] Click events tracked
- [ ] Source parameter correct
- [ ] Product context captured
- [ ] Cart context captured
- [ ] Order context captured
- [ ] Events visible in analytics

#### Responsive Design
- [ ] Desktop layout correct
- [ ] Tablet layout adjusts
- [ ] Mobile layout works
- [ ] Buttons sized appropriately
- [ ] Widget positioned correctly

#### Accessibility
- [ ] Keyboard navigation works
- [ ] Tab order logical
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Screen reader compatible

#### Edge Cases
- [ ] Missing phone number handled
- [ ] Empty cart handled
- [ ] Out of stock handled
- [ ] Invalid product handled
- [ ] Network errors handled

### Test Scenarios

| Scenario | Steps | Expected Result |
|----------|-------|-----------------|
| Product Inquiry | Visit product page → Click WhatsApp button | Opens WhatsApp with product details |
| Cart Help | Add items → Visit cart → Click WhatsApp button | Opens with cart item list |
| Order Tracking | View order → Click WhatsApp link | Opens with order ID and status |
| Widget Click | Scroll on any page → Click widget | Opens with generic greeting |
| Mobile Usage | Visit on mobile → Click any button | Opens WhatsApp app |

### Browser Testing Matrix

| Browser | Desktop | Mobile | Notes |
|---------|---------|--------|-------|
| Chrome | ✓ Test | ✓ Test | Primary browser |
| Firefox | ✓ Test | ✓ Test | Check formatting |
| Safari | ✓ Test | ✓ Test | iOS WhatsApp |
| Edge | ✓ Test | - | Windows users |

### Message Format Verification

| Message Type | Check | Example |
|--------------|-------|---------|
| Product | Name, price, URL | "Hi, I'm interested in:\n\n*Rice Cooker*\nPrice: ₨12,500..." |
| Order | ID, status, total | "Hi, about my order:\n\nOrder ID: #ORD-12345..." |
| Cart | Items, quantities, total | "Hi, I have items in my cart:\n\n- Item 1 (Qty: 2)..." |

### Analytics Verification

```
Test: Click Product Button
1. Open browser console
2. Click product WhatsApp button
3. Check network tab for analytics call
4. Verify event: "whatsapp_click"
5. Verify parameters: source, product_id
6. Check analytics dashboard
7. Confirm event logged
```

### Performance Checks

| Metric | Target | Test Method |
|--------|--------|-------------|
| Widget Load Time | < 100ms | DevTools Performance |
| Button Response | < 50ms | Click to action |
| Animation Smoothness | 60fps | Visual inspection |
| Analytics Delay | < 100ms | Network tab |

### Documentation Requirements

| Document | Content | Purpose |
|----------|---------|---------|
| Test Results | Pass/fail for each check | Record testing |
| Issues Log | Any bugs found | Track resolutions |
| User Guide | How to use WhatsApp features | End-user help |
| Admin Guide | Configure WhatsApp numbers | Tenant setup |

### Issue Resolution

| Issue | Severity | Action |
|-------|----------|--------|
| Button not appearing | High | Fix immediately |
| Wrong phone format | High | Fix immediately |
| Analytics not tracking | Medium | Fix before deploy |
| Minor style issue | Low | Document for later |

### Expected Outcome
- Complete WhatsApp integration verified
- All components tested across devices
- Edge cases handled properly
- Analytics tracking confirmed
- Documentation complete
- Ready for production deployment

### Verification Checklist Summary
- [ ] All configuration verified
- [ ] All message builders tested
- [ ] All components function correctly
- [ ] All page integrations work
- [ ] Floating widget operates properly
- [ ] Links open WhatsApp correctly
- [ ] Analytics track accurately
- [ ] Responsive design confirmed
- [ ] Accessibility verified
- [ ] Browser compatibility confirmed
- [ ] Edge cases handled
- [ ] Test documentation created
- [ ] Issues logged and resolved
- [ ] Ready for production

---

## Summary

This document completed the WhatsApp integration implementation with the floating widget featuring smooth animations and helpful tooltips, page-specific WhatsApp buttons for products, cart, and orders, comprehensive analytics tracking for all WhatsApp interactions, and thorough verification of the entire integration. The WhatsApp integration is now ready to provide seamless customer engagement across the Sri Lankan webstore.

### Completed Tasks
1. ✓ Created floating WhatsApp widget (bottom-right, fixed)
2. ✓ Created widget entrance and idle animations
3. ✓ Created widget tooltip ("Chat with us!")
4. ✓ Created product WhatsApp button with product details
5. ✓ Created cart WhatsApp button with item lists
6. ✓ Created order WhatsApp link with order info
7. ✓ Created WhatsApp analytics tracking
8. ✓ Verified complete WhatsApp integration

### Integration Complete
All WhatsApp integration components are implemented, tested, and verified. The webstore now features comprehensive WhatsApp click-to-chat functionality optimized for the Sri Lankan market with +94 phone formatting, ₨ currency display, and seamless customer engagement across all pages.

### Key Features Delivered
- Sri Lankan phone number configuration (+94 format)
- State management for tenant WhatsApp numbers
- wa.me link building utilities
- Product, order, and cart message builders
- Core WhatsAppButton component with variants
- Floating widget with animations and tooltip
- Page-specific buttons (product, cart, order)
- Comprehensive analytics tracking
- Complete verification and testing
