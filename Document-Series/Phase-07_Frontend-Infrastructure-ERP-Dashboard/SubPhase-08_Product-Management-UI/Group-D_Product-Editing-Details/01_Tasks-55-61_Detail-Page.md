# Tasks 55-61: Product Detail Page

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 08 - Product Management UI  
> **Group:** D - Product Editing & Details  
> **Document:** 01 of 02  
> **Tasks Covered:** 55, 56, 57, 58, 59, 60, 61

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-62-70_Edit-Delete-Actions.md](02_Tasks-62-70_Edit-Delete-Actions.md)

---

## Document Overview

This document covers the creation of a comprehensive product detail page with multiple information cards, image gallery with lightbox functionality, and activity timeline. It establishes a complete view of product information including header with actions, detailed product info, pricing with LKR formatting and margin calculations, warehouse-based inventory display, interactive image gallery, and activity tracking.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 55 | Create Product Detail Page | Medium | 30 min |
| 56 | Create Product Detail Header | Low | 25 min |
| 57 | Create Product Info Card | Low | 30 min |
| 58 | Create Product Pricing Card | Low | 30 min |
| 59 | Create Product Inventory Card | Medium | 35 min |
| 60 | Create Product Image Gallery | Medium | 45 min |
| 61 | Create Product Activity Timeline | Medium | 40 min |

---

## Task 55: Create Product Detail Page

### Overview
Create the main product detail page route that displays comprehensive product information. This page uses Next.js dynamic routing with the product ID parameter, fetches product data using TanStack Query, handles loading and error states, and orchestrates all detail components in a responsive grid layout.

### Dependencies
- Task 14: Create `useProduct` hook must be complete
- All product detail components (Tasks 56-61) will be integrated here
- Dashboard layout must be available

### Instructions

1. **Create dynamic route structure**
   - Navigate to `frontend/app/(dashboard)/products/` directory
   - Create `[id]/` folder for dynamic product ID routing
   - Create `page.tsx` file inside `[id]/` directory
   - This creates route pattern: `/products/[id]`

2. **Set up page component structure**
   - Define async Server Component or Client Component with hooks
   - Accept `params` prop containing product `id`
   - Extract product ID from params for data fetching

3. **Implement data fetching**
   - Import `useProduct` hook from product hooks
   - Call `useProduct(productId)` with ID from params
   - Destructure `data`, `isLoading`, `error` from hook result

4. **Handle loading state**
   - Check `isLoading` flag
   - Display skeleton loaders for all sections
   - Match skeleton structure to actual layout

5. **Handle error state**
   - Check for `error` condition
   - Display error message with retry option
   - Include navigation back to product list

6. **Handle not found state**
   - Check if product data exists after loading
   - Display 404 message if product not found
   - Provide link back to product list

7. **Create page layout structure**
   - Use responsive grid or flex layout
   - Main content area with max-width container
   - Arrange components in logical sections

8. **Integrate ProductDetailHeader component**
   - Place at top of page layout
   - Pass full product data as prop
   - Handles product name, status, actions

9. **Create two-column grid layout**
   - Left column: Info, Pricing, Inventory cards
   - Right column: Image gallery, Activity timeline
   - Responsive: single column on mobile, two columns on desktop

10. **Add page metadata**
    - Configure dynamic page title with product name
    - Set description for SEO
    - Include product name in meta tags

### Page Layout Structure

```
┌──────────────────────────────────────────────────────────┐
│  Product Detail Header (Full Width)                      │
│  [Name, Status, Edit, More Actions]                      │
├────────────────────────────┬─────────────────────────────┤
│  Left Column (Main Info)   │  Right Column (Media/Logs)  │
│                            │                             │
│  ┌─────────────────────┐  │  ┌──────────────────────┐  │
│  │  Product Info Card  │  │  │  Image Gallery       │  │
│  │  - SKU, Categories  │  │  │  - Primary image     │  │
│  │  - Description      │  │  │  - Thumbnails        │  │
│  │  - Tags, Dates      │  │  │  - Lightbox          │  │
│  └─────────────────────┘  │  └──────────────────────┘  │
│                            │                             │
│  ┌─────────────────────┐  │  ┌──────────────────────┐  │
│  │  Pricing Card       │  │  │  Activity Timeline   │  │
│  │  - Cost (LKR)       │  │  │  - Recent changes    │  │
│  │  - Selling (LKR)    │  │  │  - User actions      │  │
│  │  - Margin %         │  │  │  - Timestamps        │  │
│  └─────────────────────┘  │  └──────────────────────┘  │
│                            │                             │
│  ┌─────────────────────┐  │                             │
│  │  Inventory Card     │  │                             │
│  │  - Per warehouse    │  │                             │
│  │  - Available stock  │  │                             │
│  │  - Reserved stock   │  │                             │
│  └─────────────────────┘  │                             │
│                            │                             │
└────────────────────────────┴─────────────────────────────┘
```

