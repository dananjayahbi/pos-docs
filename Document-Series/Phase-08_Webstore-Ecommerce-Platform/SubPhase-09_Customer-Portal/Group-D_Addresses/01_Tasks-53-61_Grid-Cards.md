# Tasks 53-61: Grid and Card Components

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 09 - Customer Portal  
> **Group:** D - Addresses  
> **Document:** 01 of 02  
> **Tasks Covered:** 53, 54, 55, 56, 57, 58, 59, 60, 61

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group-C_Order-Details-Tracking](../Group-C_Order-Details-Tracking/)
- **→ Next Document:** [02_Tasks-62-68_Modal-Form-Verify.md](02_Tasks-62-68_Modal-Form-Verify.md)

---

## Document Overview

This document covers the creation of the addresses page with grid layout and address card components. It establishes the foundational structure for address management, including the addresses page setup, header component with add button, responsive grid layout, address card with all display elements, and action buttons for editing, deleting, and setting default addresses.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 53 | Create Addresses Page | Low | 20 min |
| 54 | Create Addresses Header | Low | 15 min |
| 55 | Create Address Grid | Low | 20 min |
| 56 | Create Address Card | Medium | 30 min |
| 57 | Create Default Badge | Low | 10 min |
| 58 | Create Address Type Label | Low | 10 min |
| 59 | Create Edit Address Button | Low | 15 min |
| 60 | Create Delete Address Button | Low | 15 min |
| 61 | Create Set Default Button | Low | 15 min |

---

## Task 53: Create Addresses Page

### Overview
Create the main addresses page component that serves as the container for all address management functionality. This page component integrates the header, grid layout, and all child components to provide a complete address management interface within the customer portal.

### Dependencies
- Task 52: Create Profile Page (completed in Group-C)
- SubPhase-09 Group-A: Portal routes and layout structure
- Customer authentication context

### Instructions

1. **Create the addresses page file**
   - Navigate to `frontend/components/storefront/portal/Addresses/` directory
   - Create new file named `AddressesPage.tsx`
   - This component serves as the main container for address management

2. **Import required dependencies**
   - Import React hooks (useState, useEffect)
   - Import Next.js router for navigation
   - Import child components (header, grid) created in subsequent tasks
   - Import address service for API calls

3. **Set up component state**
   - Create state for addresses array
   - Create state for loading status
   - Create state for error handling
   - Create state for modal visibility

4. **Implement data fetching**
   - Use useEffect to fetch addresses on component mount
   - Call address service to get customer addresses
   - Handle loading states appropriately
   - Handle error states with user-friendly messages

5. **Define component structure**
   - Wrap content in container with proper padding
   - Include addresses header component at top
   - Include address grid component below header
   - Add empty state for no addresses

6. **Add callback functions**
   - Create handler for adding new address
   - Create handler for editing address
   - Create handler for deleting address
   - Create handler for setting default address

7. **Implement empty state**
   - Display when no addresses exist
   - Show icon and descriptive message
   - Include call-to-action to add first address
   - Style according to webstore theme

### Page Structure

```
┌─────────────────────────────────────┐
│        Addresses Header             │
│  (Title + Add New Button)           │
├─────────────────────────────────────┤
│                                     │
│    Address Grid (2 columns)        │
│    ┌──────────┐  ┌──────────┐     │
│    │ Card  1  │  │ Card  2  │     │
│    └──────────┘  └──────────┘     │
│    ┌──────────┐  ┌──────────┐     │
│    │ Card  3  │  │ Card  4  │     │
│    └──────────┘  └──────────┘     │
│                                     │
└─────────────────────────────────────┘
```

### State Management

| State | Type | Purpose |
|-------|------|---------|
| addresses | Address[] | Store fetched addresses |
| loading | boolean | Track loading state |
| error | string | null | Store error messages |
| isModalOpen | boolean | Control modal visibility |
| selectedAddress | Address | null | Track address being edited |

### Expected Outcome
- Functional addresses page component
- Proper state management for addresses
- Data fetching on component mount
- Empty state for no addresses
- Integration with child components

### Verification Checklist
- [ ] `AddressesPage.tsx` file created in correct directory
- [ ] Component fetches addresses on mount
- [ ] Loading state displays during fetch
- [ ] Empty state shows when no addresses
- [ ] Page integrates with portal layout

---

