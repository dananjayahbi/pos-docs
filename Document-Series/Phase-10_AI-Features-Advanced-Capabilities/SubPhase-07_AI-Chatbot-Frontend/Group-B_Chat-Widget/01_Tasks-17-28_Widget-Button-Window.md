# Tasks 17-28: Widget Button and Window Creation

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 07 - AI Chatbot Frontend  
> **Group:** B - Chat Widget  
> **Document:** 01 of 02  
> **Tasks Covered:** 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-29-34_Animation-Layout.md](02_Tasks-29-34_Animation-Layout.md)

---

## Document Overview

This document covers the creation of the floating chat widget infrastructure, including the main ChatWidget component with positioning and z-index management, the ChatButton component with icon, badge, and animation, and the ChatWindow component with header, close button, body, and footer sections. These components form the core structure for the AI chatbot floating widget interface.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 17 | Create ChatWidget Component | Medium | 30 min |
| 18 | Create Widget Position | Low | 15 min |
| 19 | Create Widget Z-Index | Low | 10 min |
| 20 | Create ChatButton Component | Medium | 25 min |
| 21 | Create Button Icon | Low | 15 min |
| 22 | Create Button Badge | Low | 20 min |
| 23 | Create Button Animation | Low | 20 min |
| 24 | Create ChatWindow Component | Medium | 35 min |
| 25 | Create Window Header | Low | 20 min |
| 26 | Create Close Button | Low | 15 min |
| 27 | Create Window Body | Low | 20 min |
| 28 | Create Window Footer | Low | 20 min |

---

## Task 17: Create ChatWidget Component

### Overview
Create the main ChatWidget component that serves as the root container for the floating chat interface. This component manages the visibility state between collapsed (button only) and expanded (full window) modes, handles the overall positioning, and orchestrates the interaction between the ChatButton and ChatWindow components.

### Dependencies
- Task 16: Create ChatProvider Context (from Group A)
- React state management patterns established
- TypeScript configuration is ready

### Instructions

1. **Navigate to the components directory**
   - Go to `frontend/src/components/chat/` directory
   - Ensure the chat component folder structure exists

2. **Create ChatWidget.tsx file**
   - Create new file named `ChatWidget.tsx`
   - This component serves as the main widget container

3. **Import required dependencies**
   - Import React hooks (useState, useContext)
   - Import ChatContext from the chat context provider
   - Import TypeScript interfaces for component props

4. **Define ChatWidget component interface**
   - Create interface for component props
   - Include optional className prop for styling flexibility
   - Define any configuration props needed

5. **Create main component structure**
   - Define default export function `ChatWidget`
   - Initialize local state for widget visibility
   - Use chat context for global state management

6. **Implement visibility state management**
   - Create `isOpen` state variable with useState
   - Define `toggleOpen` function to switch states
   - Handle initial state (closed by default)

7. **Structure widget container**
   - Create main container div with fixed positioning
   - Include conditional rendering for button vs window
   - Ensure proper component composition

### Component Structure

```
ChatWidget Container
├── Fixed positioning (bottom-right)
├── Conditional rendering based on isOpen
│   ├── If closed: ChatButton component
│   └── If open: ChatWindow component
└── State management for visibility
```

### Component Props Interface

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| className | string | No | Additional CSS classes |
| initialOpen | boolean | No | Initial visibility state |

### State Management

| State | Type | Purpose |
|-------|------|---------|
| isOpen | boolean | Controls widget visibility |

### Expected Outcome
- Functional main widget container component
- Proper state management for open/closed states
- Ready to contain ChatButton and ChatWindow
- TypeScript interfaces properly defined

### Verification Checklist
- [ ] `frontend/src/components/chat/ChatWidget.tsx` file created
- [ ] Component imports React and context dependencies
- [ ] Props interface defined with proper TypeScript
- [ ] Local state for isOpen implemented
- [ ] Component exports properly as default
- [ ] Container structure prepared for child components

---

## Task 18: Create Widget Position

### Overview
Configure the fixed positioning for the ChatWidget component to appear in the bottom-right corner of the screen. Implement responsive positioning that works across different screen sizes while maintaining consistent spacing from screen edges and avoiding interference with other UI elements.

### Dependencies
- Task 17: Create ChatWidget Component

### Instructions

1. **Apply fixed positioning classes**
   - Add `fixed` class to position widget absolutely
   - Position should be relative to the viewport
   - Ensure widget stays in place during scrolling

2. **Set bottom positioning**
   - Use `bottom-4` class for 16px from bottom edge
   - Ensure adequate spacing from screen bottom
   - Consider mobile safe areas and navigation bars

3. **Set right positioning**
   - Use `right-4` class for 16px from right edge
   - Maintain consistent spacing from screen edge
   - Account for scrollbars on desktop browsers

4. **Add responsive positioning adjustments**
   - Define mobile positioning (sm: breakpoint)
   - Define tablet positioning (md: breakpoint)
   - Define desktop positioning (lg: breakpoint)

5. **Ensure position stability**
   - Position should not shift during state changes
   - Maintain position during animations
   - Handle edge cases like small screens

### Positioning Classes

