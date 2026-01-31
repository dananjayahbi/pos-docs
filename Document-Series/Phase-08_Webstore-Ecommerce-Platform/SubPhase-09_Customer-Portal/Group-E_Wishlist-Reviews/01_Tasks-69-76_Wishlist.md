# Tasks 69-76: Wishlist

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 09 - Customer Portal  
> **Group:** E - Wishlist & Reviews  
> **Document:** 01 of 02  
> **Tasks Covered:** 69, 70, 71, 72, 73, 74, 75, 76

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [Group-D - 02_Tasks-62-68_Modal-Form-Verify.md](../Group-D_Addresses/02_Tasks-62-68_Modal-Form-Verify.md)
- **→ Next Document:** [02_Tasks-77-84_Reviews.md](02_Tasks-77-84_Reviews.md)

---

## Document Overview

This document covers the creation of the wishlist management functionality within the customer portal. It establishes the wishlist page with header and responsive product grid, product cards with add to cart and remove actions, and empty state with browse products CTA. The wishlist syncs with the webstore and allows customers to save products for later purchase.

### Tasks in This Document

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 69 | Create Wishlist Page | Low | 20 min |
| 70 | Create Wishlist Header | Low | 15 min |
| 71 | Create Wishlist Grid | Low | 20 min |
| 72 | Create Wishlist Product Card | Medium | 30 min |
| 73 | Create Add to Cart Button | Low | 15 min |
| 74 | Create Remove from Wishlist | Low | 15 min |
| 75 | Create Empty Wishlist State | Low | 20 min |
| 76 | Create Browse Products CTA | Low | 10 min |

---

## Task 69: Create Wishlist Page

### Overview
Create the wishlist page component within the customer portal. This page displays all products the customer has saved to their wishlist with options to add to cart or remove. The page includes header, product grid, and empty state handling.

### Dependencies
- Task 68: Verify address management functionality is complete
- Group-A: Portal routes and layout established
- Webstore wishlist API endpoints available

### Instructions

1. **Create wishlist page file**
   - Navigate to `frontend/app/(customer)/wishlist/` directory
   - Create `page.tsx` file
   - Set up as Next.js client component

2. **Define page structure**
   - Create main container with portal layout styling
   - Add max-width constraint for content
   - Ensure responsive padding and spacing

3. **Import required components**
   - Import WishlistHeader from task 70
   - Import WishlistGrid from task 71
   - Import EmptyWishlistState from task 75

4. **Add state management**
   - Initialize wishlist items state from API
   - Add loading state for data fetch
   - Handle error states appropriately

5. **Implement data fetching**
   - Fetch wishlist items on component mount
   - Use customer portal API client
   - Handle authentication and tenant context

6. **Create conditional rendering**
   - Show loading skeleton during data fetch
   - Display grid when items exist
   - Show empty state when wishlist is empty

7. **Add page metadata**
   - Set page title to "My Wishlist"
   - Configure SEO description
   - Add Open Graph tags

### Page Structure

```
┌────────────────────────────────────────┐
│         WishlistHeader                 │
├────────────────────────────────────────┤
│                                        │
│    WishlistGrid (if items exist)      │
│    or                                  │
│    EmptyWishlistState (if empty)      │
│                                        │
└────────────────────────────────────────┘
```

### Expected Outcome
- Wishlist page accessible at `/wishlist` route
- Page fetches and displays customer's wishlist items
- Proper loading and empty states implemented
- Responsive layout matches portal design

### Verification Checklist
- [ ] Page accessible at `/wishlist` URL
- [ ] Data loads correctly on mount
- [ ] Loading state displays during fetch
- [ ] Empty state shows when no items
- [ ] Page title and metadata configured

---

## Task 70: Create Wishlist Header

### Overview
Create the wishlist header component displaying the page title with dynamic item count. The header provides clear context about the wishlist contents and maintains consistency with other portal pages.

### Dependencies
- Task 69: Wishlist page created

### Instructions