## Task 54: Create Addresses Header

### Overview
Create the addresses header component that displays the page title and action button for adding new addresses. This header provides clear context for the page and easy access to the primary action of adding a new address.

### Dependencies
- Task 53: Create Addresses Page

### Instructions

1. **Create the header component file**
   - Navigate to `frontend/components/storefront/portal/Addresses/` directory
   - Create new file named `AddressesHeader.tsx`
   - This component renders the page header section

2. **Import required dependencies**
   - Import button component from UI library
   - Import icon components (Plus icon for add button)
   - Import TypeScript types for props

3. **Define component props interface**
   - Create interface for component props
   - Include onAddClick callback for add button
   - Type callback as function returning void

4. **Create component structure**
   - Use flex layout for horizontal arrangement
   - Place title on the left side
   - Place add button on the right side
   - Ensure responsive behavior for mobile

5. **Implement title section**
   - Display "My Addresses" as main heading
   - Use appropriate heading level (h1 or h2)
   - Apply webstore typography styles
   - Add optional subtitle with address count

6. **Implement add button**
   - Display "Add New Address" button
   - Include Plus icon before text
   - Apply primary button styling
   - Connect onClick handler to onAddClick prop
   - Make button responsive (icon only on mobile)

7. **Add responsive design**
   - Stack vertically on mobile screens
   - Horizontal layout on tablet and desktop
   - Adjust button size for different breakpoints
   - Ensure proper spacing and alignment

### Header Layout

| Element | Position | Mobile | Desktop |
|---------|----------|--------|---------|
| Title | Left | Full width | Left aligned |
| Add Button | Right | Full width | Right aligned |

### Props Interface

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| onAddClick | () => void | Yes | Callback for add button |
| addressCount | number | No | Total address count |

### Expected Outcome
- Header component with title and add button
- Proper callback integration for adding addresses
- Responsive layout for all screen sizes
- Clean and accessible interface

### Verification Checklist
- [ ] `AddressesHeader.tsx` file created
- [ ] Component displays title correctly
- [ ] Add button triggers callback
- [ ] Responsive on mobile and desktop
- [ ] Proper spacing and alignment

---

## Task 55: Create Address Grid

### Overview
Create the address grid component that displays addresses in a responsive two-column layout. This grid component manages the layout and arrangement of individual address cards, adapting to different screen sizes and handling empty states.

### Dependencies
- Task 53: Create Addresses Page

### Instructions

1. **Create the grid component file**
   - Navigate to `frontend/components/storefront/portal/Addresses/` directory
   - Create new file named `AddressGrid.tsx`
   - This component handles grid layout for address cards

2. **Import required dependencies**
   - Import address card component (created in Task 56)
   - Import loading skeleton components
   - Import TypeScript types for Address model
   - Import empty state component

3. **Define component props interface**
   - Create interface for grid props
   - Include addresses array of Address objects
   - Include loading state boolean
   - Include callback functions for card actions

4. **Create grid layout structure**
   - Use CSS Grid or Tailwind grid utilities
   - Set two columns on desktop
   - Set one column on mobile and tablet
   - Apply consistent gap between cards

5. **Implement loading state**
   - Display skeleton loaders during data fetch
   - Show 4 skeleton cards in grid layout
   - Match skeleton dimensions to actual cards
   - Apply shimmer animation effect

6. **Implement empty state**
   - Check if addresses array is empty
   - Display empty state message
   - Show icon (mailbox or address icon)
   - Include descriptive text
   - Add call-to-action button

7. **Render address cards**
   - Map through addresses array
   - Render AddressCard for each address
   - Pass address data and callbacks
   - Apply unique key for each card

8. **Add responsive behavior**
   - Single column on mobile (< 640px)
   - Two columns on desktop (≥ 1024px)
   - Adjust card spacing for different screens
   - Ensure proper vertical spacing

### Grid Layout Configuration

| Screen Size | Columns | Gap | Max Width |
|-------------|---------|-----|-----------|
| Mobile | 1 | 1rem | 100% |
| Tablet | 1 | 1.5rem | 100% |
| Desktop | 2 | 2rem | 100% |

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| addresses | Address[] | Yes | Array of addresses |
| loading | boolean | Yes | Loading state |
| onEdit | (id) => void | Yes | Edit callback |
| onDelete | (id) => void | Yes | Delete callback |
| onSetDefault | (id) => void | Yes | Set default callback |