| Screen Size | Tailwind Classes | Purpose |
|-------------|------------------|---------|
| All | `fixed bottom-4 right-4` | Base positioning |
| Mobile | `sm:bottom-4 sm:right-4` | Mobile adjustments |
| Tablet | `md:bottom-6 md:right-6` | Tablet spacing |
| Desktop | `lg:bottom-6 lg:right-6` | Desktop spacing |

### Position Values

| Property | Mobile | Tablet | Desktop |
|----------|--------|--------|---------|
| Bottom | 16px | 24px | 24px |
| Right | 16px | 24px | 24px |

### Layout Considerations

```
Screen Layout
┌─────────────────────────────┐
│                             │
│     Main Content Area       │
│                             │
│                             │
│                             │
│                   ┌─────┐   │
│                   │ Chat│   │
│                   │Widget   │
│                   └─────┘   │
└─────────────────────────────┘
```

### Positioning Strategy

| Aspect | Implementation |
|--------|----------------|
| Base Position | Fixed bottom-right |
| Responsiveness | Adjust spacing by screen size |
| Stability | Consistent during state changes |
| Accessibility | Clear of important UI elements |

### Expected Outcome
- Widget positioned consistently in bottom-right
- Responsive spacing across device sizes
- Stable positioning during interactions
- Clear of other UI elements

### Verification Checklist
- [ ] Fixed positioning applied correctly
- [ ] Bottom spacing implemented (16px mobile, 24px desktop)
- [ ] Right spacing implemented (16px mobile, 24px desktop)
- [ ] Responsive classes added for different screen sizes
- [ ] Position remains stable during state changes
- [ ] Widget doesn't interfere with other UI elements

---

## Task 19: Create Widget Z-Index

### Overview
Implement proper z-index layering for the ChatWidget to ensure it appears above all other content on the page. Configure z-index values that work within the application's layering system while avoiding conflicts with modals, dropdowns, and other overlay components.

### Dependencies
- Task 18: Create Widget Position

### Instructions

1. **Analyze existing z-index layers**
   - Review current application z-index usage
   - Identify highest z-index values in use
   - Determine appropriate layer for chat widget

2. **Define widget z-index value**
   - Use `z-[9999]` class for maximum priority
   - Ensure higher than modal overlays
   - Account for browser default layers

3. **Apply z-index to widget container**
   - Add z-index class to main widget container
   - Ensure consistent application across states
   - Verify no conflicts with existing components

4. **Configure button z-index**
   - Button should have high z-index when collapsed
   - Ensure button remains clickable over content
   - Maintain consistent layering

5. **Configure window z-index**
   - Window should have highest z-index when open
   - Ensure window appears above all content
   - Handle overlay scenarios properly

### Z-Index Hierarchy

| Layer | Component | Z-Index | Usage |
|-------|-----------|---------|-------|
| Base | Content | 0-10 | Normal content |
| Elevated | Dropdowns | 100-999 | Elevated content |
| Overlay | Modals | 1000-1999 | Modal overlays |
| System | Tooltips | 2000-2999 | System overlays |
| Widget | ChatWidget | 9999 | Chat widget |

### Z-Index Classes

| Element | Tailwind Class | Numeric Value |
|---------|----------------|---------------|
| Widget Container | `z-[9999]` | 9999 |
| Chat Button | `z-[9999]` | 9999 |
| Chat Window | `z-[9999]` | 9999 |

### Layering Strategy

```
Z-Index Stack (Bottom to Top)
├── Page Content (z-0)
├── Navigation (z-10)
├── Dropdowns (z-100)
├── Modals (z-1000)
├── Notifications (z-2000)
└── Chat Widget (z-9999) ← Highest
```

### Z-Index Testing Scenarios

| Scenario | Expected Behavior |
|----------|-------------------|
| Over page content | Widget appears above |
| Over dropdowns | Widget appears above |
| Over modals | Widget appears above |
| Over tooltips | Widget appears above |

### Expected Outcome
- Widget appears above all other content
- No z-index conflicts with existing components
- Consistent layering across all widget states
- Proper interaction hierarchy maintained

### Verification Checklist
- [ ] Z-index class applied to widget container
- [ ] Widget appears above page content
- [ ] Widget appears above navigation elements
- [ ] Widget appears above dropdown menus
- [ ] Widget appears above modal overlays
- [ ] No conflicts with existing z-index usage
- [ ] Button remains clickable in all scenarios

---

## Task 20: Create ChatButton Component

### Overview
Create the ChatButton component that serves as the collapsed state of the chat widget. This floating action button provides the primary interface for users to open the chat window, displays visual indicators for new messages, and includes hover and focus states for enhanced user experience.

### Dependencies
- Task 17: Create ChatWidget Component

### Instructions

1. **Create ChatButton.tsx file**
   - Navigate to `frontend/src/components/chat/` directory
   - Create new file named `ChatButton.tsx`
   - This component renders the floating action button

2. **Import required dependencies**
   - Import React types and hooks
   - Import Lucide React icons for button icon
   - Import motion components for animations

3. **Define component interface**
   - Create interface for component props
   - Include onClick handler prop
   - Include unreadCount prop for badge display
   - Include isLoading state prop

4. **Create button component structure**
   - Define default export function `ChatButton`
   - Accept props with proper TypeScript typing
   - Return JSX with button element structure

5. **Implement button styling**
   - Apply circular button design
   - Use brand colors (primary blue background)
   - Add shadow and hover effects