### Page Component Structure

| Section | Component | Props | Purpose |
|---------|-----------|-------|---------|
| Header | ProductDetailHeader | product | Name, status, actions |
| Info | ProductInfoCard | product | SKU, description, categories |
| Pricing | ProductPricingCard | product | Cost, price, margin |
| Inventory | ProductInventoryCard | product | Warehouse stock |
| Gallery | ProductImageGallery | images | Image display |
| Timeline | ProductActivityTimeline | activities | Change history |

### Responsive Grid Configuration

```
Mobile (< 768px)
└── Single column, stacked sections

Tablet/Desktop (≥ 768px)
├── Grid: grid-cols-2
├── Left: span-1 (Info, Pricing, Inventory)
└── Right: span-1 (Gallery, Timeline)
```

### Loading State Display

| Section | Skeleton |
|---------|----------|
| Header | Rectangle skeleton for title and buttons |
| Cards | Multiple line skeletons matching card structure |
| Gallery | Square skeleton for image area |
| Timeline | List of horizontal skeletons |

### Error Handling Strategy

| Error Type | Display | Actions |
|------------|---------|---------|
| Network Error | "Failed to load product" | Retry button |
| Not Found | "Product not found" | Back to list link |
| Permission | "Access denied" | Back to list link |

### Expected Outcome
- Functional product detail page at `/products/[id]` route
- Comprehensive display of all product information
- Proper loading and error state handling
- Responsive layout for all device sizes
- Integration point for all detail components

### Verification Checklist
- [ ] `frontend/app/(dashboard)/products/[id]/page.tsx` file created
- [ ] Dynamic routing works with product ID parameter
- [ ] `useProduct` hook integrated for data fetching
- [ ] Loading state displays skeleton loaders
- [ ] Error state handled with user-friendly messages
- [ ] Not found state displays appropriate message
- [ ] Responsive grid layout implemented
- [ ] All detail components integrated
- [ ] Page metadata configured with dynamic title
- [ ] Navigation works from product list

---

## Task 56: Create Product Detail Header

### Overview
Create the ProductDetailHeader component that displays the product name, status badge, edit button, and a dropdown menu for additional actions (archive, duplicate, delete). This header serves as the primary navigation and action hub for the product detail page.

### Dependencies
- Task 55: Create Product Detail Page (integration point)
- Status badge component should exist
- Dropdown menu component should exist

### Instructions

1. **Create component file structure**
   - Navigate to `frontend/components/modules/products/ProductDetail/` directory
   - Create `ProductDetailHeader.tsx` file
   - Create `index.ts` barrel export file if not exists

2. **Define component props interface**
   - Create `ProductDetailHeaderProps` interface
   - Include `product` prop with full product type
   - Include optional `onEdit`, `onArchive`, `onDuplicate`, `onDelete` callbacks

3. **Import required dependencies**
   - Import UI components (Button, Badge, Dropdown)
   - Import icons (Edit, MoreVertical, Archive, Copy, Trash)
   - Import Next.js router for navigation

4. **Create component structure**
   - Use flexbox for horizontal layout
   - Left side: Product name and status badge
   - Right side: Edit button and more actions dropdown

5. **Implement product name display**
   - Render product name as H1 heading
   - Apply large, bold typography
   - Truncate if name is too long

6. **Implement status badge**
   - Display product status (Active, Draft, Archived)
   - Use color coding: green (Active), gray (Draft), yellow (Archived)
   - Position badge next to product name

7. **Create Edit button**
   - Primary button with edit icon
   - Navigate to `/products/[id]/edit` on click
   - Prominent placement on right side

8. **Implement more actions dropdown**
   - Trigger button with MoreVertical icon
   - Dropdown menu with three options:
     - Archive/Restore (conditional based on status)
     - Duplicate Product
     - Delete Product
   - Each option with appropriate icon

9. **Add responsive behavior**
   - Stack vertically on mobile devices
   - Horizontal layout on tablet and desktop
   - Adjust button sizes for mobile

10. **Implement action handlers**
    - Call respective callback props when actions clicked
    - Handle navigation for Edit action
    - Trigger dialogs for destructive actions

### Header Layout Structure

```
┌────────────────────────────────────────────────────────────┐
│  Product Name                    [Edit] [•••]              │
│  [Status Badge]                                            │
└────────────────────────────────────────────────────────────┘

Dropdown Menu (More Actions):
┌─────────────────────────┐
│  📦 Archive Product     │
│  📋 Duplicate Product   │
│  🗑️  Delete Product     │
└─────────────────────────┘
```

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| product | Product | Yes | Full product object |
| onEdit | () => void | No | Edit button callback |
| onArchive | () => void | No | Archive action callback |
| onDuplicate | () => void | No | Duplicate action callback |
| onDelete | () => void | No | Delete action callback |