### Expected Outcome
- Responsive grid layout for address cards
- Proper handling of loading state
- Empty state for no addresses
- Smooth transitions and animations
- Proper spacing and alignment

### Verification Checklist
- [ ] `AddressGrid.tsx` file created
- [ ] Grid displays two columns on desktop
- [ ] Grid displays one column on mobile
- [ ] Loading skeletons display correctly
- [ ] Empty state shows when no addresses

---

## Task 56: Create Address Card

### Overview
Create the address card component that displays individual address information with type indicator, default badge, formatted address details, and action buttons. This card serves as the primary display unit for each saved address in the grid.

### Dependencies
- Task 55: Create Address Grid

### Instructions

1. **Create the card component file**
   - Navigate to `frontend/components/storefront/portal/Addresses/` directory
   - Create new file named `AddressCard.tsx`
   - This component renders individual address information

2. **Import required dependencies**
   - Import child components (badge, type label, actions)
   - Import card components from UI library
   - Import TypeScript types for Address model
   - Import icon components for visual elements

3. **Define component props interface**
   - Create interface for card props
   - Include address object with all fields
   - Include callbacks for edit, delete, set default
   - Include optional className for styling

4. **Create card structure**
   - Use card component as container
   - Add padding and border styling
   - Implement hover effect for interactivity
   - Apply shadow for depth

5. **Implement card header section**
   - Display address type label (Task 58)
   - Display default badge if applicable (Task 57)
   - Use flex layout for horizontal arrangement
   - Position badge on the right side

6. **Implement address details section**
   - Display recipient name if available
   - Display address line 1 and line 2
   - Display city, district, province in formatted layout
   - Display phone number with proper formatting
   - Use proper line breaks and spacing

7. **Implement actions section**
   - Display action buttons at bottom of card
   - Include edit button (Task 59)
   - Include delete button (Task 60)
   - Include set default button (Task 61)
   - Use flex layout for button arrangement

8. **Add conditional styling**
   - Highlight default address with border color
   - Apply different styling for shipping vs billing
   - Add hover states for better UX
   - Ensure proper contrast ratios

### Card Layout

```
┌─────────────────────────────────┐
│ [Type Label]      [Default]    │
├─────────────────────────────────┤
│ Recipient Name                  │
│ Address Line 1                  │
│ Address Line 2                  │
│ City, District                  │
│ Province                        │
│ +94 XX XXX XXXX                │
├─────────────────────────────────┤
│ [Edit] [Delete] [Set Default]  │
└─────────────────────────────────┘
```

### Address Display Format

| Field | Format | Example |
|-------|--------|---------|
| Name | Full name | John Doe |
| Line 1 | Street address | 123 Main Street |
| Line 2 | Additional | Apartment 4B |
| City | City name | Colombo |
| District | District name | Colombo District |
| Province | Province name | Western Province |
| Phone | +94 XX XXX XXXX | +94 77 123 4567 |

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| address | Address | Yes | Address object |
| onEdit | (id) => void | Yes | Edit callback |
| onDelete | (id) => void | Yes | Delete callback |
| onSetDefault | (id) => void | Yes | Set default callback |

### Expected Outcome
- Card displays all address information clearly
- Proper formatting for Sri Lanka addresses
- Visual distinction for default addresses
- Action buttons integrated properly
- Responsive layout for mobile devices

### Verification Checklist
- [ ] `AddressCard.tsx` file created
- [ ] Card displays all address fields
- [ ] Type label and default badge show correctly
- [ ] Action buttons integrated properly
- [ ] Card is responsive on all screen sizes

---

## Task 57: Create Default Badge

### Overview
Create the default badge component that visually indicates which address is set as the default for its type (shipping or billing). This badge provides clear visual feedback using green styling to highlight default addresses.

### Dependencies
- Task 56: Create Address Card

### Instructions

1. **Create the badge component file**
   - Navigate to `frontend/components/storefront/portal/Addresses/` directory
   - Create new file named `DefaultBadge.tsx`
   - This component renders a small badge indicator

2. **Import required dependencies**
   - Import badge component from UI library
   - Import icon components (check or star icon)
   - Import TypeScript types for props

3. **Define component props interface**
   - Create simple interface for props
   - Consider adding variant prop for different styles
   - Keep interface minimal as badge is simple