6. **Add button accessibility features**
   - Include proper ARIA labels
   - Add keyboard navigation support
   - Ensure focus indicators are visible

7. **Implement click handling**
   - Accept onClick prop from parent
   - Handle button press interactions
   - Prevent default behaviors if needed

### Button Component Structure

```
ChatButton
├── Circular container
├── Background color (brand primary)
├── Shadow and hover effects
├── Icon placeholder (Task 21)
├── Badge placeholder (Task 22)
└── Click handler integration
```

### Component Props Interface

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| onClick | () => void | Yes | Click event handler |
| unreadCount | number | No | Number of unread messages |
| isLoading | boolean | No | Loading state indicator |
| disabled | boolean | No | Disabled state |

### Button Styling Classes

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Button | `w-14 h-14 rounded-full` | Circular shape |
| Background | `bg-blue-600 hover:bg-blue-700` | Brand colors |
| Shadow | `shadow-lg hover:shadow-xl` | Depth effect |
| Transition | `transition-all duration-200` | Smooth effects |

### Button States

| State | Visual Change | Interaction |
|-------|---------------|-------------|
| Default | Blue background | Clickable |
| Hover | Darker blue, larger shadow | Enhanced feedback |
| Focus | Focus ring visible | Keyboard accessible |
| Active | Slight scale down | Press feedback |
| Disabled | Grayed out, no hover | Non-interactive |

### Accessibility Features

| Feature | Implementation | Purpose |
|---------|----------------|---------|
| ARIA Label | `aria-label="Open chat"` | Screen reader support |
| Role | `role="button"` | Semantic meaning |
| Keyboard | Tab navigation | Keyboard accessibility |
| Focus | Visible focus ring | Visual focus indicator |

### Expected Outcome
- Functional floating action button
- Proper styling with brand colors
- Accessible button with ARIA labels
- Click handling integrated with parent
- Ready for icon and badge integration

### Verification Checklist
- [ ] `frontend/src/components/chat/ChatButton.tsx` file created
- [ ] Component exports properly as default
- [ ] Props interface defined with TypeScript
- [ ] Circular button styling applied correctly
- [ ] Brand colors used for background and hover
- [ ] Shadow effects implemented
- [ ] Click handler prop accepted and used
- [ ] ARIA labels added for accessibility
- [ ] Keyboard navigation supported
- [ ] Hover and focus states working

---

## Task 21: Create Button Icon

### Overview
Integrate the MessageCircle icon from Lucide React into the ChatButton component. Configure the icon with appropriate size, color, and positioning within the circular button. The icon serves as the primary visual identifier for the chat functionality.

### Dependencies
- Task 20: Create ChatButton Component

### Instructions

1. **Import MessageCircle icon**
   - Add MessageCircle import from 'lucide-react'
   - Ensure Lucide React is installed as dependency
   - Verify icon availability in the library

2. **Add icon to button component**
   - Place MessageCircle component inside button
   - Position icon in center of circular button
   - Ensure icon doesn't break button layout

3. **Configure icon sizing**
   - Set icon size to 24px (w-6 h-6)
   - Ensure icon scales appropriately
   - Maintain proper proportions with button

4. **Apply icon styling**
   - Set icon color to white for contrast
   - Ensure icon color matches design system
   - Apply any necessary icon-specific styles

5. **Handle icon states**
   - Icon should change with button states
   - Maintain icon visibility in all states
   - Ensure icon doesn't interfere with animations

### Icon Configuration

| Property | Value | Tailwind Class |
|----------|-------|----------------|
| Size | 24px | `w-6 h-6` |
| Color | White | `text-white` |
| Position | Centered | `flex items-center justify-center` |

### Icon Implementation

```typescript
// Icon structure within button
<button className="button-classes">
  <MessageCircle className="w-6 h-6 text-white" />
</button>
```

### Button with Icon Layout

```
Circular Button (56px × 56px)
┌─────────────────────────┐
│                         │
│         ┌─────┐         │
│         │     │         │
│         │  🗨  │         │ ← MessageCircle (24px)
│         │     │         │
│         └─────┘         │
│                         │
└─────────────────────────┘
```

### Icon Properties