### Status Badge Configuration

| Status | Color | Background | Border |
|--------|-------|------------|--------|
| Active | Green 700 | Green 50 | Green 200 |
| Draft | Gray 700 | Gray 50 | Gray 200 |
| Archived | Yellow 700 | Yellow 50 | Yellow 200 |
| Out of Stock | Red 700 | Red 50 | Red 200 |

### More Actions Menu Items

| Action | Icon | Color | Function |
|--------|------|-------|----------|
| Archive | Archive | Default | Toggle archive status |
| Duplicate | Copy | Default | Clone product |
| Delete | Trash | Destructive (Red) | Delete product |

### Responsive Behavior

```
Mobile (< 640px)
├── Stack vertically
├── Name: Full width
├── Status: Below name
├── Actions: Full width row
└── Buttons: Equal width

Desktop (≥ 640px)
├── Horizontal layout
├── Name + Status: Left side
├── Actions: Right side
└── Buttons: Auto width
```

### Action Handler Logic

| Action | Behavior |
|--------|----------|
| Edit | Navigate to `/products/[id]/edit` |
| Archive | Call onArchive callback, open confirmation |
| Duplicate | Call onDuplicate callback, navigate to new form |
| Delete | Call onDelete callback, open delete dialog |

### Expected Outcome
- Functional header component with product name and status
- Working edit navigation
- Dropdown menu with all actions
- Responsive layout for all devices
- Clean, professional appearance

### Verification Checklist
- [ ] `ProductDetailHeader.tsx` file created
- [ ] Component accepts product prop
- [ ] Product name displayed as H1
- [ ] Status badge shows correct color based on status
- [ ] Edit button navigates to edit page
- [ ] More actions dropdown implemented
- [ ] All three menu actions available
- [ ] Responsive layout on mobile and desktop
- [ ] Icons display correctly
- [ ] Component exported in index.ts

---

## Task 57: Create Product Info Card

### Overview
Create the ProductInfoCard component that displays core product information including SKU, description, categories, tags, and timestamps. This card presents essential product details in a clean, organized format with proper formatting for each field type.

### Dependencies
- Task 55: Create Product Detail Page (integration point)
- Badge/Chip components for categories and tags
- Card component for consistent styling

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/products/ProductDetail/` directory
   - Create `ProductInfoCard.tsx` file
   - Export component in `index.ts`

2. **Define component props interface**
   - Create `ProductInfoCardProps` interface
   - Include `product` prop with product type
   - Include optional `className` for additional styling

3. **Import required dependencies**
   - Import Card/Container component
   - Import Badge component for categories and tags
   - Import date formatting utilities (date-fns)

4. **Create card structure**
   - Use Card component as wrapper
   - Add card title: "Product Information"
   - Organize content in sections with proper spacing

5. **Implement SKU display**
   - Label: "SKU"
   - Display SKU in badge format
   - Use monospace font for SKU value
   - Handle missing SKU gracefully

6. **Implement description display**
   - Label: "Description"
   - Render HTML description safely
   - Use proper typography (line height, spacing)
   - Display "No description" if empty

7. **Implement categories display**
   - Label: "Categories"
   - Display categories as chip/badge list
   - Use horizontal layout with wrapping
   - Show category hierarchy if applicable

8. **Implement tags display**
   - Label: "Tags"
   - Display tags as small badges
   - Use different color scheme than categories
   - Handle empty tags array

9. **Implement timestamps section**
   - Display "Created" date and time
   - Display "Last Updated" date and time
   - Format dates: "Jan 26, 2026 at 2:30 PM"
   - Use relative time for recent changes (e.g., "2 hours ago")

10. **Add proper field spacing**
    - Consistent vertical spacing between fields
    - Group related fields together
    - Use dividers for visual separation

### Card Layout Structure

```
┌──────────────────────────────────────┐
│  Product Information                  │
├──────────────────────────────────────┤
│  SKU: [PRD-001]                      │
│                                       │
│  Description:                         │
│  High-quality product with advanced   │
│  features suitable for...             │
│                                       │
│  Categories:                          │
│  [Electronics] [Computers] [Laptops]  │
│                                       │
│  Tags:                                │
│  [Featured] [New] [Sale]              │
│                                       │
│  Created: Jan 26, 2026 at 2:30 PM    │
│  Updated: 2 hours ago                 │
└──────────────────────────────────────┘
```

### Field Specifications

| Field | Display Format | Fallback |
|-------|----------------|----------|
| SKU | Monospace badge | "N/A" |
| Description | HTML rendered | "No description provided" |
| Categories | Colored chips | "No categories" |
| Tags | Small badges | "No tags" |
| Created | Full date + time | - |
| Updated | Relative or full date | - |

### Category Display

| Element | Style |
|---------|-------|
| Container | Horizontal flex with wrap |
| Badge | Blue background, rounded |
| Text | Medium weight, small size |
| Spacing | Gap of 8px between items |

### Tag Display

| Element | Style |
|---------|-------|
| Container | Horizontal flex with wrap |
| Badge | Gray background, smaller |
| Text | Regular weight, extra small |
| Spacing | Gap of 6px between items |

### Date Formatting Rules

| Condition | Format |
|-----------|--------|
| Today | Relative time (e.g., "2 hours ago") |
| This Week | Relative time (e.g., "3 days ago") |
| Older | Full date (e.g., "Jan 20, 2026") |
| With Time | Add time (e.g., "at 2:30 PM") |

### Description Rendering

| Consideration | Implementation |
|---------------|----------------|
| HTML Content | Use `dangerouslySetInnerHTML` or sanitize |
| Max Length | Show "Read More" if over 500 chars |
| Line Breaks | Preserve with `whitespace-pre-wrap` |
| Links | Style consistently with theme |

### Expected Outcome
- Comprehensive product information display
- Clean, organized card layout
- Proper formatting for all field types
- Responsive category and tag display
- User-friendly date formatting

### Verification Checklist
- [ ] `ProductInfoCard.tsx` file created
- [ ] Component accepts product prop
- [ ] SKU displayed in badge format
- [ ] Description rendered safely
- [ ] Categories displayed as chips
- [ ] Tags displayed as badges
- [ ] Created date formatted correctly
- [ ] Updated date shows relative time
- [ ] Empty states handled gracefully
- [ ] Card styling consistent with design system
- [ ] Component exported in index.ts

---

## Task 58: Create Product Pricing Card

### Overview
Create the ProductPricingCard component that displays product pricing information including cost price, selling price, profit margin calculation, and tax category. This card formats all monetary values in Sri Lankan Rupees (LKR) and automatically calculates profit margins as percentages.

### Dependencies
- Task 55: Create Product Detail Page (integration point)
- Currency formatting utility for LKR
- Card component for consistent styling

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/products/ProductDetail/` directory
   - Create `ProductPricingCard.tsx` file
   - Export component in `index.ts`