4. **Implement badge structure**
   - Use small badge component as base
   - Display "Default" text label
   - Include checkmark or star icon
   - Apply green color scheme

5. **Apply green styling**
   - Use green background color (emerald or success)
   - Use white or light text color
   - Add subtle border if needed
   - Ensure proper contrast for accessibility

6. **Add responsive sizing**
   - Set appropriate text size (small or extra-small)
   - Set appropriate padding for compact appearance
   - Ensure readable on mobile devices
   - Scale icon proportionally

7. **Consider accessibility**
   - Add aria-label for screen readers
   - Ensure sufficient color contrast
   - Add focus states if interactive
   - Use semantic HTML

### Badge Styling

| Property | Value | Purpose |
|----------|-------|---------|
| Background | Green-500 | Success indication |
| Text | White | High contrast |
| Size | Small | Compact display |
| Icon | Check/Star | Visual confirmation |

### Component Variants

| Variant | Use Case | Color Scheme |
|---------|----------|--------------|
| Default | Standard default badge | Green background |
| Shipping | Shipping default | Green with truck icon |
| Billing | Billing default | Green with card icon |

### Expected Outcome
- Small, compact badge component
- Green color scheme for default indication
- Clear visibility on address cards
- Proper accessibility attributes
- Consistent styling across application

### Verification Checklist
- [ ] `DefaultBadge.tsx` file created
- [ ] Badge displays with green styling
- [ ] Badge includes icon and text
- [ ] Badge is properly sized
- [ ] Badge meets accessibility standards

---

## Task 58: Create Address Type Label

### Overview
Create the address type label component that displays whether an address is designated for shipping or billing purposes. This label provides clear identification of the address purpose using color-coded badges or labels.

### Dependencies
- Task 56: Create Address Card

### Instructions

1. **Create the type label component file**
   - Navigate to `frontend/components/storefront/portal/Addresses/` directory
   - Create new file named `AddressType.tsx`
   - This component renders type indicator badge

2. **Import required dependencies**
   - Import badge or label component from UI library
   - Import icon components (truck for shipping, card for billing)
   - Import TypeScript types for address types

3. **Define component props interface**
   - Create interface with type prop
   - Type prop should be enum or union type
   - Support "shipping" and "billing" values

4. **Create type enum or constant**
   - Define address type constants
   - Support SHIPPING and BILLING types
   - Export for use in other components

5. **Implement conditional rendering**
   - Check address type value
   - Render appropriate label text
   - Display appropriate icon
   - Apply type-specific styling

6. **Apply shipping styling**
   - Use blue color scheme for shipping
   - Include truck or package icon
   - Display "Shipping Address" text
   - Apply consistent sizing

7. **Apply billing styling**
   - Use purple or indigo color scheme for billing
   - Include credit card or document icon
   - Display "Billing Address" text
   - Apply consistent sizing

8. **Add responsive behavior**
   - Show full text on desktop
   - Consider icon-only on very small screens
   - Ensure label is always visible
   - Maintain proper spacing

### Address Type Configuration

| Type | Label | Icon | Color |
|------|-------|------|-------|
| Shipping | Shipping Address | Truck | Blue |
| Billing | Billing Address | Card | Purple |

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| type | 'shipping' | 'billing' | Yes | Address type |
| variant | 'badge' | 'label' | No | Display variant |
| showIcon | boolean | No | Show/hide icon |

### Expected Outcome
- Label displays correct type with appropriate styling
- Color-coded for quick identification
- Includes relevant icon for visual recognition
- Responsive and accessible
- Consistent with design system

### Verification Checklist
- [ ] `AddressType.tsx` file created
- [ ] Label displays shipping type correctly
- [ ] Label displays billing type correctly
- [ ] Icons display for each type
- [ ] Colors differentiate types clearly

---

## Task 59: Create Edit Address Button

### Overview
Create the edit address button component that triggers the address editing functionality. This button provides users with a clear action to modify existing address information through the address form modal.

### Dependencies
- Task 56: Create Address Card

### Instructions

1. **Create the edit button component file**
   - Navigate to `frontend/components/storefront/portal/Addresses/` directory
   - Create new file named `AddressActions.tsx` (shared file for all actions)
   - This file contains edit, delete, and set default buttons