| Aspect | Implementation |
|--------|----------------|
| Library | Lucide React |
| Icon Name | MessageCircle |
| Size | 24px × 24px |
| Color | White (#FFFFFF) |
| Position | Centered in button |

### Icon States

| Button State | Icon Appearance |
|--------------|----------------|
| Default | White MessageCircle |
| Hover | Same, button background changes |
| Focus | Same, button gets focus ring |
| Active | Same, button scales slightly |
| Disabled | Dimmed white color |

### Expected Outcome
- MessageCircle icon properly imported and displayed
- Icon centered within circular button
- Correct icon size (24px) and white color
- Icon remains visible across all button states
- Clean integration without layout issues

### Verification Checklist
- [ ] MessageCircle imported from lucide-react
- [ ] Icon added to ChatButton component
- [ ] Icon size set to 24px (w-6 h-6)
- [ ] Icon color set to white (text-white)
- [ ] Icon centered within button container
- [ ] Icon visible in all button states
- [ ] No layout issues with icon placement
- [ ] Icon maintains aspect ratio

---

## Task 22: Create Button Badge

### Overview
Implement the unread message badge that appears in the top-right corner of the ChatButton. The badge displays the count of unread messages and only appears when there are unread messages. Configure the badge with proper positioning, styling, and number formatting.

### Dependencies
- Task 21: Create Button Icon

### Instructions

1. **Add badge container to button**
   - Position badge relative to button container
   - Use absolute positioning for badge placement
   - Ensure badge doesn't interfere with button clicks

2. **Implement conditional badge rendering**
   - Only show badge when unreadCount > 0
   - Accept unreadCount prop from parent component
   - Handle zero and undefined values gracefully

3. **Style the badge appearance**
   - Create small circular badge with red background
   - Use white text for high contrast
   - Apply appropriate font size and padding

4. **Position badge correctly**
   - Place badge in top-right corner of button
   - Use negative margins to position outside button
   - Ensure badge doesn't get cut off

5. **Handle badge number formatting**
   - Display exact count for numbers 1-99
   - Display "99+" for numbers over 99
   - Handle edge cases (0, negative numbers)

6. **Add badge animations**
   - Subtle scale animation when badge appears
   - Smooth transition when count changes
   - Consider pulsing animation for new messages

### Badge Positioning

```
Button with Badge
     ┌───┐ ← Badge (top-right)
     │ 3 │
┌────┴───────────────┐
│                    │
│        🗨          │
│                    │
└────────────────────┘
```

### Badge Styling Classes

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Badge | `absolute -top-1 -right-1` | Positioning |
| Shape | `w-5 h-5 rounded-full` | Circular badge |
| Color | `bg-red-500 text-white` | Red background, white text |
| Text | `text-xs font-medium` | Small, readable text |
| Center | `flex items-center justify-center` | Center text |

### Badge Number Formatting

| Count Range | Display | Example |
|-------------|---------|---------|
| 0 | Hidden | (no badge) |
| 1-9 | Single digit | "3" |
| 10-99 | Two digits | "42" |
| 100+ | "99+" | "99+" |

### Badge Component Structure

```typescript
// Badge conditional rendering
{unreadCount > 0 && (
  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
    <span className="text-xs font-medium text-white">
      {unreadCount > 99 ? '99+' : unreadCount}
    </span>
  </div>
)}
```

### Badge States

| State | Visibility | Content |
|-------|------------|---------|
| No messages | Hidden | N/A |
| 1-99 messages | Visible | Exact count |
| 100+ messages | Visible | "99+" |

### Expected Outcome
- Badge appears only when unreadCount > 0
- Badge positioned correctly in top-right corner
- Proper number formatting (1-99, 99+)
- Red background with white text for high contrast
- Badge doesn't interfere with button functionality

### Verification Checklist
- [ ] Badge container added to button component
- [ ] Conditional rendering based on unreadCount
- [ ] Badge positioned in top-right corner (-top-1 -right-1)
- [ ] Circular badge styling applied (w-5 h-5 rounded-full)
- [ ] Red background and white text applied
- [ ] Number formatting implemented (99+ for >99)
- [ ] Badge hidden when unreadCount is 0
- [ ] Badge doesn't interfere with button clicks
- [ ] Text properly centered in badge
- [ ] Appropriate font size and weight applied

---

## Task 23: Create Button Animation

### Overview
Implement subtle pulse animation for the ChatButton to draw attention when new messages arrive. The animation should be smooth, non-intrusive, and only trigger when there are unread messages or when a new message is received.

### Dependencies
- Task 22: Create Button Badge

### Instructions

1. **Import animation utilities**
   - Import Framer Motion components if available
   - Alternative: Use CSS animations with Tailwind
   - Ensure animation library is properly configured

2. **Define animation variants**
   - Create pulse animation configuration
   - Define keyframes for scale animation
   - Set appropriate timing and easing

3. **Implement pulse animation**
   - Apply subtle scale animation (1.0 to 1.05)
   - Set animation duration to 2 seconds
   - Create infinite loop with pause between pulses

4. **Add animation triggers**
   - Animate when unreadCount > 0
   - Trigger animation on new message arrival
   - Stop animation when chat is opened

5. **Configure animation properties**
   - Use ease-in-out easing function
   - Add slight delay between animation cycles
   - Ensure animation doesn't interfere with interactions

### Animation Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| Scale Range | 1.0 to 1.05 | Subtle pulse effect |
| Duration | 2s | Smooth, noticeable |
| Iteration | Infinite | Continuous attention |
| Timing | ease-in-out | Natural motion |
| Delay | 1s | Pause between pulses |

### Framer Motion Implementation

```typescript
// Animation variants
const pulseVariants = {
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatDelay: 1
    }
  },
  static: {
    scale: 1
  }
}
```

### CSS Animation Alternative

```css
/* Tailwind animation classes */
@keyframes pulse-button {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.animate-pulse-button {
  animation: pulse-button 2s ease-in-out infinite;
}
```

### Animation Trigger Conditions

| Condition | Animation State |
|-----------|----------------|
| No unread messages | Static |
| Unread messages exist | Pulsing |
| Chat window open | Static |
| New message received | Trigger pulse |

### Animation States

| State | Scale | Duration | Repeat |
|-------|-------|----------|---------|
| Rest | 1.0 | - | - |
| Pulse Peak | 1.05 | 1s | - |
| Cycle | 1.0 → 1.05 → 1.0 | 2s | Infinite |
| Pause | 1.0 | 1s | Between cycles |

### Expected Outcome
- Smooth pulse animation when unread messages exist
- Animation draws attention without being distracting
- Animation stops when chat is opened
- Consistent timing and easing
- No interference with button interactions

### Verification Checklist
- [ ] Animation library/utilities imported properly
- [ ] Pulse animation configured with correct scale (1.0 to 1.05)
- [ ] Animation duration set to 2 seconds
- [ ] Infinite loop with 1 second delay between cycles
- [ ] Animation triggers when unreadCount > 0
- [ ] Animation stops when chat window is open
- [ ] Smooth ease-in-out timing function applied
- [ ] Animation doesn't interfere with button clicks
- [ ] Animation performance is smooth
- [ ] Visual effect is subtle but noticeable

---

## Task 24: Create ChatWindow Component

### Overview
Create the ChatWindow component that displays the expanded chat interface. This component contains the header, body, and footer sections and appears when the user opens the chat widget. The window provides the main interface for viewing and sending messages.

### Dependencies
- Task 23: Create Button Animation

### Instructions

1. **Create ChatWindow.tsx file**
   - Navigate to `frontend/src/components/chat/` directory
   - Create new file named `ChatWindow.tsx`
   - This component renders the expanded chat interface

2. **Import required dependencies**
   - Import React types and hooks
   - Import child components (header, body, footer)
   - Import context and state management utilities

3. **Define component interface**
   - Create interface for component props
   - Include onClose handler prop
   - Include message-related props and state

4. **Create window component structure**
   - Define default export function `ChatWindow`
   - Accept props with proper TypeScript typing
   - Return JSX with window layout structure

5. **Implement window layout**
   - Create three-section layout (header, body, footer)
   - Use flexbox for proper section sizing
   - Ensure responsive design considerations

6. **Add window styling**
   - Apply white background with rounded corners
   - Add shadow for elevation effect
   - Implement border styling for definition

7. **Configure window dimensions**
   - Set initial dimensions for desktop
   - Prepare for responsive sizing (Tasks 31-33)
   - Ensure proper aspect ratios

### Window Component Structure

```
ChatWindow
├── Container (rounded, shadow, white bg)
├── Header Section (fixed height)
├── Body Section (flex-grow, scrollable)
└── Footer Section (fixed height)
```

### Component Props Interface

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| onClose | () => void | Yes | Close window handler |
| messages | Message[] | Yes | Array of chat messages |
| isLoading | boolean | No | Loading state indicator |
| className | string | No | Additional CSS classes |

### Window Layout Structure

```
┌─────────────────────────────┐
│         Header              │ ← Fixed height (60px)
├─────────────────────────────┤
│                             │
│         Message             │ ← Flex-grow, scrollable
│         Body                │
│                             │
├─────────────────────────────┤
│         Footer              │ ← Fixed height (80px)
└─────────────────────────────┘
```

### Window Styling Classes

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `bg-white rounded-lg shadow-xl` | Window appearance |
| Layout | `flex flex-col h-full` | Three-section layout |
| Border | `border border-gray-200` | Subtle definition |

### Window Dimensions (Base)

| Breakpoint | Width | Height | Purpose |
|------------|-------|---------|---------|
| Desktop | 380px | 550px | Base dimensions |
| Tablet | 400px | 600px | Larger tablet view |
| Mobile | 100vw | 100vh | Full screen |

### Layout Sections

| Section | Height | Behavior | Content |
|---------|--------|----------|---------|
| Header | 60px | Fixed | Title, avatar, close button |
| Body | Flex-grow | Scrollable | Message list |
| Footer | 80px | Fixed | Input field, send button |

### Expected Outcome
- Functional window component with three sections
- Proper layout using flexbox
- White background with rounded corners and shadow
- Ready to contain header, body, and footer components
- Proper prop interface for parent communication

### Verification Checklist
- [ ] `frontend/src/components/chat/ChatWindow.tsx` file created
- [ ] Component exports properly as default
- [ ] Props interface defined with TypeScript
- [ ] Three-section layout implemented (header, body, footer)
- [ ] Flexbox layout applied for proper sizing
- [ ] Window styling applied (white bg, rounded, shadow)
- [ ] Base dimensions configured
- [ ] Component ready for responsive sizing
- [ ] OnClose handler prop accepted
- [ ] Proper height management for sections

---

## Task 25: Create Window Header

### Overview
Create the header section for the ChatWindow component. The header displays the chat title, bot avatar, online status indicator, and provides space for the close button. It maintains a consistent height and serves as the visual identifier for the chat interface.

### Dependencies
- Task 24: Create ChatWindow Component

### Instructions

1. **Create header section within ChatWindow**
   - Add header div as first section in window layout
   - Apply fixed height and border styling
   - Position header at top of window

2. **Implement header content layout**
   - Create horizontal layout using flexbox
   - Divide space between left content and right actions
   - Ensure proper alignment and spacing

3. **Add bot avatar section**
   - Include small circular avatar placeholder
   - Use system icon or bot illustration
   - Position avatar on left side of header

4. **Add chat title and status**
   - Display "Chat with us" or configurable title
   - Add online/offline status indicator
   - Position title next to avatar

5. **Create status indicator**
   - Small green dot for online status
   - Gray dot for offline status
   - Position next to title text

6. **Style header appearance**
   - Apply background color and border
   - Add padding for comfortable spacing
   - Ensure header stands out visually

### Header Layout Structure

```
Header (60px height)
┌─────────────────────────────────────────────┐
│  [Avatar] Chat with us • Online    [Close]  │
└─────────────────────────────────────────────┘
```

### Header Content Sections

| Section | Content | Alignment | Width |
|---------|---------|-----------|-------|
| Left | Avatar + Title + Status | Left | Flex-grow |
| Right | Close button | Right | Fixed |

### Header Styling Classes

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Header | `flex items-center justify-between` | Layout |
| Height | `h-15 px-4` | Fixed height with padding |
| Border | `border-b border-gray-200` | Bottom separation |
| Background | `bg-gray-50` | Subtle background |

### Avatar Configuration

| Property | Value | Class |
|----------|-------|-------|
| Size | 32px | `w-8 h-8` |
| Shape | Circle | `rounded-full` |
| Background | Blue gradient | `bg-gradient-to-r from-blue-500 to-blue-600` |
| Icon | Bot or User icon | `text-white` |

### Title and Status Layout

```
Avatar + Text Section
┌──┐ ┌─────────────────┐
│🤖│ │ Chat with us    │
└──┘ │ • Online        │
     └─────────────────┘
```

### Status Indicator

| State | Color | Indicator | Message |
|-------|-------|-----------|---------|
| Online | Green | `bg-green-500` | "Online" |
| Offline | Gray | `bg-gray-400` | "Offline" |
| Away | Yellow | `bg-yellow-500` | "Away" |

### Header Component Structure

```typescript
// Header section structure
<div className="flex items-center justify-between h-15 px-4 border-b border-gray-200 bg-gray-50">
  <div className="flex items-center space-x-3">
    {/* Avatar */}
    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
      <MessageCircle className="w-4 h-4 text-white" />
    </div>
    
    {/* Title and Status */}
    <div>
      <h3 className="font-medium text-gray-900">Chat with us</h3>
      <div className="flex items-center text-sm text-gray-500">
        <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
        Online
      </div>
    </div>
  </div>
  
  {/* Close button space - Task 26 */}
  <div>
    {/* Close button will be added */}
  </div>
</div>
```

### Expected Outcome
- Header section with fixed 60px height
- Bot avatar with blue gradient background
- Chat title "Chat with us" displayed
- Online status indicator with green dot
- Proper layout and spacing
- Ready for close button integration

### Verification Checklist
- [ ] Header section added to ChatWindow component
- [ ] Fixed height (h-15/60px) applied to header
- [ ] Flexbox layout for content alignment
- [ ] Bot avatar implemented (32px circular)
- [ ] Chat title "Chat with us" displayed
- [ ] Online status indicator with green dot
- [ ] Proper padding and spacing applied
- [ ] Bottom border for section separation
- [ ] Background color applied (bg-gray-50)
- [ ] Space reserved for close button
- [ ] Header content properly aligned

---

## Task 26: Create Close Button

### Overview
Implement the close button in the window header that allows users to minimize or close the chat window. The button should be clearly visible, accessible, and provide appropriate visual feedback. Position the button in the top-right corner of the header.

### Dependencies
- Task 25: Create Window Header

### Instructions

1. **Add close button to header**
   - Position button in the right section of header
   - Use button element with proper accessibility
   - Integrate with existing header layout

2. **Import close icon**
   - Import X icon from Lucide React
   - Alternative: Import ChevronDown for minimize
   - Ensure icon is semantically appropriate

3. **Style the close button**
   - Create small, circular button design
   - Use subtle background with hover effects
   - Apply appropriate sizing for header

4. **Implement click handling**
   - Accept onClose prop from parent window
   - Trigger close action when button clicked
   - Handle keyboard navigation

5. **Add accessibility features**
   - Include ARIA label for screen readers
   - Ensure keyboard navigation support
   - Provide clear focus indicators

6. **Apply button states**
   - Default state with subtle appearance
   - Hover state with darker background
   - Focus state with visible outline
   - Active state with slight scale

### Close Button Positioning

```
Header Layout
┌─────────────────────────────────┐
│ [Avatar] Title • Status    [X]  │ ← Close button
└─────────────────────────────────┘
```

### Button Styling Classes

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Button | `w-8 h-8 rounded-full` | Small circular button |
| Background | `bg-gray-100 hover:bg-gray-200` | Subtle with hover |
| Icon | `w-4 h-4 text-gray-600` | Appropriate icon size |
| Center | `flex items-center justify-center` | Center icon |
| Transition | `transition-colors duration-150` | Smooth state changes |

### Close Button Implementation

```typescript
// Close button component
<button
  onClick={onClose}
  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-150"
  aria-label="Close chat"
>
  <X className="w-4 h-4 text-gray-600" />
</button>
```

### Button Icon Options

| Icon | Purpose | Use Case |
|------|---------|----------|
| X | Close completely | Full close action |
| ChevronDown | Minimize | Return to button view |
| Minus | Minimize | Alternative minimize |

### Button States

| State | Background | Icon Color | Interaction |
|-------|------------|------------|-------------|
| Default | `bg-gray-100` | `text-gray-600` | Ready to click |
| Hover | `bg-gray-200` | `text-gray-700` | Enhanced feedback |
| Focus | `bg-gray-200` + ring | `text-gray-700` | Keyboard focus |
| Active | `bg-gray-300` | `text-gray-800` | Button pressed |

### Accessibility Features

| Feature | Implementation | Purpose |
|---------|----------------|---------|
| ARIA Label | `aria-label="Close chat"` | Screen reader description |
| Keyboard | Tab order support | Keyboard navigation |
| Focus Ring | Visible outline on focus | Focus indicator |
| Role | `role="button"` | Semantic meaning |

### Expected Outcome
- Close button positioned in top-right of header
- Circular button with X icon
- Proper hover and focus states
- Click handler integrated with parent onClose
- Accessible with ARIA labels and keyboard support

### Verification Checklist
- [ ] Close button added to header right section
- [ ] X icon imported from lucide-react
- [ ] Button styled as small circle (w-8 h-8)
- [ ] Hover effects applied (background color change)
- [ ] Click handler connected to onClose prop
- [ ] ARIA label added for accessibility
- [ ] Keyboard navigation supported
- [ ] Focus indicator visible
- [ ] Button integrated with header layout
- [ ] Icon properly sized (w-4 h-4)
- [ ] Smooth transition effects applied

---

## Task 27: Create Window Body

### Overview
Create the body section of the ChatWindow component that displays the message list and handles scrolling. This section takes up the majority of the window space and provides the main interface for viewing conversation history.

### Dependencies
- Task 24: Create ChatWindow Component

### Instructions

1. **Add body section to window layout**
   - Position body between header and footer
   - Apply flex-grow to take remaining space
   - Ensure body expands to fill available height

2. **Configure scrollable container**
   - Enable vertical scrolling for message overflow
   - Hide horizontal scrollbar
   - Apply smooth scrolling behavior

3. **Style the body appearance**
   - Set background color for message area
   - Add padding for comfortable message spacing
   - Ensure proper contrast and readability

4. **Prepare for message list integration**
   - Create container for message components
   - Set up proper spacing between messages
   - Plan for dynamic content loading

5. **Handle empty state**
   - Display placeholder when no messages exist
   - Show welcome message or instructions
   - Provide visual cues for starting conversation

6. **Add scroll management**
   - Auto-scroll to bottom for new messages
   - Maintain scroll position when appropriate
   - Handle scroll-to-bottom behavior

### Body Layout Structure

```
Window Body (Flex-grow)
┌─────────────────────────────┐
│ Message 1                   │
│                             │
│         Message 2           │
│                             │
│ Message 3                   │
│                             │
│            ...              │
│                             │
│         Latest Message      │
│                             │
└─────────────────────────────┘
```

### Body Styling Classes

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `flex-grow overflow-y-auto` | Scrollable area |
| Padding | `p-4 space-y-4` | Message spacing |
| Background | `bg-gray-50` | Subtle background |
| Scroll | `scrollbar-thin` | Custom scrollbar |

### Scroll Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| Overflow Y | auto | Vertical scrolling |
| Overflow X | hidden | No horizontal scroll |
| Scroll Behavior | smooth | Smooth scrolling |
| Scrollbar Style | Thin/custom | Clean appearance |

### Body Component Structure

```typescript
// Body section structure
<div className="flex-grow overflow-y-auto p-4 bg-gray-50 space-y-4">
  {messages.length > 0 ? (
    messages.map((message) => (
      <MessageComponent key={message.id} message={message} />
    ))
  ) : (
    <div className="flex items-center justify-center h-full text-gray-500">
      <div className="text-center">
        <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-lg font-medium mb-2">Start a conversation</p>
        <p className="text-sm">Send a message to begin chatting with our AI assistant.</p>
      </div>
    </div>
  )}
</div>
```

### Empty State Design

| Element | Content | Styling |
|---------|---------|---------|
| Icon | MessageCircle (48px) | Gray color |
| Title | "Start a conversation" | Large, medium weight |
| Description | Instructions text | Small, gray |
| Layout | Centered vertically | Flex center |

### Message Spacing

| Element | Spacing | Class |
|---------|---------|-------|
| Container | 16px padding | `p-4` |
| Messages | 16px between | `space-y-4` |
| Empty State | Centered | `items-center justify-center` |

### Scroll Behavior

| Scenario | Behavior |
|----------|----------|
| New message received | Auto-scroll to bottom |
| User scrolls up | Maintain position |
| Window opens | Show recent messages |
| Message history loads | Scroll to appropriate position |

### Expected Outcome
- Body section that takes remaining window height
- Scrollable area for message overflow
- Proper padding and spacing for messages
- Empty state with welcome message
- Ready for message component integration

### Verification Checklist
- [ ] Body section added with flex-grow class
- [ ] Vertical scrolling enabled (overflow-y-auto)
- [ ] Horizontal scrolling disabled
- [ ] Padding applied for message spacing (p-4)
- [ ] Background color set (bg-gray-50)
- [ ] Space-y-4 applied for message gaps
- [ ] Empty state implemented with icon and text
- [ ] Empty state centered properly
- [ ] Smooth scrolling behavior configured
- [ ] Container ready for message components
- [ ] Proper height calculation working

---

## Task 28: Create Window Footer

### Overview
Create the footer section of the ChatWindow component that contains the message input field and send button. This section maintains a fixed height at the bottom of the window and provides the primary interface for user message composition.

### Dependencies
- Task 24: Create ChatWindow Component

### Instructions

1. **Add footer section to window layout**
   - Position footer as last section in window
   - Apply fixed height for consistent appearance
   - Add top border to separate from body

2. **Create input field container**
   - Design text input area for message composition
   - Apply proper styling and dimensions
   - Include placeholder text for guidance

3. **Add send button**
   - Create send button adjacent to input field
   - Use Send icon from Lucide React
   - Position button on right side of input

4. **Implement footer layout**
   - Use horizontal layout for input and button
   - Ensure proper spacing and alignment
   - Make input field flexible with button fixed

5. **Style footer appearance**
   - Apply background color and padding
   - Add border styling for definition
   - Ensure contrast and readability

6. **Prepare for functionality**
   - Set up event handlers for input and send
   - Plan for message submission logic
   - Consider input validation and states

### Footer Layout Structure

```
Footer (80px height)
┌─────────────────────────────────────────┐
│  [──── Message Input ────]  [Send Btn]  │
└─────────────────────────────────────────┘
```

### Footer Component Sections

| Section | Content | Width | Alignment |
|---------|---------|-------|-----------|
| Input | Text input field | Flex-grow | Left-aligned |
| Button | Send button | Fixed (40px) | Right-aligned |

### Footer Styling Classes

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `flex items-center p-4` | Layout and padding |
| Height | `h-20` | Fixed footer height |
| Border | `border-t border-gray-200` | Top separation |
| Background | `bg-white` | Clean background |
| Gap | `space-x-3` | Space between input and button |

### Input Field Configuration

| Property | Value | Class |
|----------|-------|-------|
| Type | Text | `type="text"` |
| Placeholder | "Type a message..." | `placeholder="Type a message..."` |
| Styling | Rounded, border | `rounded-full border border-gray-300` |
| Padding | Horizontal padding | `px-4 py-2` |
| Width | Full available | `flex-grow` |

### Send Button Configuration

| Property | Value | Class |
|----------|-------|-------|
| Size | 40px × 40px | `w-10 h-10` |
| Shape | Circular | `rounded-full` |
| Color | Blue background | `bg-blue-600` |
| Icon | Send icon | `text-white` |
| Hover | Darker blue | `hover:bg-blue-700` |

### Footer Component Structure

```typescript
// Footer section structure
<div className="h-20 border-t border-gray-200 bg-white p-4">
  <div className="flex items-center space-x-3">
    {/* Message Input */}
    <input
      type="text"
      placeholder="Type a message..."
      className="flex-grow px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      onKeyPress={handleKeyPress}
    />
    
    {/* Send Button */}
    <button
      onClick={handleSend}
      className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors duration-150"
      disabled={!message.trim()}
    >
      <Send className="w-5 h-5 text-white" />
    </button>
  </div>
</div>
```

### Input States

| State | Border Color | Background | Interaction |
|-------|--------------|------------|-------------|
| Default | `border-gray-300` | White | Ready for input |
| Focus | `ring-blue-500` | White | Active typing |
| Error | `border-red-500` | White | Validation error |
| Disabled | `border-gray-200` | Gray | Not available |

### Button States

| State | Background | Icon | Interaction |
|-------|------------|------|-------------|
| Default | `bg-blue-600` | White | Ready to send |
| Hover | `bg-blue-700` | White | Enhanced feedback |
| Disabled | `bg-gray-300` | Gray | No message to send |
| Active | `bg-blue-800` | White | Sending message |

### Expected Outcome
- Footer section with fixed 80px height
- Input field that grows to fill available space
- Send button with proper styling and icon
- Top border separating footer from body
- Ready for message composition functionality

### Verification Checklist
- [ ] Footer section added with fixed height (h-20)
- [ ] Top border applied (border-t border-gray-200)
- [ ] Horizontal layout implemented (flex items-center)
- [ ] Input field added with proper styling
- [ ] Input placeholder text set to "Type a message..."
- [ ] Send button created with circular design
- [ ] Send icon imported and applied (w-5 h-5)
- [ ] Proper spacing between input and button (space-x-3)
- [ ] Input field uses flex-grow for width
- [ ] Button has hover effects
- [ ] Focus states configured for input
- [ ] Footer background is white

---

## Summary

This document established the foundational structure for the AI chatbot widget interface, including the main ChatWidget container with proper positioning and z-index layering, the ChatButton component with icon, badge, and pulse animation, and the ChatWindow component with header, body, and footer sections. These components provide the complete visual structure for the floating chat widget.

### Completed Tasks
1. ✓ Created ChatWidget component with visibility state management
2. ✓ Configured widget positioning (fixed bottom-right)  
3. ✓ Set widget z-index for proper layering (z-9999)
4. ✓ Created ChatButton component with circular design
5. ✓ Integrated MessageCircle icon with proper sizing
6. ✓ Added unread message badge with count display
7. ✓ Implemented pulse animation for attention drawing
8. ✓ Created ChatWindow component with three-section layout
9. ✓ Built window header with avatar, title, and status
10. ✓ Added close button with accessibility features
11. ✓ Created scrollable window body for messages
12. ✓ Implemented window footer with input and send button

### Next Steps
Proceed to [02_Tasks-29-34_Animation-Layout.md](02_Tasks-29-34_Animation-Layout.md) to implement open/close animations and responsive layout configurations for mobile, tablet, and desktop breakpoints.