1. **Create header component**
   - Navigate to `frontend/components/customer-portal/wishlist/` directory
   - Create `WishlistHeader.tsx` file
   - Define component with TypeScript interface

2. **Define component props**
   - Accept `itemCount` prop as number
   - Make itemCount optional with default value
   - Type props interface properly

3. **Implement header layout**
   - Create flex container for horizontal layout
   - Align items vertically centered
   - Add spacing between elements

4. **Add page title**
   - Display "My Wishlist" as main heading
   - Use consistent typography from portal theme
   - Apply proper heading hierarchy (h1)

5. **Display item count**
   - Show count in parentheses or badge format
   - Format as "(X items)" or "(X item)" based on count
   - Handle zero items gracefully
   - Style count to distinguish from title

6. **Apply responsive styling**
   - Ensure header scales properly on mobile
   - Adjust font sizes for smaller screens
   - Maintain readability across devices

### Header Elements

| Element | Purpose |
|---------|---------|
| Page Title | Identifies current page section |
| Item Count | Shows total wishlist items |
| Container | Provides consistent spacing |
| Typography | Matches portal design system |

### Expected Outcome
- Header displays page title with item count
- Count updates dynamically based on items
- Styling consistent with portal design
- Responsive across all breakpoints

### Verification Checklist
- [ ] Title displays "My Wishlist" correctly
- [ ] Item count shows and updates dynamically
- [ ] Typography matches portal theme
- [ ] Responsive on mobile and tablet

---

## Task 71: Create Wishlist Grid

### Overview
Create the responsive grid component for displaying wishlist items. The grid uses a 4-3-2 column layout (desktop-tablet-mobile) to showcase wishlist products with proper spacing and alignment.

### Dependencies
- Task 69: Wishlist page created
- Task 72: Wishlist product card will be placed in grid

### Instructions

1. **Create grid component**
   - Navigate to `frontend/components/customer-portal/wishlist/` directory
   - Create `WishlistGrid.tsx` file
   - Define component with TypeScript

2. **Define component props**
   - Accept `items` array of wishlist products
   - Accept optional loading state prop
   - Accept callbacks for add to cart and remove actions
   - Type all props with proper interfaces

3. **Implement responsive grid layout**
   - Use CSS Grid or Tailwind grid classes
   - Desktop: 4 columns with gap spacing
   - Tablet: 3 columns (medium breakpoint)
   - Mobile: 2 columns (small breakpoint)

4. **Add grid container styling**
   - Apply consistent gap between items
   - Set proper padding around grid
   - Ensure grid stretches full width

5. **Implement item mapping**
   - Map over items array to render cards
   - Pass each item to WishlistProductCard component
   - Include unique key for each item (product ID)
   - Pass action callbacks to cards

6. **Handle empty items array**
   - Check if items array is empty
   - Return null or empty state component
   - Let parent handle empty state display

7. **Add loading skeleton**
   - Create placeholder cards for loading state
   - Match grid layout during loading
   - Show 8 skeleton cards by default

### Grid Breakpoints

| Breakpoint | Columns | Min Width |
|------------|---------|-----------|
| Mobile | 2 | 0px |
| Tablet | 3 | 768px |
| Desktop | 4 | 1024px |

### Directory Structure
```
frontend/components/customer-portal/
├── wishlist/
│   ├── WishlistHeader.tsx
│   ├── WishlistGrid.tsx
│   └── WishlistProductCard.tsx    (Task 72)
```

### Expected Outcome
- Grid displays products in responsive columns
- Layout adapts to screen size automatically
- Proper spacing between items maintained
- Loading skeletons match grid layout

### Verification Checklist
- [ ] Grid shows 4 columns on desktop
- [ ] Grid shows 3 columns on tablet
- [ ] Grid shows 2 columns on mobile
- [ ] Gap spacing consistent throughout
- [ ] Loading skeletons work correctly

---

## Task 72: Create Wishlist Product Card

### Overview
Create the product card component for wishlist items. Each card displays product image, name, price in LKR currency, and action buttons for adding to cart and removing from wishlist. The card provides quick access to product actions.

