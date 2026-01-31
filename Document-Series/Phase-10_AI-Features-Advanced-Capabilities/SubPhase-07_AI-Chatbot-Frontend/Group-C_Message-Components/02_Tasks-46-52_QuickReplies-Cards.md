# Tasks 46-52: QuickReplies and Rich Message Cards

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 07 - AI Chatbot Frontend  
> **Group:** C - Message Components  
> **Document:** 02 of 02  
> **Tasks Covered:** 46, 47, 48, 49, 50, 51, 52

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-35-45_List-Bubble-Typing.md](01_Tasks-35-45_List-Bubble-Typing.md)
- **→ Next Group:** [../Group-D_Input-Actions/](../Group-D_Input-Actions/)

---

## Document Overview

This document covers the creation of interactive quick reply components and rich message cards for the AI chatbot interface. It establishes the interactive elements that enhance user engagement, including quick reply buttons, product cards, order cards, and image messages. These components provide users with convenient action buttons and rich content display within the chat conversation.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 46 | Create QuickReplies Component | Medium | 30 min |
| 47 | Create QuickReplyButton | Low | 20 min |
| 48 | Create Button Click Handler | Low | 15 min |
| 49 | Create ProductCard Message | Medium | 35 min |
| 50 | Create OrderCard Message | Medium | 35 min |
| 51 | Create ImageMessage | Low | 25 min |
| 52 | Verify Messages | Low | 20 min |

---

## Task 46: Create QuickReplies Component

### Overview
Create the QuickReplies component that displays a row of clickable buttons below bot messages. These buttons allow users to quickly respond with predefined options without typing, improving conversation flow and user experience. The component handles multiple buttons with proper spacing and responsive design.

### Dependencies
- Task 45: Create BotAvatar
- MessageBubble component is complete
- Chat state management is established

### Instructions

1. **Create QuickReplies component file**
   - Navigate to `frontend/components/chat/messages/` directory
   - Create new file named `QuickReplies.tsx`
   - Set up proper TypeScript interface definitions

2. **Define QuickReply interface**
   - Create interface for individual reply items
   - Include text (display text) and value (sent value) properties
   - Add optional icon or emoji support
   - Define onClick callback function type

3. **Define component props interface**
   - Create QuickRepliesProps interface
   - Include replies array of QuickReply items
   - Add onReplySelect callback function
   - Include optional visibility state prop

4. **Implement component structure**
   - Create functional component with proper TypeScript typing
   - Use flexbox layout for horizontal button arrangement
   - Implement responsive design for mobile and desktop
   - Add proper spacing between buttons

5. **Handle button rendering**
   - Map over replies array to render QuickReplyButton components
   - Pass individual reply data to each button
   - Implement key prop for proper React rendering
   - Handle empty or undefined replies array

6. **Style the container**
   - Apply flexbox with flex-wrap for overflow handling
   - Set horizontal gap between buttons
   - Add padding for spacing from message bubble
   - Implement responsive breakpoints

7. **Add animation and transitions**
   - Implement slide-in animation when component appears
   - Add staggered animation delays for buttons
   - Use CSS transitions for smooth hover effects
   - Consider fade-out animation when buttons are clicked

### Component Structure

```
┌─────────────────────────────────────┐
│        QuickReplies Container       │
│  ┌─────────┐ ┌─────────┐ ┌──────┐  │
│  │Button 1 │ │Button 2 │ │Button│  │
│  └─────────┘ └─────────┘ └──────┘  │
└─────────────────────────────────────┘
```

### Props Interface

| Prop | Type | Description |
|------|------|-------------|
| replies | QuickReply[] | Array of quick reply options |
| onReplySelect | (value: string) => void | Callback when button clicked |
| visible | boolean | Controls component visibility |
| className | string (optional) | Additional CSS classes |

### QuickReply Interface

| Property | Type | Description |
|----------|------|-------------|
| text | string | Display text on button |
| value | string | Value sent when clicked |
| icon | string (optional) | Icon name or emoji |
| disabled | boolean (optional) | Button disabled state |

### Layout Behavior