2. **Import required dependencies**
   - Import button component from UI library
   - Import icon components (Edit/Pencil icon)
   - Import TypeScript types for props
   - Import Tooltip component for accessibility

3. **Define edit button props interface**
   - Create interface for edit button props
   - Include onClick callback
   - Include optional disabled state
   - Include addressId for tracking

4. **Create edit button component**
   - Export named component for edit action
   - Use secondary or ghost button variant
   - Display edit icon with optional text
   - Apply proper sizing and padding

5. **Implement button behavior**
   - Connect onClick handler to prop callback
   - Pass address ID to callback function
   - Handle disabled state styling
   - Add loading state if needed

6. **Add icon and label**
   - Use pencil or edit icon from icon library
   - Display "Edit" text next to icon on desktop
   - Show only icon on mobile with tooltip
   - Ensure icon is properly sized

7. **Apply button styling**
   - Use neutral or secondary color scheme
   - Apply hover and focus states
   - Ensure proper contrast ratios
   - Match webstore design system

8. **Add accessibility features**
   - Include aria-label for screen readers
   - Add tooltip on hover for icon-only version
   - Ensure keyboard navigation works
   - Add focus visible styles

### Button Variants

| Variant | Use Case | Style |
|---------|----------|-------|
| Desktop | Full button with text | Icon + "Edit" text |
| Mobile | Icon only | Icon with tooltip |
| Disabled | Address is locked | Grayed out |

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| onClick | (id: string) => void | Yes | Click handler |
| addressId | string | Yes | Address identifier |
| disabled | boolean | No | Disable button |

### Expected Outcome
- Functional edit button component
- Proper click handling for editing
- Responsive design with icon/text
- Accessible with tooltips and ARIA
- Consistent styling with design system

### Verification Checklist
- [ ] Edit button component created in `AddressActions.tsx`
- [ ] Button triggers onClick callback
- [ ] Button displays icon and text
- [ ] Button is accessible
- [ ] Button styling matches design system

---

## Task 60: Create Delete Address Button

### Overview
Create the delete address button component that triggers the address deletion process. This button provides users with the ability to remove addresses, typically triggering a confirmation modal before actual deletion.

### Dependencies
- Task 56: Create Address Card

### Instructions

1. **Add delete button to AddressActions component**
   - Open `frontend/components/storefront/portal/Addresses/AddressActions.tsx`
   - Add new export for delete button component
   - Keep in same file as edit button for consistency

2. **Import required dependencies**
   - Import button component from UI library
   - Import trash or delete icon
   - Import TypeScript types for props
   - Import tooltip component

3. **Define delete button props interface**
   - Create interface for delete button props
   - Include onClick callback
   - Include optional disabled state
   - Include addressId for tracking
   - Include isDefault flag to prevent deletion

4. **Create delete button component**
   - Export named component for delete action
   - Use destructive or danger button variant
   - Display trash icon with optional text
   - Apply warning color scheme (red)

5. **Implement button behavior**
   - Connect onClick handler to prop callback
   - Pass address ID to callback function
   - Disable button if address is default
   - Show tooltip explaining why disabled

6. **Add icon and label**
   - Use trash or delete icon from icon library
   - Display "Delete" text next to icon on desktop
   - Show only icon on mobile with tooltip
   - Ensure icon is properly sized

7. **Apply destructive styling**
   - Use red or danger color scheme
   - Apply hover state with darker red
   - Add visual warning indicators
   - Ensure proper contrast ratios

8. **Add safety features**
   - Disable button for default addresses
   - Show tooltip explaining restriction
   - Add confirmation in parent component
   - Prevent accidental deletion

### Button Safety Rules

| Condition | Behavior | Reason |
|-----------|----------|--------|
| Default address | Disabled | Cannot delete default |
| Last address | Warn | User should keep at least one |
| Recent order | Warn | Address in use |

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| onClick | (id: string) => void | Yes | Click handler |
| addressId | string | Yes | Address identifier |
| isDefault | boolean | Yes | Is default address |
| disabled | boolean | No | Additional disable |

### Expected Outcome
- Functional delete button component
- Destructive styling with red color
- Disabled state for default addresses
- Tooltip explains restrictions
- Triggers confirmation modal

### Verification Checklist
- [ ] Delete button added to `AddressActions.tsx`
- [ ] Button triggers onClick callback
- [ ] Button disabled for default addresses
- [ ] Button uses destructive styling
- [ ] Tooltip shows for disabled state