### Dependencies
- Task 71: Wishlist grid created to contain cards

### Instructions

1. **Create product card component**
   - Navigate to `frontend/components/customer-portal/wishlist/` directory
   - Create `WishlistProductCard.tsx` file
   - Define component with TypeScript interface

2. **Define component props**
   - Accept product object with image, name, price, ID
   - Accept onAddToCart callback function
   - Accept onRemove callback function
   - Accept optional loading state
   - Type all props properly

3. **Implement card container**
   - Create bordered card with rounded corners
   - Add shadow for depth
   - Apply white background
   - Include hover effects for interactivity

4. **Add product image section**
   - Display product image at top of card
   - Use Next.js Image component for optimization
   - Set aspect ratio to 1:1 (square)
   - Add fallback image for missing images
   - Make image clickable to product page

5. **Create product information section**
   - Display product name as heading
   - Show price formatted in LKR (₨)
   - Truncate long product names
   - Add proper spacing between elements

6. **Add actions section**
   - Create button group at bottom of card
   - Include AddToCartButton (task 73)
   - Include RemoveFromWishlistButton (task 74)
   - Arrange buttons vertically or horizontally based on space

7. **Handle loading and error states**
   - Show skeleton loader when loading
   - Disable buttons during actions
   - Display error feedback if action fails

8. **Add product link**
   - Wrap card or image in Next.js Link
   - Link to webstore product detail page
   - Maintain wishlist context when navigating

### Card Sections

| Section | Content |
|---------|---------|
| Image | Product photo (square aspect) |
| Info | Name and price (₨ LKR) |
| Actions | Add to cart and remove buttons |
| Container | Border, shadow, hover effect |

### Card Layout
```
┌──────────────────┐
│                  │
│   Product Image  │
│   (1:1 ratio)    │
│                  │
├──────────────────┤
│ Product Name     │
│ ₨ 2,500.00       │
├──────────────────┤
│ [Add to Cart]    │
│ [Remove]         │
└──────────────────┘
```

### Expected Outcome
- Product cards display all necessary information
- Images load optimally with Next.js optimization
- Prices formatted correctly in LKR currency
- Action buttons work and provide feedback
- Cards are clickable to view product details

### Verification Checklist
- [ ] Product image displays correctly
- [ ] Product name and price visible
- [ ] Price formatted as ₨ X,XXX.XX
- [ ] Add to cart button works
- [ ] Remove button works
- [ ] Card links to product page
- [ ] Hover effects applied
- [ ] Loading states implemented

---

## Task 73: Create Add to Cart Button

### Overview
Create the add to cart button component for wishlist product cards. This button allows customers to quickly add wishlist items to their shopping cart without leaving the wishlist page. The button provides visual feedback during the action.

### Dependencies
- Task 72: Wishlist product card created

### Instructions

1. **Create button component**
   - Navigate to `frontend/components/customer-portal/wishlist/` directory
   - Create `AddToCartButton.tsx` file or use inline button
   - Define component with TypeScript

2. **Define button props**
   - Accept productId as string or number
   - Accept onClick callback handler
   - Accept optional loading state
   - Accept optional disabled state

3. **Implement button styling**
   - Use primary button style from theme
   - Add icon (shopping cart) with label
   - Apply proper padding and sizing
   - Include hover and active states

4. **Add loading state**
   - Show spinner during cart addition
   - Disable button while loading
   - Update button text to "Adding..."
   - Prevent duplicate clicks

5. **Handle click action**
   - Call onClick callback with product ID
   - Trigger add to cart API request
   - Show success feedback (toast or inline)
   - Handle error states gracefully

6. **Provide user feedback**
   - Show success message after adding
   - Display error message if action fails
   - Use toast notifications for feedback
   - Update cart count in navigation

7. **Handle cart context**
   - Update cart context/state on success
   - Sync cart count with backend
   - Maintain cart across navigation

### Button States

| State | Appearance | Behavior |
|-------|------------|----------|
| Default | Primary color, enabled | Clickable |
| Hover | Darker shade | Visual feedback |
| Loading | Spinner shown | Disabled |
| Disabled | Grayed out | Not clickable |