| Screen Size | Layout | Max Buttons |
|-------------|--------|-------------|
| Mobile (< 640px) | Wrapped, 2 per row | 4 visible |
| Tablet (640px - 1024px) | Single row | 5 visible |
| Desktop (> 1024px) | Single row | 6 visible |

### Animation Timing

| Element | Delay | Duration | Easing |
|---------|-------|----------|--------|
| Container | 0ms | 200ms | ease-out |
| Button 1 | 50ms | 150ms | ease-out |
| Button 2 | 100ms | 150ms | ease-out |
| Button 3 | 150ms | 150ms | ease-out |

### Expected Outcome
- Functional QuickReplies component with button array
- Responsive layout for all device sizes
- Smooth animations for appearance and interactions
- Proper TypeScript interfaces and error handling

### Verification Checklist
- [ ] `frontend/components/chat/messages/QuickReplies.tsx` file created
- [ ] QuickReply and QuickRepliesProps interfaces defined
- [ ] Component renders buttons from props array
- [ ] Responsive layout works on mobile and desktop
- [ ] Animation and transitions implemented
- [ ] Component exports properly
- [ ] TypeScript typing is complete

---

## Task 47: Create QuickReplyButton

### Overview
Create the individual QuickReplyButton component used within the QuickReplies component. Each button represents a single quick reply option with proper styling, hover effects, and click handling. The button design should be consistent with the chat interface while being easily distinguishable as interactive elements.

### Dependencies
- Task 46: Create QuickReplies Component

### Instructions

1. **Create QuickReplyButton component file**
   - Create `QuickReplyButton.tsx` in the same messages directory
   - Set up component with proper TypeScript interfaces
   - Import necessary dependencies and types

2. **Define button props interface**
   - Create QuickReplyButtonProps interface
   - Include text, value, onClick, and optional props
   - Add disabled state and icon support
   - Define proper callback function typing

3. **Implement button component**
   - Create functional component with forwardRef if needed
   - Handle click events with proper event typing
   - Implement disabled state logic
   - Add proper accessibility attributes

4. **Apply button styling**
   - Use outline button style variant
   - Apply rounded-full for pill-shaped appearance
   - Set appropriate padding and height
   - Use neutral colors with hover states

5. **Add hover and focus states**
   - Implement hover color transition
   - Add focus ring for keyboard navigation
   - Define active/pressed state styling
   - Ensure accessibility compliance

6. **Handle icon display**
   - Support optional icon prop
   - Position icon properly within button
   - Handle icon-only buttons
   - Maintain proper spacing with text

7. **Implement click feedback**
   - Add subtle click animation or ripple effect
   - Provide visual feedback on button press
   - Handle disabled state interactions
   - Consider loading state for async actions

### Button Styling Breakdown

| State | Background | Border | Text Color | Transform |
|-------|------------|--------|------------|-----------|
| Default | transparent | border-gray-300 | text-gray-700 | none |
| Hover | bg-gray-50 | border-gray-400 | text-gray-800 | none |
| Active | bg-gray-100 | border-gray-500 | text-gray-900 | scale(0.98) |
| Disabled | bg-gray-50 | border-gray-200 | text-gray-400 | none |

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| text | string | Yes | Button display text |
| value | string | Yes | Value passed to onClick |
| onClick | (value: string) => void | Yes | Click handler function |
| disabled | boolean | No | Disabled state |
| icon | ReactNode | No | Optional icon element |
| loading | boolean | No | Loading state indicator |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Keyboard Navigation | tabIndex and onKeyDown handler |
| Screen Reader | aria-label with descriptive text |
| Focus Indicator | Custom focus ring styles |
| Disabled State | aria-disabled attribute |

### Button Dimensions

| Size | Height | Padding X | Font Size |
|------|--------|-----------|-----------|
| Default | 2.5rem (40px) | 1rem (16px) | text-sm |
| With Icon | 2.5rem (40px) | 0.75rem (12px) | text-sm |
| Mobile | 2.75rem (44px) | 1.25rem (20px) | text-sm |

### Expected Outcome
- Functional QuickReplyButton component with proper styling
- Accessible button with keyboard and screen reader support
- Smooth hover and click transitions
- Consistent appearance with chat interface design