2. **Define component props interface**
   - Create `ProductPricingCardProps` interface
   - Include `product` prop with pricing fields
   - Include optional `className` prop

3. **Import required dependencies**
   - Import Card component
   - Import currency formatting utility
   - Import calculation helper functions

4. **Create card structure**
   - Use Card component as wrapper
   - Add card title: "Pricing Information"
   - Use grid layout for price fields

5. **Implement LKR formatting utility**
   - Create or import `formatLKR()` function
   - Format: "LKR 1,234.56" or "Rs. 1,234.56"
   - Handle zero and null values
   - Two decimal places for cents

6. **Display cost price**
   - Label: "Cost Price"
   - Format value in LKR
   - Use subdued color (gray)
   - Handle missing cost price

7. **Display selling price**
   - Label: "Selling Price"
   - Format value in LKR
   - Use prominent color (black/default)
   - Larger font size than cost price

8. **Calculate and display profit margin**
   - Formula: `((selling - cost) / cost) * 100`
   - Display as percentage: "25.50%"
   - Color code: green (positive), red (negative), gray (zero)
   - Show badge with margin percentage

9. **Display tax category**
   - Label: "Tax Category"
   - Show tax category name
   - Show tax rate if available: "VAT (15%)"
   - Handle missing tax category

10. **Add visual hierarchy**
    - Selling price most prominent
    - Cost price secondary
    - Margin highlighted with color
    - Consistent spacing between fields

### Card Layout Structure

```
┌──────────────────────────────────────┐
│  Pricing Information                  │
├──────────────────────────────────────┤
│  Cost Price                           │
│  LKR 8,500.00                        │
│                                       │
│  Selling Price                        │
│  LKR 12,750.00                       │
│                                       │
│  Profit Margin                        │
│  [+50.00%] ← Green badge             │
│                                       │
│  Tax Category                         │
│  VAT (15%)                            │
└──────────────────────────────────────┘
```

### LKR Formatting Specification

| Input | Output | Notes |
|-------|--------|-------|
| 1234.5 | LKR 1,234.50 | Standard format |
| 1234567 | LKR 1,234,567.00 | Thousand separators |
| 0 | LKR 0.00 | Zero value |
| null/undefined | N/A | Missing value |

### Profit Margin Calculation

| Scenario | Formula | Display |
|----------|---------|---------|
| Profit | ((12750 - 8500) / 8500) × 100 | +50.00% (green) |
| Loss | ((8500 - 12750) / 12750) × 100 | -33.33% (red) |
| Break-even | ((10000 - 10000) / 10000) × 100 | 0.00% (gray) |

### Margin Color Coding

| Range | Color | Background | Meaning |
|-------|-------|------------|---------|
| > 0% | Green 700 | Green 50 | Profit |
| = 0% | Gray 700 | Gray 50 | Break-even |
| < 0% | Red 700 | Red 50 | Loss |