---

## Task 61: Create Set Default Button

### Overview
Create the set default button component that allows users to designate an address as the default for its type (shipping or billing). This button enables quick switching of default addresses without opening the full edit form.

### Dependencies
- Task 56: Create Address Card

### Instructions

1. **Add set default button to AddressActions component**
   - Open `frontend/components/storefront/portal/Addresses/AddressActions.tsx`
   - Add new export for set default button component
   - Keep all action buttons in same file

2. **Import required dependencies**
   - Import button component from UI library
   - Import star or check icon
   - Import TypeScript types for props
   - Import tooltip component

3. **Define set default button props interface**
   - Create interface for button props
   - Include onClick callback
   - Include addressId for tracking
   - Include isDefault flag to hide when already default
   - Include loading state for API call

4. **Create set default button component**
   - Export named component for set default action
   - Use primary or accent button variant
   - Display star or checkmark icon
   - Show only when address is not default

5. **Implement conditional rendering**
   - Hide button if address is already default
   - Show button if address is not default
   - Handle loading state during API call
   - Show success feedback briefly

6. **Implement button behavior**
   - Connect onClick handler to prop callback
   - Pass address ID to callback function
   - Show loading spinner during update
   - Disable button during loading

7. **Add icon and label**
   - Use star icon for set default action
   - Display "Set as Default" text on desktop
   - Show only icon on mobile with tooltip
   - Ensure icon is properly sized

8. **Apply button styling**
   - Use primary or accent color scheme
   - Apply hover and focus states
   - Add transition effects
   - Match webstore design system

### Button States

| State | Display | Behavior |
|-------|---------|----------|
| Hidden | Address is default | Don't render button |
| Visible | Address not default | Show set default button |
| Loading | API call in progress | Show spinner, disable |
| Success | Just set as default | Brief success indicator |

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| onClick | (id: string) => void | Yes | Click handler |
| addressId | string | Yes | Address identifier |
| isDefault | boolean | Yes | Current default status |
| loading | boolean | No | Loading state |
| type | 'shipping' | 'billing' | Yes | Address type |

### Expected Outcome
- Functional set default button component
- Hidden when address is already default
- Shows loading state during API call
- Provides clear visual feedback
- Accessible with tooltips and ARIA

### Verification Checklist
- [ ] Set default button added to `AddressActions.tsx`
- [ ] Button hidden for default addresses
- [ ] Button triggers onClick callback
- [ ] Button shows loading state
- [ ] Button styling matches design system

---

## Final Structure

```
frontend/components/storefront/portal/Addresses/
├── AddressesPage.tsx         # Main page container (Task 53)
├── AddressesHeader.tsx       # Header with title and add button (Task 54)
├── AddressGrid.tsx           # Responsive grid layout (Task 55)
├── AddressCard.tsx           # Individual address card (Task 56)
├── DefaultBadge.tsx          # Green badge for default (Task 57)
├── AddressType.tsx           # Type label (shipping/billing) (Task 58)
├── AddressActions.tsx        # Edit, Delete, Set Default buttons (Tasks 59-61)
└── index.ts                  # Export all components
```

---

## Integration Notes

### Data Flow
1. AddressesPage fetches addresses from API
2. AddressesPage passes data to AddressGrid
3. AddressGrid renders AddressCard for each address
4. AddressCard integrates all sub-components
5. Action buttons trigger callbacks back to AddressesPage

### Component Composition
- AddressCard uses DefaultBadge, AddressType, and AddressActions
- AddressActions contains Edit, Delete, and Set Default buttons
- AddressGrid handles layout for multiple AddressCard components
- AddressesHeader provides page title and primary action

### State Management
- Main state lives in AddressesPage
- Child components are stateless presentational components
- Callbacks flow from AddressesPage down through props
- API calls managed in AddressesPage or custom hooks

---

## Notes for AI Agents

- All components in this document are presentational
- Actual form and modal created in next document
- Follow Sri Lanka address format (no zip code)
- Default badge only shows for default addresses
- Address type distinguishes shipping vs billing
- Action buttons must handle proper callbacks
- Responsive design is critical for mobile users
- Use existing webstore design system components
- Maintain consistency with customer portal styling
- Test with various address data scenarios