### Verification Checklist
- [ ] `frontend/components/chat/messages/QuickReplyButton.tsx` file created
- [ ] QuickReplyButtonProps interface defined correctly
- [ ] Button handles click events properly
- [ ] Hover and focus states implemented
- [ ] Accessibility attributes added
- [ ] Disabled state handled correctly
- [ ] Icon support implemented (if applicable)
- [ ] Component exports properly

---

## Task 48: Create Button Click Handler

### Overview
Create the click handler logic for quick reply buttons that processes user selections, sends messages to the chat, and manages the UI state. The handler should hide the quick replies after selection, add the user's choice to the conversation, and trigger the appropriate bot response flow.

### Dependencies
- Task 47: Create QuickReplyButton

### Instructions

1. **Define handler function signature**
   - Create handleQuickReplyClick function
   - Accept value string and optional metadata
   - Return void or Promise if async operations needed
   - Include proper TypeScript typing

2. **Implement message sending logic**
   - Add user message to conversation state
   - Use the selected reply text as message content
   - Update message list with new user message
   - Trigger auto-scroll to show new message

3. **Hide quick replies after selection**
   - Set visibility state to false immediately after click
   - Remove quick replies from DOM or hide with CSS
   - Prevent multiple clicks on same button set
   - Clear any animation timers

4. **Handle chat state updates**
   - Update conversation context with user selection
   - Mark quick reply set as used/consumed
   - Update typing indicator state if needed
   - Trigger bot response logic

5. **Add loading feedback**
   - Show loading state while processing
   - Display typing indicator for bot response
   - Handle potential async operations
   - Provide user feedback during delays

6. **Implement error handling**
   - Handle network errors gracefully
   - Show error messages if sending fails
   - Allow retry mechanism for failed sends
   - Log errors for debugging

7. **Add analytics tracking**
   - Track which quick replies are clicked
   - Record selection patterns for optimization
   - Monitor user interaction patterns
   - Send analytics events to tracking service

### Handler Flow Diagram

```
User Clicks Button
        │
        ▼
  Hide Quick Replies
        │
        ▼
  Add User Message
        │
        ▼
  Update Chat State
        │
        ▼
  Show Typing Indicator
        │
        ▼
  Trigger Bot Response
        │
        ▼
   Show Bot Reply
```

### State Management

| State Update | Action | Effect |
|--------------|--------|--------|
| quickRepliesVisible | Set to false | Hides button row |
| messages | Add user message | Updates conversation |
| isTyping | Set to true | Shows bot typing |
| conversationContext | Update with selection | Maintains context |

### Handler Implementation Strategy

| Step | Action | Error Handling |
|------|--------|----------------|
| 1. Validate Input | Check value exists | Return early if invalid |
| 2. Update UI | Hide buttons immediately | Revert if error occurs |
| 3. Send Message | Add to conversation | Show retry option |
| 4. Trigger Response | Call bot API | Handle timeout/network errors |

### Analytics Events

| Event | Data | Purpose |
|-------|------|---------|
| quick_reply_clicked | { value, position, timestamp } | Track usage patterns |
| quick_reply_sent | { success, response_time } | Monitor performance |
| quick_reply_error | { error_type, retry_count } | Debug failures |

### Error States

| Error Type | User Feedback | Recovery Action |
|------------|---------------|-----------------|
| Network Error | "Message failed to send" | Retry button |
| Validation Error | "Invalid selection" | Log and ignore |
| Server Error | "Something went wrong" | Retry button |
| Timeout | "Request timed out" | Retry with longer timeout |

### Expected Outcome
- Functional click handler that processes quick reply selections
- Proper state management and UI updates
- Error handling with user feedback
- Analytics tracking for usage optimization

### Verification Checklist
- [ ] handleQuickReplyClick function created
- [ ] Quick replies hide after selection
- [ ] User message added to conversation
- [ ] Bot typing indicator triggered
- [ ] Error handling implemented
- [ ] Loading states managed properly
- [ ] Analytics events tracked
- [ ] Handler is properly typed

---

## Task 49: Create ProductCard Message

### Overview
Create the ProductCard component to display product information within chat messages. This rich message type allows the bot to showcase products with images, descriptions, pricing, and action buttons, enabling users to view details or add items to cart directly from the chat interface.