### Field Layout Grid

```
Grid Configuration:
└── Single column, stacked fields

Field Spacing:
├── Label: text-sm, text-gray-500
├── Value: text-lg, font-semibold
└── Gap: 4px between label and value
```

### Tax Category Display

| Display Format | Example |
|----------------|---------|
| Name Only | "VAT" |
| With Rate | "VAT (15%)" |
| No Tax | "No Tax Applied" |

### Number Formatting Helper

```
formatLKR(amount: number): string
├── Convert to fixed 2 decimals
├── Add thousand separators
├── Prepend "LKR " or "Rs. "
└── Return formatted string
```

### Expected Outcome
- Clear pricing information display
- Proper LKR formatting for all amounts
- Automatic profit margin calculation
- Color-coded margin indicator
- Tax category information display

### Verification Checklist
- [ ] `ProductPricingCard.tsx` file created
- [ ] Component accepts product prop
- [ ] Cost price formatted in LKR
- [ ] Selling price formatted in LKR
- [ ] Profit margin calculated correctly
- [ ] Margin color coded (green/red/gray)
- [ ] Tax category displayed with rate
- [ ] Empty states handled
- [ ] Numbers formatted with thousand separators
- [ ] Two decimal places for all amounts
- [ ] Component exported in index.ts

---

## Task 59: Create Product Inventory Card

### Overview
Create the ProductInventoryCard component that displays product stock levels across multiple warehouses. This card shows available stock, reserved stock, and total stock for each warehouse in a tabular format, with color coding for stock levels and total inventory summary.

### Dependencies
- Task 55: Create Product Detail Page (integration point)
- Table component for warehouse stock display
- Stock status badge component

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/products/ProductDetail/` directory
   - Create `ProductInventoryCard.tsx` file
   - Export component in `index.ts`

2. **Define component props interface**
   - Create `ProductInventoryCardProps` interface
   - Include `product` prop with inventory data
   - Inventory should include warehouse array with stock levels

3. **Import required dependencies**
   - Import Card and Table components
   - Import Badge component for stock status
   - Import number formatting utilities

4. **Create card structure**
   - Use Card component as wrapper
   - Add card title: "Inventory Status"
   - Include total stock summary at top

5. **Implement total stock summary**
   - Calculate total available across all warehouses
   - Calculate total reserved across all warehouses
   - Display as key metrics with badges
   - Position at top of card before table

6. **Create inventory table structure**
   - Define table with four columns:
     - Warehouse Name
     - Available Stock
     - Reserved Stock
     - Total Stock
   - Use responsive table component

7. **Implement warehouse rows**
   - Map through warehouses array
   - Display each warehouse as table row
   - Show stock numbers for each column
   - Handle empty warehouse list

8. **Add stock level color coding**
   - High stock (>50): Green indicator
   - Medium stock (11-50): Yellow indicator
   - Low stock (1-10): Orange indicator
   - Out of stock (0): Red indicator

9. **Implement stock status badges**
   - Display stock level badge in Available column
   - Badge shows status text and color
   - Position inline with stock number

10. **Add responsive table behavior**
    - Scrollable on mobile if needed
    - Stack cells on very small screens
    - Adjust font sizes for readability

### Card Layout Structure

```
┌────────────────────────────────────────────────┐
│  Inventory Status                              │
├────────────────────────────────────────────────┤
│  Total Available: 245  |  Total Reserved: 18  │
├────────────────────────────────────────────────┤
│  Warehouse    │ Available │ Reserved │ Total  │
├───────────────┼───────────┼──────────┼────────┤
│  Main Store   │   150 🟢  │    12    │   162  │
│  Warehouse A  │    45 🟡  │     3    │    48  │
│  Warehouse B  │    50 🟢  │     3    │    53  │
│  Outlet 1     │     0 🔴  │     0    │     0  │
└────────────────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| product | Product | Yes | Product with inventory data |
| warehouses | Warehouse[] | Yes | Array of warehouse stock |
| className | string | No | Additional styling |

### Inventory Data Structure

```
product.inventory: [
  {
    warehouseId: "wh-1",
    warehouseName: "Main Store",
    available: 150,
    reserved: 12,
    total: 162
  },
  ...
]
```

### Stock Level Thresholds

| Level | Range | Color | Indicator |
|-------|-------|-------|-----------|
| High | > 50 | Green 500 | 🟢 |
| Medium | 11-50 | Yellow 500 | 🟡 |
| Low | 1-10 | Orange 500 | 🟠 |
| Out of Stock | 0 | Red 500 | 🔴 |

### Table Column Configuration

| Column | Width | Alignment | Format |
|--------|-------|-----------|--------|
| Warehouse | 40% | Left | Text |
| Available | 20% | Center | Number + Badge |
| Reserved | 20% | Center | Number |
| Total | 20% | Center | Number (bold) |