### Expected Outcome
- Button adds product to cart on click
- Loading state displays during action
- Success feedback provided to user
- Cart count updates in navigation
- Error handling implemented

### Verification Checklist
- [ ] Button styled as primary action
- [ ] Click triggers add to cart
- [ ] Loading spinner shows during action
- [ ] Success message displays
- [ ] Cart count updates
- [ ] Error handling works

---

## Task 74: Create Remove from Wishlist Button

### Overview
Create the remove button component for wishlist product cards. This button allows customers to remove items from their wishlist with confirmation feedback. The button provides clear visual distinction from the add to cart action.

### Dependencies
- Task 72: Wishlist product card created

### Instructions

1. **Create remove button component**
   - Navigate to `frontend/components/customer-portal/wishlist/` directory
   - Create `RemoveFromWishlistButton.tsx` file or use inline
   - Define component with TypeScript

2. **Define button props**
   - Accept productId as string or number
   - Accept onRemove callback handler
   - Accept optional loading state
   - Accept optional disabled state

3. **Implement button styling**
   - Use secondary or outline button style
   - Add icon (trash or X) with label
   - Use red or muted color scheme
   - Apply proper sizing to match add button

4. **Add confirmation dialog**
   - Optional: Show confirmation before removing
   - Display "Remove from wishlist?" message
   - Include cancel and confirm options
   - Or remove immediately with undo option

5. **Handle remove action**
   - Call onRemove callback with product ID
   - Trigger remove from wishlist API request
   - Show success feedback message
   - Handle errors appropriately

6. **Update UI on removal**
   - Remove product card from grid immediately
   - Use optimistic update pattern
   - Revert if API call fails
   - Animate card removal for smoothness

7. **Provide user feedback**
   - Show success message "Removed from wishlist"
   - Optionally show undo action
   - Display error message if removal fails
   - Update wishlist count in header

### Button Variants

| Style | Use Case |
|-------|----------|
| Outline | Subtle secondary action |
| Ghost | Minimal visual weight |
| Icon Only | Space-constrained layout |
| With Label | Clear action description |

### Expected Outcome
- Button removes product from wishlist
- Loading state during removal
- Product card animates out of grid
- Success feedback provided
- Wishlist count updates
- Optional undo functionality

### Verification Checklist
- [ ] Button styled as secondary action
- [ ] Click triggers remove action
- [ ] Confirmation shown (if implemented)
- [ ] Product removed from display
- [ ] Success message displays
- [ ] Wishlist count updates
- [ ] Error handling implemented

---

## Task 75: Create Empty Wishlist State

### Overview
Create the empty state component displayed when the wishlist has no items. This component provides clear messaging and a call-to-action to guide customers toward browsing products. The empty state improves user experience by preventing confusion.

### Dependencies
- Task 71: Wishlist grid created to conditionally show empty state

### Instructions

1. **Create empty state component**
   - Navigate to `frontend/components/customer-portal/wishlist/` directory
   - Create `EmptyWishlistState.tsx` file
   - Define component with TypeScript

2. **Design empty state layout**
   - Create centered container for content
   - Add vertical spacing for visual balance
   - Use flexbox or grid for centering

3. **Add visual illustration**
   - Include icon or illustration for empty wishlist
   - Use heart icon or shopping bag icon
   - Apply muted or gray color scheme
   - Size icon appropriately (large but not overwhelming)

4. **Create heading message**
   - Display "Your wishlist is empty" as heading
   - Use appropriate heading level (h2 or h3)
   - Apply centered text alignment
   - Use theme typography

5. **Add descriptive text**
   - Include supportive message below heading
   - Suggest action: "Save items you love for later"
   - Keep message concise and friendly
   - Center align text

6. **Include browse CTA**
   - Add BrowseProductsCTA component (task 76)
   - Position button below message
   - Center align button
   - Use primary button styling

7. **Apply consistent styling**
   - Match portal color scheme
   - Use proper spacing between elements
   - Ensure mobile responsiveness
   - Add subtle padding around container