### Dependencies
- Task 48: Create Button Click Handler
- Product data models from ERP integration
- Chat message system established

### Instructions

1. **Create ProductCard component file**
   - Create `ProductCard.tsx` in the messages directory
   - Import necessary dependencies and types
   - Set up component with TypeScript interfaces

2. **Define Product interface**
   - Create interface for product data structure
   - Include id, name, description, price, image properties
   - Add availability, category, and rating fields
   - Define optional discount and promotional data

3. **Define component props interface**
   - Create ProductCardProps interface
   - Include product data object
   - Add onViewProduct and onAddToCart callbacks
   - Include optional styling and size props

4. **Implement card layout structure**
   - Use card-style layout with proper spacing
   - Position product image on left or top
   - Display product information in organized sections
   - Add action buttons at bottom

5. **Handle product image display**
   - Implement responsive image with proper sizing
   - Add loading placeholder for image loading
   - Handle missing or broken images gracefully
   - Support multiple product images if needed

6. **Format product information**
   - Display product name with proper typography
   - Show formatted price with currency
   - Display availability status with color coding
   - Include product description (truncated if needed)

7. **Implement action buttons**
   - Add "View Details" button for product page navigation
   - Add "Add to Cart" button with quantity selector
   - Handle button clicks with appropriate callbacks
   - Show loading states during actions

8. **Add responsive design**
   - Optimize layout for mobile and desktop viewing
   - Adjust image and text sizing for screen size
   - Ensure buttons are touch-friendly on mobile
   - Handle horizontal scrolling if needed

### Card Layout Structure

```
┌─────────────────────────────────────┐
│ ┌──────┐ Product Name               │
│ │      │ $XX.XX                     │
│ │ IMG  │ ★★★★☆ (4.5)                │
│ │      │ In Stock - Category        │
│ └──────┘                           │
│ Short description text...          │
│                                    │
│ ┌──────────┐ ┌──────────────────┐   │
│ │View More │ │ Add to Cart ⊕   │   │
│ └──────────┘ └──────────────────┘   │
└─────────────────────────────────────┘
```

### Product Interface

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| id | string | Yes | Unique product identifier |
| name | string | Yes | Product name |
| price | number | Yes | Product price |
| image | string | Yes | Image URL |
| description | string | No | Product description |
| availability | 'in_stock' \| 'out_of_stock' | No | Stock status |
| rating | number | No | Product rating (0-5) |
| category | string | No | Product category |

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| product | Product | Yes | Product data object |
| onViewProduct | (productId: string) => void | Yes | View details handler |
| onAddToCart | (productId: string, quantity?: number) => void | Yes | Add to cart handler |
| size | 'compact' \| 'full' | No | Card size variant |

### Responsive Breakpoints

| Screen Size | Layout | Image Size | Button Size |
|-------------|--------|------------|-------------|
| Mobile (< 640px) | Stacked | 100px x 100px | Small, stacked |
| Tablet (640px - 1024px) | Side-by-side | 120px x 120px | Medium, inline |
| Desktop (> 1024px) | Side-by-side | 140px x 140px | Medium, inline |

### Price Formatting

| Currency | Format | Example |
|----------|--------|---------|
| USD | $X,XXX.XX | $1,299.99 |
| LKR | Rs. X,XXX.XX | Rs. 24,500.00 |
| EUR | €X,XXX.XX | €1.199,99 |

### Availability Status Styling

| Status | Color | Background | Icon |
|--------|-------|------------|------|
| In Stock | text-green-600 | bg-green-50 | ✓ |
| Low Stock | text-yellow-600 | bg-yellow-50 | ! |
| Out of Stock | text-red-600 | bg-red-50 | ✗ |

### Expected Outcome
- Functional ProductCard component displaying product information
- Responsive design working on all device sizes
- Action buttons integrated with cart and navigation
- Proper formatting for prices, ratings, and availability

### Verification Checklist
- [ ] `frontend/components/chat/messages/ProductCard.tsx` file created
- [ ] Product and ProductCardProps interfaces defined
- [ ] Product image displays with fallback handling
- [ ] Price formatting implemented correctly
- [ ] Availability status shows with proper colors
- [ ] Action buttons trigger correct callbacks
- [ ] Responsive design works on mobile and desktop
- [ ] Component exports properly