### Total Summary Display

```
┌─────────────────────────────────────┐
│  [245] Total Available              │
│  [18] Total Reserved                │
└─────────────────────────────────────┘
```

### Empty State Handling

| Condition | Display |
|-----------|---------|
| No Warehouses | "No warehouses configured" |
| All Zero Stock | Show table with zeros |
| Missing Data | "Inventory data unavailable" |

### Responsive Behavior

```
Desktop (≥ 768px)
└── Full table with all columns

Tablet (640-767px)
└── Condensed table, smaller padding

Mobile (< 640px)
├── Horizontal scroll if needed
└── Stack on extra small screens
```

### Stock Status Badge

| Status | Text | Background | Border |
|--------|------|------------|--------|
| In Stock (High) | "High" | Green 50 | Green 200 |
| In Stock (Medium) | "Medium" | Yellow 50 | Yellow 200 |
| Low Stock | "Low" | Orange 50 | Orange 200 |
| Out of Stock | "Out" | Red 50 | Red 200 |

### Expected Outcome
- Comprehensive inventory display by warehouse
- Clear stock level indicators with color coding
- Total stock summary at top
- Responsive table layout
- Professional warehouse stock management view

### Verification Checklist
- [ ] `ProductInventoryCard.tsx` file created
- [ ] Component accepts product with inventory prop
- [ ] Total stock summary calculated and displayed
- [ ] Inventory table with all columns created
- [ ] Each warehouse displayed as row
- [ ] Stock levels color coded correctly
- [ ] Status badges display for available stock
- [ ] Empty state handled for no warehouses
- [ ] Responsive table on mobile devices
- [ ] Numbers formatted consistently
- [ ] Component exported in index.ts

---

## Task 60: Create Product Image Gallery

### Overview
Create the ProductImageGallery component that displays product images in a gallery format with thumbnail navigation and lightbox functionality. This component shows a primary large image, thumbnail grid for navigation, highlights the primary product image, and opens a full-screen lightbox on click with keyboard and touch navigation.

### Dependencies
- Task 55: Create Product Detail Page (integration point)
- Lightbox component or library (react-image-lightbox, yet-another-react-lightbox)
- Image optimization component (Next.js Image)

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/products/ProductDetail/` directory
   - Create `ProductImageGallery.tsx` file
   - Export component in `index.ts`

2. **Define component props interface**
   - Create `ProductImageGalleryProps` interface
   - Include `images` array prop with image objects
   - Each image: id, url, alt, isPrimary flag

3. **Import required dependencies**
   - Import Next.js Image component
   - Import lightbox library
   - Import useState for selected image state

4. **Set up component state**
   - State for currently selected image index
   - State for lightbox open/closed
   - State for lightbox current image

5. **Create gallery structure**
   - Main image display area (large)
   - Thumbnail grid below main image
   - Responsive grid layout

6. **Implement main image display**
   - Display selected image in large format
   - Use Next.js Image for optimization
   - Set aspect ratio (e.g., 1:1 or 4:3)
   - Add zoom cursor on hover

7. **Implement thumbnail grid**
   - Display all product images as thumbnails
   - Use grid layout (4-6 images per row)
   - Highlight primary image with badge
   - Highlight currently selected image with border

8. **Add thumbnail click handler**
   - Update selected image when thumbnail clicked
   - Smooth transition between images
   - Update main display area

9. **Implement lightbox functionality**
   - Open lightbox when main image clicked
   - Display full-resolution image
   - Add navigation arrows (previous/next)
   - Add close button

10. **Add keyboard navigation**
    - Left arrow: Previous image
    - Right arrow: Next image
    - Escape: Close lightbox
    - Attach keyboard event listeners

11. **Add touch/swipe support**
    - Swipe left: Next image
    - Swipe right: Previous image
    - Pinch to zoom in lightbox

12. **Handle empty state**
    - Display placeholder if no images
    - Show "No images available" message
    - Use default product placeholder image

### Gallery Layout Structure

```
┌──────────────────────────────────────┐
│                                      │
│      ┌────────────────────┐         │
│      │                    │         │
│      │   Main Image       │         │
│      │   (Large Display)  │         │
│      │                    │         │
│      └────────────────────┘         │
│                                      │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐      │
│  │ 1  │ │ 2* │ │ 3  │ │ 4  │      │
│  └────┘ └────┘ └────┘ └────┘      │
│  * = Primary Image                  │
└──────────────────────────────────────┘
```

### Lightbox Structure

```
┌──────────────────────────────────────┐
│  [X] Close                           │
│                                      │
│  [←]     Full Image Display     [→] │
│                                      │
│         1 of 4                       │
└──────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| images | ProductImage[] | Yes | Array of product images |
| className | string | No | Additional styling |

### Image Object Structure

```
ProductImage {
  id: string
  url: string
  alt: string
  isPrimary: boolean
  order: number
}
```