### Empty State Elements

| Element | Purpose |
|---------|---------|
| Icon | Visual representation of empty state |
| Heading | Clear status message |
| Description | Helpful explanation |
| CTA Button | Direct action to resolve empty state |

### Layout Structure
```
┌─────────────────────────────────┐
│                                 │
│           [Icon]                │
│                                 │
│     Your wishlist is empty      │
│                                 │
│  Save items you love for later  │
│                                 │
│     [Browse Products →]         │
│                                 │
└─────────────────────────────────┘
```

### Expected Outcome
- Empty state displays when wishlist is empty
- Clear messaging explains situation
- Visual design is friendly and inviting
- CTA button guides user to next action
- Responsive layout on all devices

### Verification Checklist
- [ ] Empty state shows when no items
- [ ] Icon displays correctly
- [ ] Heading and description visible
- [ ] Browse products button present
- [ ] Layout centered on page
- [ ] Responsive on all screen sizes

---

## Task 76: Create Browse Products CTA

### Overview
Create the call-to-action button component that directs customers from the empty wishlist to the webstore product catalog. This button provides a clear next step for customers with empty wishlists.

### Dependencies
- Task 75: Empty wishlist state created

### Instructions

1. **Create CTA button component**
   - Navigate to `frontend/components/customer-portal/wishlist/` directory
   - Create `BrowseProductsCTA.tsx` file or use inline button
   - Define component with TypeScript

2. **Implement button as link**
   - Use Next.js Link component for navigation
   - Style as primary button
   - Link to webstore products page or homepage

3. **Add button content**
   - Display "Browse Products" as button text
   - Add right arrow icon for direction
   - Use clear, actionable language

4. **Apply button styling**
   - Use primary button color from theme
   - Add appropriate padding and sizing
   - Include hover and active states
   - Ensure sufficient click target size

5. **Set navigation target**
   - Link to main products catalog page
   - Or link to featured products section
   - Or link to homepage with product browse sections
   - Maintain customer portal context

6. **Add accessibility attributes**
   - Include aria-label if needed
   - Ensure keyboard navigation works
   - Provide focus indicators

### Button Configuration

| Property | Value |
|----------|-------|
| Link Target | `/products` or `/shop` |
| Button Style | Primary (filled) |
| Icon | Right arrow (→) |
| Text | Browse Products |

### Expected Outcome
- Button links to product catalog
- Styling matches primary actions
- Icon provides visual direction
- Click navigates to products page
- Accessible via keyboard

### Verification Checklist
- [ ] Button displays in empty state
- [ ] Click navigates to products
- [ ] Button styled as primary action
- [ ] Icon shows direction
- [ ] Hover effect works
- [ ] Keyboard accessible

---

## Document Summary

This document established the complete wishlist functionality for the customer portal:

**Components Created:**
- Wishlist page with data fetching and routing
- Wishlist header with dynamic item count
- Responsive grid with 4-3-2 column layout
- Product cards with image, info, and actions
- Add to cart button with loading states
- Remove from wishlist button with feedback
- Empty state with clear messaging
- Browse products CTA for navigation

**Key Features:**
- Wishlist syncs with webstore products
- Responsive grid adapts to screen size
- LKR currency formatting throughout
- Optimistic updates for better UX
- Loading and error state handling
- Clear empty state guidance

**Next Steps:**
- Proceed to Task 77-84 for reviews functionality
- Test wishlist integration with webstore
- Verify cart synchronization
- Implement wishlist API endpoints if needed

---

## Notes for AI Agents

When implementing these tasks:
- Follow customer portal design patterns established in Group-A
- Use existing product card components where possible
- Maintain consistency with webstore product display
- Format all prices in LKR (₨) currency
- Implement optimistic UI updates for better perceived performance
- Add proper loading skeletons matching grid layout
- Handle authentication and tenant context correctly
- Test responsive layouts at all breakpoints
- Ensure wishlist syncs with webstore wishlist state
- Add proper error boundaries and fallbacks