---

## Task 50: Create OrderCard Message

### Overview
Create the OrderCard component to display order information within chat messages. This component allows the bot to show order status, tracking information, item details, and relevant actions, helping customers track their purchases and take follow-up actions directly from the chat interface.

### Dependencies
- Task 48: Create Button Click Handler
- Order data models from ERP system
- Chat message infrastructure

### Instructions

1. **Create OrderCard component file**
   - Create `OrderCard.tsx` in the messages directory
   - Set up component structure with TypeScript
   - Import required dependencies and types

2. **Define Order interface**
   - Create comprehensive order data structure
   - Include orderId, status, items, total, dates
   - Add customer info, shipping, and tracking data
   - Define payment and fulfillment status fields

3. **Define component props interface**
   - Create OrderCardProps interface
   - Include order data object
   - Add callback functions for actions
   - Include optional display configuration

4. **Implement card header section**
   - Display order number with copy functionality
   - Show order date and current status
   - Add status badge with appropriate colors
   - Include order total prominently

5. **Create order items section**
   - Display item list with product names
   - Show quantities and individual prices
   - Limit displayed items with "show more" option
   - Include product thumbnails if available

6. **Add status tracking section**
   - Show current order status with progress indicator
   - Display estimated delivery date
   - Include tracking number if available
   - Show status update timeline

7. **Implement action buttons**
   - Add "Track Order" button for shipping tracking
   - Add "View Details" button for full order page
   - Add "Contact Support" for order issues
   - Include "Reorder" option for completed orders

8. **Style status badges and indicators**
   - Use color-coded status badges
   - Implement progress bar or step indicators
   - Add icons for different status types
   - Ensure accessibility with proper contrast

### Card Layout Structure

```
┌─────────────────────────────────────┐
│ Order #12345          [Processing]  │
│ Jan 25, 2026          Total: $89.99 │
│                                     │
│ Items (3):                          │
│ • Product A × 2        $39.98      │
│ • Product B × 1        $49.99      │
│                                     │
│ Status: Processing                  │
│ Est. Delivery: Jan 30, 2026         │
│ Tracking: TR123456789               │
│                                     │
│ ┌──────────┐ ┌──────────────────┐   │
│ │ Track    │ │ View Details     │   │
│ └──────────┘ └──────────────────┘   │
└─────────────────────────────────────┘
```

### Order Interface

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| id | string | Yes | Order identifier |
| orderNumber | string | Yes | Human-readable order number |
| status | OrderStatus | Yes | Current order status |
| total | number | Yes | Order total amount |
| currency | string | Yes | Currency code |
| items | OrderItem[] | Yes | Ordered items |
| createdAt | Date | Yes | Order creation date |
| estimatedDelivery | Date | No | Expected delivery date |
| trackingNumber | string | No | Shipping tracking number |

### OrderStatus Enum

| Status | Color | Background | Icon | Description |
|--------|-------|------------|------|-------------|
| pending | text-yellow-600 | bg-yellow-50 | ⏳ | Payment pending |
| confirmed | text-blue-600 | bg-blue-50 | ✓ | Order confirmed |
| processing | text-blue-600 | bg-blue-50 | 🔄 | Being prepared |
| shipped | text-green-600 | bg-green-50 | 📦 | In transit |
| delivered | text-green-600 | bg-green-50 | ✅ | Delivered |
| cancelled | text-red-600 | bg-red-50 | ❌ | Order cancelled |

### OrderItem Interface

| Property | Type | Description |
|----------|------|-------------|
| productId | string | Product identifier |
| name | string | Product name |
| quantity | number | Ordered quantity |
| price | number | Unit price |
| image | string (optional) | Product image URL |

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| order | Order | Yes | Order data object |
| onTrackOrder | (trackingNumber: string) => void | No | Track order handler |
| onViewDetails | (orderId: string) => void | Yes | View details handler |
| onContactSupport | (orderId: string) => void | No | Support contact handler |
| onReorder | (orderId: string) => void | No | Reorder handler |

### Status Progress Indicators

| Status | Progress % | Next Step |
|--------|------------|-----------|
| pending | 10% | Payment confirmation |
| confirmed | 25% | Order processing |
| processing | 50% | Shipping preparation |
| shipped | 75% | Delivery |
| delivered | 100% | Complete |