### Main Image Display

| Property | Value | Purpose |
|----------|-------|---------|
| Aspect Ratio | 1:1 or 4:3 | Consistent sizing |
| Max Width | 100% | Responsive |
| Object Fit | cover | Fill space |
| Cursor | zoom-in | Indicate clickable |

### Thumbnail Grid Configuration

```
Grid Layout:
├── Desktop: grid-cols-6 (6 per row)
├── Tablet: grid-cols-4 (4 per row)
└── Mobile: grid-cols-4 (4 per row)

Thumbnail Size:
└── Fixed: 80px × 80px

Spacing:
└── Gap: 8px between thumbnails
```

### Thumbnail States

| State | Style |
|-------|-------|
| Default | Border: gray-200 |
| Selected | Border: blue-500, thickness: 2px |
| Primary | Badge: "Primary" in corner |
| Hover | Border: gray-400, cursor: pointer |

### Lightbox Features

| Feature | Implementation |
|---------|----------------|
| Open | Click main image or thumbnail |
| Close | Click close button, press Escape |
| Navigate | Arrow buttons, keyboard arrows |
| Counter | "1 of 4" display |
| Zoom | Pinch/scroll to zoom |

### Keyboard Controls

| Key | Action |
|-----|--------|
| Left Arrow | Previous image |
| Right Arrow | Next image |
| Escape | Close lightbox |
| Home | First image |
| End | Last image |

### Empty State

```
┌──────────────────────────────────────┐
│                                      │
│      ┌────────────────────┐         │
│      │                    │         │
│      │   📷 No Images     │         │
│      │   Available        │         │
│      │                    │         │
│      └────────────────────┘         │
│                                      │
└──────────────────────────────────────┘
```

### Image Optimization

| Aspect | Configuration |
|--------|---------------|
| Component | Next.js Image |
| Loading | Lazy load |
| Sizes | Responsive sizes |
| Quality | 85% for thumbnails, 95% for main |

### Expected Outcome
- Interactive image gallery with main display
- Thumbnail navigation grid
- Full-screen lightbox with navigation
- Keyboard and touch support
- Primary image highlighted
- Smooth transitions and animations

### Verification Checklist
- [ ] `ProductImageGallery.tsx` file created
- [ ] Component accepts images array prop
- [ ] Main image displays selected image
- [ ] Thumbnail grid shows all images
- [ ] Clicking thumbnail updates main image
- [ ] Primary image has badge indicator
- [ ] Selected image has border highlight
- [ ] Clicking main image opens lightbox
- [ ] Lightbox navigation works (arrows, keyboard)
- [ ] Escape key closes lightbox
- [ ] Empty state handled with placeholder
- [ ] Images optimized with Next.js Image
- [ ] Component exported in index.ts

---

## Task 61: Create Product Activity Timeline

### Overview
Create the ProductActivityTimeline component that displays a chronological timeline of product-related activities and changes. This component shows recent actions, user information, timestamps with relative formatting, activity type icons, and expandable details for each activity.

### Dependencies
- Task 55: Create Product Detail Page (integration point)
- Activity data from product API
- Icon components for activity types

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/products/ProductDetail/` directory
   - Create `ProductActivityTimeline.tsx` file
   - Export component in `index.ts`

2. **Define component props interface**
   - Create `ProductActivityTimelineProps` interface
   - Include `activities` array prop
   - Each activity: id, type, title, user, date, details

3. **Import required dependencies**
   - Import icon components for activity types
   - Import date formatting utilities (date-fns)
   - Import Card component

4. **Create card structure**
   - Use Card component as wrapper
   - Add card title: "Activity Timeline"
   - Include scrollable content area

5. **Define activity types and icons**
   - Created: Plus icon
   - Updated: Edit icon
   - Status Changed: Toggle icon
   - Price Changed: DollarSign icon
   - Inventory Updated: Package icon
   - Image Added: Image icon

6. **Implement timeline structure**
   - Vertical timeline with connecting line
   - Activity items stacked chronologically
   - Most recent activity at top

7. **Create activity item component**
   - Left: Icon with colored background
   - Center: Title, user, and timestamp
   - Right: Optional expand button
   - Connecting line between items

8. **Implement activity title**
   - Bold, descriptive text
   - E.g., "Product created", "Price updated"
   - Action-oriented language

9. **Display user information**
   - Show user name or email
   - Format: "by John Doe"
   - Link to user profile (optional)

10. **Format timestamps**
    - Use relative time for recent activities
    - "2 hours ago", "Yesterday", "3 days ago"
    - Full date for older activities (>7 days)

11. **Implement expandable details**
    - Click activity to expand/collapse
    - Show detailed changes in expanded state
    - E.g., "Price: LKR 1,000 → LKR 1,200"

12. **Add "Load More" functionality**
    - Display 5-10 most recent activities
    - Add "Load More" button at bottom
    - Pagination for older activities

### Timeline Layout Structure

```
┌──────────────────────────────────────┐
│  Activity Timeline                    │
├──────────────────────────────────────┤
│  ● Price updated                     │
│  │ by Admin User · 2 hours ago      │
│  │                                   │
│  ● Status changed                    │
│  │ by Manager · Yesterday           │
│  │                                   │
│  ● Inventory updated                 │
│  │ by System · 3 days ago           │
│  │                                   │
│  ● Product created                   │
│  │ by Admin · Jan 20, 2026          │
│                                      │
│  [Load More]                         │
└──────────────────────────────────────┘
```

### Activity Item Structure

```
┌─────────────────────────────────────┐
│  [Icon]  Title                      │
│    │     by User · Timestamp        │
│    │                                │
│    │     [Expanded Details]         │
│    │     • Field: Old → New         │
│    ▼                                │
└─────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| activities | Activity[] | Yes | Array of activity objects |
| maxItems | number | No | Max items to show (default: 10) |
| onLoadMore | () => void | No | Load more callback |