### Action Button Visibility

| Order Status | Track | View | Support | Reorder |
|--------------|-------|------|---------|---------|
| pending | ❌ | ✅ | ✅ | ❌ |
| confirmed | ❌ | ✅ | ✅ | ❌ |
| processing | ❌ | ✅ | ✅ | ❌ |
| shipped | ✅ | ✅ | ✅ | ❌ |
| delivered | ❌ | ✅ | ✅ | ✅ |
| cancelled | ❌ | ✅ | ✅ | ✅ |

### Expected Outcome
- Functional OrderCard component showing order information
- Status-based styling and action button visibility
- Integrated tracking and support functionality
- Responsive design for all device sizes

### Verification Checklist
- [ ] `frontend/components/chat/messages/OrderCard.tsx` file created
- [ ] Order and OrderCardProps interfaces defined
- [ ] Order status displayed with proper colors and icons
- [ ] Order items list implemented with proper formatting
- [ ] Action buttons show/hide based on order status
- [ ] Tracking number and delivery date displayed
- [ ] Responsive design works correctly
- [ ] Component exports properly

---

## Task 51: Create ImageMessage

### Overview
Create the ImageMessage component to display images within chat messages. This component handles image loading, provides lightbox functionality for full-screen viewing, includes loading placeholders, and supports various image formats while maintaining proper aspect ratios and responsive behavior.

### Dependencies
- Task 48: Create Button Click Handler
- Chat message system infrastructure
- Image optimization and loading utilities

### Instructions

1. **Create ImageMessage component file**
   - Create `ImageMessage.tsx` in the messages directory
   - Set up component with proper TypeScript interfaces
   - Import necessary image handling dependencies

2. **Define ImageMessage props interface**
   - Create interface for image message properties
   - Include src (image URL), alt text, caption
   - Add optional width, height, and aspect ratio
   - Include loading and error state handlers

3. **Implement image loading states**
   - Create loading skeleton placeholder component
   - Show loading indicator while image loads
   - Handle image loading success and error states
   - Provide fallback for broken or missing images

4. **Create responsive image display**
   - Use Next.js Image component if available
   - Implement responsive sizing for different screens
   - Maintain proper aspect ratios
   - Optimize for different device pixel densities

5. **Add lightbox functionality**
   - Implement click-to-expand functionality
   - Create overlay modal for full-screen viewing
   - Add navigation for multiple images
   - Include close button and keyboard navigation

6. **Handle image optimization**
   - Support multiple image formats (JPEG, PNG, WebP)
   - Implement lazy loading for performance
   - Add blur placeholder for smooth loading
   - Optimize image sizes for chat display

7. **Add accessibility features**
   - Include proper alt text for screen readers
   - Add keyboard navigation for lightbox
   - Implement focus management
   - Ensure proper color contrast for controls

8. **Style image container**
   - Apply proper padding and margins
   - Add border radius for modern appearance
   - Include shadow effects for depth
   - Handle different aspect ratios gracefully

### Image Display States

```
┌─────────────────────────────────────┐
│            Loading State            │
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ │        [Skeleton Animation]     │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│            Loaded Image             │
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ │        [Actual Image]           │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│ Caption text here (optional)        │
└─────────────────────────────────────┘
```

### Component Props Interface

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| src | string | Yes | Image source URL |
| alt | string | Yes | Alt text for accessibility |
| caption | string | No | Optional image caption |
| width | number | No | Preferred width in pixels |
| height | number | No | Preferred height in pixels |
| aspectRatio | string | No | CSS aspect ratio (e.g., "16/9") |
| onLoad | () => void | No | Callback when image loads |
| onError | (error: Error) => void | No | Callback when image fails |

### Image Sizing Strategy

| Container Width | Image Max Width | Aspect Ratio | Behavior |
|----------------|-----------------|--------------|----------|
| < 400px | 100% | Preserve original | Full width |
| 400px - 600px | 90% | Preserve original | Centered |
| > 600px | 500px | Preserve original | Centered |

### Loading States

| State | Display | Duration | Interaction |
|-------|---------|----------|-------------|
| Loading | Skeleton animation | Until loaded | Non-interactive |
| Loaded | Actual image | Permanent | Clickable |
| Error | Error placeholder | Permanent | Retry button |
| Lightbox | Full-screen overlay | Until closed | Full navigation |

### Lightbox Features

| Feature | Implementation | Keyboard Shortcut |
|---------|----------------|-------------------|
| Open | Click on image | Enter |
| Close | X button or overlay click | Escape |
| Zoom | Zoom controls | +/- keys |
| Navigation | Previous/Next buttons | Arrow keys |

### Image Formats Support

| Format | Support | Optimization | Use Case |
|--------|---------|--------------|----------|
| JPEG | ✅ | High compression | Photos |
| PNG | ✅ | Transparency support | Graphics |
| WebP | ✅ | Modern format | All types |
| GIF | ✅ | Animation support | Simple animations |
| SVG | ✅ | Vector graphics | Icons, logos |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Alt Text | Required alt prop passed to img |
| Keyboard Navigation | Tab, Enter, Escape key handling |
| Screen Reader | Proper ARIA labels and roles |
| Focus Management | Focus trap in lightbox |
| High Contrast | Proper border and background colors |

### Error Handling

| Error Type | Display | Action |
|------------|---------|--------|
| Network Error | "Image failed to load" | Retry button |
| Invalid URL | "Invalid image" | Show placeholder |
| Timeout | "Loading timeout" | Retry button |
| Unsupported Format | "Unsupported format" | Show placeholder |

### Expected Outcome
- Functional ImageMessage component with loading states
- Lightbox functionality for full-screen viewing
- Responsive design for all device sizes
- Proper error handling and accessibility features

### Verification Checklist
- [ ] `frontend/components/chat/messages/ImageMessage.tsx` file created
- [ ] ImageMessageProps interface defined correctly
- [ ] Loading skeleton placeholder implemented
- [ ] Image displays with proper responsive sizing
- [ ] Lightbox functionality works correctly
- [ ] Error states handled with fallbacks
- [ ] Accessibility features implemented
- [ ] Component exports properly

---

## Task 52: Verify Messages

### Overview
Conduct comprehensive verification of all message components to ensure proper functionality, integration, performance, and user experience. This verification process validates that all components work together seamlessly within the chat interface and meet the specified requirements for interactive messaging.

### Dependencies
- Task 51: Create ImageMessage
- All previous message components completed
- Chat interface integration completed

### Instructions

1. **Verify component integration**
   - Test all message components within MessageList
   - Confirm proper rendering in chat interface
   - Validate component props passing correctly
   - Ensure consistent styling across components

2. **Test quick reply functionality**
   - Verify QuickReplies component displays properly
   - Test QuickReplyButton click handling
   - Confirm buttons hide after selection
   - Validate message sending after quick reply click

3. **Test rich message cards**
   - Verify ProductCard displays product information correctly
   - Test OrderCard shows order details and actions
   - Confirm ImageMessage loads and displays images
   - Test lightbox functionality for images

4. **Validate responsive design**
   - Test all components on mobile devices
   - Verify tablet layout and interactions
   - Confirm desktop display and functionality
   - Check component behavior on different screen sizes

5. **Test accessibility features**
   - Verify keyboard navigation works correctly
   - Test screen reader compatibility
   - Confirm proper focus management
   - Validate color contrast and visibility

6. **Performance testing**
   - Measure component rendering performance
   - Test image loading optimization
   - Verify smooth animations and transitions
   - Check memory usage with multiple messages

7. **Error handling verification**
   - Test error states for all components
   - Verify fallback displays work correctly
   - Test retry functionality where applicable
   - Confirm graceful degradation

8. **Cross-browser compatibility**
   - Test components in Chrome, Firefox, Safari
   - Verify mobile browser compatibility
   - Test on different operating systems
   - Confirm consistent appearance and behavior

### Component Integration Test Matrix

| Component | Renders | Interactions | Responsive | Accessible |
|-----------|---------|--------------|------------|------------|
| QuickReplies | ✓ | ✓ | ✓ | ✓ |
| QuickReplyButton | ✓ | ✓ | ✓ | ✓ |
| ProductCard | ✓ | ✓ | ✓ | ✓ |
| OrderCard | ✓ | ✓ | ✓ | ✓ |
| ImageMessage | ✓ | ✓ | ✓ | ✓ |