### Activity Object Structure

```
Activity {
  id: string
  type: ActivityType
  title: string
  userId: string
  userName: string
  timestamp: Date
  details?: ActivityDetail[]
}

ActivityDetail {
  field: string
  oldValue: string
  newValue: string
}
```

### Activity Types and Icons

| Type | Icon | Color | Example |
|------|------|-------|---------|
| created | Plus | Green | Product created |
| updated | Edit | Blue | Product updated |
| status_change | Toggle | Purple | Status changed to Active |
| price_change | DollarSign | Orange | Price updated |
| inventory_update | Package | Teal | Stock added |
| image_added | Image | Pink | Image uploaded |

### Icon Styling

| Element | Style |
|---------|-------|
| Background | Colored circle (based on type) |
| Size | 32px × 32px |
| Icon | White, 16px |
| Border | 2px white border |

### Timestamp Formatting

| Condition | Format |
|-----------|--------|
| < 1 minute | "Just now" |
| < 1 hour | "X minutes ago" |
| < 24 hours | "X hours ago" |
| Yesterday | "Yesterday" |
| < 7 days | "X days ago" |
| Older | "MMM DD, YYYY" (e.g., "Jan 20, 2026") |

### Timeline Connector

| Property | Value |
|----------|-------|
| Width | 2px |
| Color | Gray 200 |
| Position | Left of icons |
| Start | Below first icon |
| End | Above last icon |

### Expanded Details Format

```
Expanded State:
├── Field: "Price"
├── Old: "LKR 1,000.00"
├── New: "LKR 1,200.00"
└── Display: "Price: LKR 1,000.00 → LKR 1,200.00"
```

### Empty State

```
┌──────────────────────────────────────┐
│  Activity Timeline                    │
├──────────────────────────────────────┤
│                                      │
│     📋 No activity yet               │
│     Activities will appear here      │
│                                      │
└──────────────────────────────────────┘
```

### Load More Behavior

| State | Display |
|-------|---------|
| Has More | "Load More" button |
| Loading | Spinner with "Loading..." |
| No More | Hide button |

### Expected Outcome
- Chronological activity timeline display
- Clear activity type indication with icons
- Relative timestamps for recent activities
- Expandable details for changes
- User attribution for all activities
- Smooth expand/collapse animations

### Verification Checklist
- [ ] `ProductActivityTimeline.tsx` file created
- [ ] Component accepts activities array prop
- [ ] Timeline displays activities chronologically
- [ ] Each activity has appropriate icon
- [ ] Activity titles are descriptive
- [ ] User names displayed correctly
- [ ] Timestamps formatted as relative time
- [ ] Full dates shown for old activities
- [ ] Activities expandable to show details
- [ ] Timeline connector line displays correctly
- [ ] Empty state handled gracefully
- [ ] Load More functionality implemented (if applicable)
- [ ] Component exported in index.ts

---

## Summary

This document established the comprehensive product detail page with multiple information cards, interactive image gallery, and activity tracking. The implementation provides a complete view of product information with proper formatting for Sri Lankan Rupees, warehouse-based inventory display, lightbox image viewing, and chronological activity history.

### Completed Tasks
1. ✓ Created product detail page with dynamic routing
2. ✓ Created product detail header with actions
3. ✓ Created product info card with categories and tags
4. ✓ Created product pricing card with LKR formatting and margin calculation
5. ✓ Created product inventory card with warehouse stock display
6. ✓ Created product image gallery with lightbox functionality
7. ✓ Created product activity timeline with change tracking

### Next Steps
Proceed to [02_Tasks-62-70_Edit-Delete-Actions.md](02_Tasks-62-70_Edit-Delete-Actions.md) to create the product edit page, implement update functionality with optimistic updates, and add delete, archive, and duplicate actions.