### Quick Reply Testing Scenarios

| Scenario | Expected Behavior | Pass/Fail |
|----------|-------------------|-----------|
| Display multiple buttons | Shows all buttons in row/wrapped | [ ] |
| Click button | Hides replies, sends message | [ ] |
| Mobile responsive | Buttons stack properly on mobile | [ ] |
| Keyboard navigation | Tab through buttons, Enter to select | [ ] |
| Long text | Button text truncates appropriately | [ ] |

### Rich Card Testing Scenarios

| Card Type | Test Case | Expected Result | Pass/Fail |
|-----------|-----------|-----------------|-----------|
| ProductCard | Display with image | Shows product info and image | [ ] |
| ProductCard | Click "Add to Cart" | Triggers cart action | [ ] |
| OrderCard | Show order status | Displays status badge correctly | [ ] |
| OrderCard | Click "Track Order" | Opens tracking interface | [ ] |
| ImageMessage | Click image | Opens lightbox | [ ] |
| ImageMessage | Loading state | Shows skeleton placeholder | [ ] |

### Performance Benchmarks

| Metric | Target | Actual | Pass/Fail |
|--------|--------|--------|-----------|
| Component Render Time | < 16ms | ___ ms | [ ] |
| Image Load Time | < 2s | ___ s | [ ] |
| Animation Frame Rate | 60 FPS | ___ FPS | [ ] |
| Memory Usage | < 50MB | ___ MB | [ ] |

### Browser Compatibility Matrix

| Browser | Desktop | Mobile | Features Work | Pass/Fail |
|---------|---------|--------|---------------|-----------|
| Chrome | ✓ | ✓ | All features | [ ] |
| Firefox | ✓ | ✓ | All features | [ ] |
| Safari | ✓ | ✓ | All features | [ ] |
| Edge | ✓ | ✓ | All features | [ ] |

### Accessibility Verification

| Feature | Component | Test Method | Pass/Fail |
|---------|-----------|-------------|-----------|
| Screen Reader | All | NVDA/VoiceOver | [ ] |
| Keyboard Nav | QuickReplies | Tab/Enter keys | [ ] |
| Focus Management | ImageMessage | Lightbox focus trap | [ ] |
| Color Contrast | All | Accessibility checker | [ ] |

### Error State Testing

| Component | Error Type | Fallback Behavior | Pass/Fail |
|-----------|------------|-------------------|-----------|
| ImageMessage | Load failure | Shows error placeholder | [ ] |
| ProductCard | Missing data | Shows partial card | [ ] |
| OrderCard | API error | Shows error message | [ ] |
| QuickReplies | Empty array | Hides component | [ ] |

### Expected Outcome
- All message components verified and functioning correctly
- Integration between components working seamlessly
- Performance benchmarks met for smooth user experience
- Accessibility standards compliance confirmed

### Verification Checklist
- [ ] Component integration tested and working
- [ ] Quick reply functionality verified
- [ ] Rich message cards display correctly
- [ ] Responsive design works on all devices
- [ ] Accessibility features confirmed working
- [ ] Performance benchmarks met
- [ ] Error handling verified
- [ ] Cross-browser compatibility confirmed
- [ ] All test scenarios passed
- [ ] Documentation updated with verification results

---

## Summary

This document established the interactive and rich content display components for the AI chatbot interface, including quick reply functionality and rich message cards. These components enhance user engagement by providing convenient interaction methods and visually appealing content display within the chat conversation.

### Completed Tasks
1. ✓ Created QuickReplies component for interactive button displays
2. ✓ Created QuickReplyButton with proper styling and interactions
3. ✓ Created button click handler for processing user selections
4. ✓ Created ProductCard component for product information display
5. ✓ Created OrderCard component for order status and tracking
6. ✓ Created ImageMessage component with lightbox functionality
7. ✓ Verified all message components for integration and performance

### Next Steps
Proceed to [../Group-D_Input-Actions/](../Group-D_Input-Actions/) to create the chat input components and action handlers that complete the chatbot user interface.