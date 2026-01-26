# Tasks 71-77: Variant Management Interface

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 08 - Product Management UI  
> **Group:** E - Variant & Category Management  
> **Document:** 01 of 02  
> **Tasks Covered:** 71, 72, 73, 74, 75, 76, 77

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-78-86_Category-Management.md](02_Tasks-78-86_Category-Management.md)

---

## Document Overview

This document covers the creation of the variant management interface for products with multiple variations (e.g., sizes, colors, materials). It establishes the variant management page, attribute selector, matrix builder for generating combinations, variant table, inline editing capabilities, bulk editing functionality, and variant deletion actions.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 71 | Create Variant Management Page | Medium | 45 min |
| 72 | Create Variant Attribute Selector | Medium | 60 min |
| 73 | Create Variant Matrix Builder | High | 90 min |
| 74 | Create Variant Table | Medium | 60 min |
| 75 | Create Variant Inline Editor | Medium | 45 min |
| 76 | Create Variant Bulk Edit | Medium | 45 min |
| 77 | Create Variant Delete Action | Low | 30 min |

---

## Task 71: Create Variant Management Page

### Overview
Create the dedicated page for managing product variants at `/products/[id]/variants`. This page provides a comprehensive interface for adding, editing, and managing variants with different attribute combinations (size, color, material, etc.). The page displays existing variants and provides access to the variant matrix builder.

### Dependencies
- Task 14: Products List Page (routes established)
- SubPhase-05: Form Components & Validation
- Product detail state management

### Instructions

1. **Create page file structure**
   - Navigate to `frontend/app/(dashboard)/products/[id]/` directory
   - Create new directory named `variants`
   - Create `page.tsx` file in the variants directory

2. **Set up page metadata**
   - Export metadata object with page title
   - Set title to "Manage Variants | Product Name"
   - Configure description for SEO

3. **Define page component**
   - Create async server component `VariantManagementPage`
   - Accept params prop with product id
   - Fetch product data to verify product exists

4. **Implement page layout structure**
   - Page header with breadcrumbs
   - Product context section (name, image, base SKU)
   - Variant management section
   - Action buttons (Back to Product, Add Variants)

5. **Add variant count display**
   - Show total number of variants
   - Display variant status summary (active, low stock)
   - Add visual indicators for variant health

6. **Integrate variant components**
   - Import VariantManager component (created in Task 72)
   - Pass product data as props
   - Handle loading and error states

7. **Add navigation controls**
   - Back button to product details
   - Breadcrumb trail: Products → Product Name → Variants
   - Tab navigation (Details, Variants, Inventory)

### Page Structure

```
┌────────────────────────────────────────────┐
│  Breadcrumbs: Products > Product > Variants│
├────────────────────────────────────────────┤
│  Product Context                           │
│  ┌──────┐  T-Shirt Classic                │
│  │ IMG  │  Base SKU: TSH-001               │
│  └──────┘  12 variants                     │
├────────────────────────────────────────────┤
│  [+ Add Variants]  [Bulk Edit]             │
├────────────────────────────────────────────┤
│  Variant Management Section                │
│  (VariantManager component)                │
└────────────────────────────────────────────┘
```

### Page Sections

| Section | Purpose | Components |
|---------|---------|------------|
| Header | Navigation and context | Breadcrumbs, title |
| Product Info | Product summary | Image, name, SKU |
| Actions | Main operations | Add, Bulk Edit buttons |
| Variant Manager | Core interface | VariantManager component |

### URL Structure

| Route | Description |
|-------|-------------|
| `/products/[id]/variants` | Main variant management page |
| `/products/[id]/variants?action=create` | Open matrix builder |
| `/products/[id]/variants?edit=bulk` | Bulk edit mode |

### State Management

| State | Type | Purpose |
|-------|------|---------|
| product | Product | Current product data |
| variants | Variant[] | List of product variants |
| isLoading | boolean | Loading indicator |
| error | Error \| null | Error state |

### Expected Outcome
- Functional variant management page at `/products/[id]/variants`
- Product context display with image and details
- Integration point for variant management components
- Proper navigation and breadcrumbs

### Verification Checklist
- [ ] Page file created at correct path
- [ ] Product ID extracted from URL params
- [ ] Product data fetched and displayed
- [ ] Breadcrumbs show correct hierarchy
- [ ] Action buttons render properly
- [ ] Loading and error states handled
- [ ] Navigation back to product works

---

## Task 72: Create Variant Attribute Selector

### Overview
Create the AttributeSelector component that allows users to select which product attributes to use for variant generation (e.g., Size, Color, Material). This component provides multi-select functionality for attributes and their values, which feed into the matrix builder for generating variant combinations.

### Dependencies
- Task 71: Create Variant Management Page

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/products/Variants/` directory
   - Create `AttributeSelector.tsx` file
   - Set up component structure

2. **Define component props interface**
   - availableAttributes: Attribute[] (size, color, material, etc.)
   - selectedAttributes: SelectedAttribute[] (selected with values)
   - onAttributeChange: callback function
   - maxAttributes: number (default: 3)

3. **Design attribute selection interface**
   - Dropdown or button group to select attribute type
   - Show available attributes (Size, Color, Material, Style)
   - Display selected attributes with their values

4. **Implement attribute value management**
   - For each selected attribute, show value inputs
   - Support adding multiple values (e.g., S, M, L, XL)
   - Allow removing individual values
   - Validate value uniqueness per attribute

5. **Add predefined value suggestions**
   - For Size: XS, S, M, L, XL, XXL, 3XL
   - For Color: Red, Blue, Green, Black, White, Navy, Gray
   - For Material: Cotton, Polyester, Silk, Linen, Denim
   - Allow custom value entry

6. **Create value input component**
   - Text input with "Add" button
   - Tag/chip display for added values
   - Remove button (X) for each value
   - Keyboard support (Enter to add)

7. **Implement validation**
   - Minimum 1 attribute required
   - Maximum 3 attributes (configurable)
   - Each attribute must have at least 2 values
   - Duplicate value prevention
   - Display validation messages

8. **Add attribute reordering (optional)**
   - Drag handles for reordering attributes
   - Order affects variant display in table
   - Visual feedback during drag

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| availableAttributes | Attribute[] | Yes | List of available attributes |
| selectedAttributes | SelectedAttribute[] | Yes | Currently selected attributes |
| onAttributeChange | (attrs: SelectedAttribute[]) => void | Yes | Change callback |
| maxAttributes | number | No | Max number of attributes (default: 3) |

### Attribute Structure

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique attribute identifier |
| name | string | Display name (Size, Color) |
| type | string | Attribute type |
| values | string[] | Selected values |

### UI Layout

```
┌──────────────────────────────────────────┐
│  Select Attributes                        │
├──────────────────────────────────────────┤
│  ┌────────────────────────────────────┐  │
│  │ Attribute 1: [Size ▼]             │  │
│  │ Values: [S] [M] [L] [XL]          │  │
│  │ Add value: [________] [+ Add]     │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ Attribute 2: [Color ▼]            │  │
│  │ Values: [Red] [Blue] [Black]      │  │
│  │ Add value: [________] [+ Add]     │  │
│  └────────────────────────────────────┘  │
│                                          │
│  [+ Add Another Attribute]               │
│                                          │
│  Combinations: 12 variants will be       │
│  generated (4 sizes × 3 colors)          │
└──────────────────────────────────────────┘
```

### Predefined Values

| Attribute | Common Values |
|-----------|---------------|
| Size | XS, S, M, L, XL, XXL, 3XL, One Size |
| Color | Red, Blue, Green, Black, White, Navy, Gray, Yellow, Pink, Purple |
| Material | Cotton, Polyester, Silk, Linen, Wool, Denim, Leather |
| Style | Regular, Slim, Relaxed, Athletic, Classic |

### Validation Rules

| Rule | Message |
|------|---------|
| Min attributes | "Select at least 1 attribute" |
| Max attributes | "Maximum 3 attributes allowed" |
| Min values | "Each attribute needs at least 2 values" |
| Duplicate value | "This value already exists" |
| Empty value | "Value cannot be empty" |

### Combination Preview

| Size Count | Color Count | Total Combinations |
|------------|-------------|--------------------|
| 4 | 3 | 12 variants |
| 5 | 4 | 20 variants |
| 3 | 2 | 6 variants |

### Expected Outcome
- Interactive attribute selection interface
- Value management with add/remove functionality
- Predefined value suggestions for common attributes
- Real-time combination count preview
- Validation with clear error messages

### Verification Checklist
- [ ] Component file created at correct path
- [ ] Props interface defined with TypeScript
- [ ] Attribute dropdown/selector implemented
- [ ] Value input and display working
- [ ] Add and remove value functionality
- [ ] Predefined values available
- [ ] Validation rules enforced
- [ ] Combination count calculation correct
- [ ] Maximum attribute limit enforced

---

## Task 73: Create Variant Matrix Builder

### Overview
Create the VariantMatrix component that generates all possible variant combinations from selected attributes and their values. This high-complexity component is the core of variant creation, calculating the cartesian product of attribute values (e.g., Size × Color) and allowing users to configure each variant before saving.

### Dependencies
- Task 72: Create Variant Attribute Selector

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/products/Variants/` directory
   - Create `VariantMatrix.tsx` file
   - Set up component with state management

2. **Implement matrix generation algorithm**
   - Accept selected attributes with values as input
   - Calculate cartesian product of all attribute values
   - Generate variant objects for each combination
   - Assign sequential variant names

3. **Create matrix data structure**
   - Generate array of variant objects
   - Each variant has: combination (e.g., "M-Red"), SKU, price, stock
   - Initialize with base product values
   - Assign unique temporary IDs

4. **Design matrix table interface**
   - Column headers: Variant Name, SKU, Price, Stock, Image
   - Rows: Generated variant combinations
   - Editable cells for SKU and Price
   - Checkboxes for variant selection

5. **Implement bulk initialization**
   - "Use base SKU pattern" option
   - "Use base price" option
   - Auto-generate SKUs: BASE-SKU-SIZE-COLOR
   - Apply base price to all variants

6. **Add individual variant editing**
   - Inline editing for SKU field
   - Inline editing for Price field
   - Stock quantity input
   - Image upload per variant (optional)

7. **Create variant preview section**
   - Show total variants generated
   - Display attribute breakdown (e.g., 4 sizes × 3 colors = 12)
   - Warning if large number of variants (>50)
   - Estimated storage requirements

8. **Implement variant filtering**
   - Enable/disable individual variants
   - Filter by attribute value
   - Bulk enable/disable by attribute
   - Show only enabled variants option

9. **Add validation before save**
   - All enabled variants must have unique SKUs
   - All enabled variants must have positive price
   - Warn about missing information
   - Confirm before generating large variant sets

10. **Create save and cancel actions**
    - Save button to commit variants
    - Cancel button to discard
    - Show progress during save
    - Handle API errors gracefully

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| productId | string | Yes | Parent product ID |
| baseProduct | Product | Yes | Base product data |
| selectedAttributes | SelectedAttribute[] | Yes | Attributes for generation |
| onSave | (variants: Variant[]) => Promise<void> | Yes | Save callback |
| onCancel | () => void | Yes | Cancel callback |

### Matrix Generation Logic

```
Input:
  Size: [S, M, L]
  Color: [Red, Blue]

Algorithm (Cartesian Product):
  For each size:
    For each color:
      Create variant {
        name: "size-color",
        sku: "BASE-size-color",
        attributes: { size, color }
      }

Output:
  1. S-Red
  2. S-Blue
  3. M-Red
  4. M-Blue
  5. L-Red
  6. L-Blue
```

### Matrix Table Structure

```
┌─────────────────────────────────────────────────────────┐
│  Generated Variants (6 variants)                         │
├────┬────────────┬─────────────┬────────┬────────┬───────┤
│ ☑  │ Variant    │ SKU         │ Price  │ Stock  │ Action│
├────┼────────────┼─────────────┼────────┼────────┼───────┤
│ ☑  │ S-Red      │ TSH-S-RD    │ 29.99  │ 0      │ 🗑    │
│ ☑  │ S-Blue     │ TSH-S-BL    │ 29.99  │ 0      │ 🗑    │
│ ☑  │ M-Red      │ TSH-M-RD    │ 29.99  │ 0      │ 🗑    │
│ ☑  │ M-Blue     │ TSH-M-BL    │ 29.99  │ 0      │ 🗑    │
│ ☑  │ L-Red      │ TSH-L-RD    │ 29.99  │ 0      │ 🗑    │
│ ☑  │ L-Blue     │ TSH-L-BL    │ 29.99  │ 0      │ 🗑    │
├────┴────────────┴─────────────┴────────┴────────┴───────┤
│  Bulk Actions: [Set Price: $_____] [Apply]              │
│  [☑ Select All] [☐ Deselect All]                       │
└─────────────────────────────────────────────────────────┘
```

### SKU Generation Patterns

| Pattern | Example | Format |
|---------|---------|--------|
| Base + Attributes | TSH-M-RED | {BASE}-{SIZE}-{COLOR} |
| Sequential | TSH-001, TSH-002 | {BASE}-{NUMBER} |
| Attribute Codes | TSH-MD-RD | {BASE}-{SIZE_CODE}-{COLOR_CODE} |

### Bulk Operations

| Operation | Description |
|-----------|-------------|
| Set Base Price | Apply same price to all variants |
| Price Multiplier | Increase/decrease by percentage |
| SKU Pattern | Auto-generate SKUs with pattern |
| Copy Stock | Copy stock from base product |

### Validation Requirements

| Field | Rule | Message |
|-------|------|---------|
| SKU | Unique | "SKU must be unique" |
| SKU | Required | "SKU is required" |
| Price | Positive | "Price must be greater than 0" |
| Stock | Non-negative | "Stock cannot be negative" |

### Performance Considerations

| Scenario | Variant Count | Strategy |
|----------|---------------|----------|
| Small | 1-20 | Render all rows |
| Medium | 21-50 | Virtual scrolling |
| Large | 51+ | Pagination + warning |

### Matrix Preview

```
┌──────────────────────────────────────┐
│  Variant Generation Preview           │
├──────────────────────────────────────┤
│  Attributes Selected:                 │
│  • Size: S, M, L, XL (4 values)      │
│  • Color: Red, Blue, Black (3 values)│
│                                      │
│  Total Combinations: 12 variants     │
│  (4 sizes × 3 colors)                │
│                                      │
│  ⚠ Large variant sets may take       │
│     longer to process                │
└──────────────────────────────────────┘
```

### Expected Outcome
- Functional variant matrix builder
- Automatic generation of all combinations
- Editable matrix table with inline editing
- Bulk operations for efficiency
- Validation before saving
- Performance optimization for large sets

### Verification Checklist
- [ ] Component file created
- [ ] Cartesian product algorithm implemented
- [ ] Matrix table renders correctly
- [ ] Inline editing works for SKU and Price
- [ ] Bulk price setting functional
- [ ] SKU pattern generation working
- [ ] Variant enable/disable toggles
- [ ] Validation prevents invalid data
- [ ] Save commits variants to backend
- [ ] Cancel discards changes
- [ ] Performance tested with 50+ variants

---

## Task 74: Create Variant Table

### Overview
Create the VariantTable component that displays existing product variants in a data table format. This component shows all variant information including attribute combinations, SKU, price, stock levels, and status, with sorting, filtering, and action capabilities.

### Dependencies
- Task 73: Create Variant Matrix Builder
- Data table component from UI library

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/products/Variants/` directory
   - Create `VariantTable.tsx` file
   - Import data table dependencies

2. **Define table columns**
   - Variant Name (combination display)
   - Attribute columns (Size, Color, etc.)
   - SKU (with copy button)
   - Price (formatted currency)
   - Stock Level (with status indicator)
   - Status (Active/Inactive)
   - Actions (Edit, Delete)

3. **Implement variant display**
   - Format variant name from attributes
   - Display attribute values in separate columns
   - Show SKU with clipboard copy functionality
   - Format price with currency symbol

4. **Add stock level indicators**
   - Green: In Stock (stock > 10)
   - Yellow: Low Stock (stock 1-10)
   - Red: Out of Stock (stock = 0)
   - Badge display with count

5. **Create sorting functionality**
   - Sort by variant name alphabetically
   - Sort by price (low to high, high to low)
   - Sort by stock level
   - Sort by SKU

6. **Implement filtering**
   - Filter by attribute values (e.g., only Size: L)
   - Filter by stock status
   - Filter by price range
   - Search by SKU or variant name

7. **Add row selection**
   - Checkbox column for row selection
   - Select all / Deselect all
   - Show selected count
   - Enable bulk actions on selection

8. **Create action menu**
   - Quick edit button (opens inline editor)
   - Delete button (with confirmation)
   - Duplicate variant option
   - View inventory details link

9. **Add pagination**
   - Display 20 variants per page by default
   - Page size options (10, 20, 50, 100)
   - Navigation controls (prev, next)
   - Jump to page input

10. **Implement empty state**
    - Show when no variants exist
    - Call-to-action button to create variants
    - Helpful message explaining variants

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| productId | string | Yes | Parent product ID |
| variants | Variant[] | Yes | Array of variants to display |
| onEdit | (variant: Variant) => void | No | Edit callback |
| onDelete | (variantId: string) => void | No | Delete callback |
| onBulkAction | (action: string, ids: string[]) => void | No | Bulk action callback |
| isLoading | boolean | No | Loading state |

### Table Columns Definition

| Column | Width | Sortable | Filterable |
|--------|-------|----------|------------|
| Checkbox | 50px | No | No |
| Variant | 200px | Yes | Yes |
| Size | 80px | Yes | Yes |
| Color | 100px | Yes | Yes |
| SKU | 150px | Yes | Yes |
| Price | 100px | Yes | Yes |
| Stock | 100px | Yes | Yes |
| Status | 100px | No | Yes |
| Actions | 100px | No | No |

### Table UI Structure

```
┌────────────────────────────────────────────────────────────────┐
│  Variants (12)          [🔍 Search] [Filter ▼] [+ Add Variant] │
├──┬─────────┬──────┬───────┬──────────┬────────┬───────┬────────┤
│☑ │ Variant │ Size │ Color │ SKU      │ Price  │ Stock │ Actions│
├──┼─────────┼──────┼───────┼──────────┼────────┼───────┼────────┤
│☐ │ S-Red   │ S    │ Red   │ TSH-S-RD │ $29.99 │ 15 🟢│ ⋮     │
│☐ │ S-Blue  │ S    │ Blue  │ TSH-S-BL │ $29.99 │ 5 🟡 │ ⋮     │
│☐ │ M-Red   │ M    │ Red   │ TSH-M-RD │ $29.99 │ 0 🔴 │ ⋮     │
│☐ │ M-Blue  │ M    │ Blue  │ TSH-M-BL │ $31.99 │ 20 🟢│ ⋮     │
└──┴─────────┴──────┴───────┴──────────┴────────┴───────┴────────┘
│  Showing 1-10 of 12                     [< 1 2 >]             │
└────────────────────────────────────────────────────────────────┘
```

### Stock Status Indicators

| Status | Color | Condition | Display |
|--------|-------|-----------|---------|
| In Stock | Green | stock > 10 | "15 🟢" |
| Low Stock | Yellow | 1 ≤ stock ≤ 10 | "5 🟡" |
| Out of Stock | Red | stock = 0 | "0 🔴" |

### Variant Display Format

| Attributes | Display Format |
|------------|----------------|
| Size, Color | "M-Red" |
| Size, Color, Material | "M-Red-Cotton" |
| Size only | "Medium" |

### Filter Options

| Filter Type | Options |
|-------------|---------|
| Size | All, S, M, L, XL, XXL |
| Color | All, Red, Blue, Black, etc. |
| Stock Status | All, In Stock, Low Stock, Out of Stock |
| Price Range | Custom min/max |

### Action Menu Items

| Action | Icon | Functionality |
|--------|------|---------------|
| Edit | ✏️ | Open inline editor |
| Duplicate | 📋 | Clone variant |
| Delete | 🗑️ | Delete with confirmation |
| Inventory | 📦 | View stock details |

### Empty State

```
┌──────────────────────────────────────┐
│                                      │
│         📦                           │
│    No Variants Yet                   │
│                                      │
│  Create variants to manage different │
│  sizes, colors, and styles of this   │
│  product.                            │
│                                      │
│      [+ Create Variants]             │
│                                      │
└──────────────────────────────────────┘
```

### Expected Outcome
- Comprehensive data table displaying all variants
- Sortable and filterable columns
- Stock level indicators with visual cues
- Row selection for bulk operations
- Action menu for variant management
- Pagination for large variant sets

### Verification Checklist
- [ ] Component file created
- [ ] All columns render correctly
- [ ] Variant data displays properly
- [ ] Stock indicators show correct colors
- [ ] Sorting works for all sortable columns
- [ ] Filtering reduces displayed rows
- [ ] Row selection and count works
- [ ] Action menu opens and functions
- [ ] Pagination navigates pages
- [ ] Empty state displays when no variants
- [ ] SKU copy functionality works

---

## Task 75: Create Variant Inline Editor

### Overview
Create inline editing functionality for the variant table, allowing users to quickly edit variant fields (SKU, price, stock) directly in the table without opening a separate modal or form. This improves workflow efficiency for managing multiple variants.

### Dependencies
- Task 74: Create Variant Table

### Instructions

1. **Create inline editor component**
   - Create `VariantInlineEditor.tsx` file
   - Support editing within table cells
   - Handle different field types (text, number)

2. **Implement edit mode activation**
   - Double-click cell to enter edit mode
   - Click edit icon in action column
   - Keyboard shortcut (Enter key)
   - Visual indication of editable fields

3. **Create editable field components**
   - Text input for SKU field
   - Number input for Price field
   - Number input for Stock field
   - Dropdown for Status field

4. **Add inline validation**
   - Validate SKU uniqueness on blur
   - Validate price is positive number
   - Validate stock is non-negative integer
   - Show validation errors inline

5. **Implement save on blur**
   - Auto-save when user clicks outside
   - Save on Enter key press
   - Cancel on Escape key press
   - Show saving indicator

6. **Create undo functionality**
   - Revert to original value on Escape
   - Cancel button in edit mode
   - Confirm before discarding changes
   - Toast notification for successful save

7. **Add keyboard navigation**
   - Tab to next editable field
   - Shift+Tab to previous field
   - Arrow keys for navigation (optional)
   - Enter to save and move down

8. **Handle concurrent editing**
   - Lock field during save operation
   - Prevent multiple users editing same field
   - Show "saving" state during API call
   - Refresh row after successful save

9. **Implement batch updates**
   - Track modified fields
   - Send only changed values to API
   - Batch multiple changes together
   - Optimistic UI updates

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| variant | Variant | Yes | Variant being edited |
| field | string | Yes | Field name to edit |
| onSave | (id: string, updates: Partial<Variant>) => Promise<void> | Yes | Save callback |
| onCancel | () => void | No | Cancel callback |

### Editable Fields

| Field | Type | Validation | Format |
|-------|------|------------|--------|
| SKU | text | Required, unique | Plain text |
| Price | number | Positive | Currency (2 decimals) |
| Stock | number | Non-negative integer | Integer |
| Status | select | Required | Active/Inactive |

### Edit Mode UI

```
Normal Mode:
┌──────────────────────────────────┐
│ SKU: TSH-M-RD    [Price: $29.99] │
└──────────────────────────────────┘
              ⬇ Double-click
Edit Mode:
┌──────────────────────────────────┐
│ SKU: [TSH-M-RD___] ✓ ✗          │
│      └─ editable input            │
└──────────────────────────────────┘
```

### Keyboard Controls

| Key | Action |
|-----|--------|
| Enter | Save and exit edit mode |
| Escape | Cancel and revert changes |
| Tab | Save and move to next field |
| Shift+Tab | Save and move to previous field |
| Double-click | Enter edit mode |

### Validation Flow

```
User edits SKU
  ↓
On blur or Enter
  ↓
Validate locally
  ↓
Is valid? ──No──→ Show error, keep in edit mode
  ↓ Yes
Send to API
  ↓
API validates
  ↓
Success? ──No──→ Show error message
  ↓ Yes
Update local state
  ↓
Show success toast
  ↓
Exit edit mode
```

### Visual States

| State | Visual Indicator |
|-------|------------------|
| Normal | Plain text display |
| Hover | Subtle highlight |
| Edit Mode | Input field with border |
| Saving | Loading spinner |
| Error | Red border, error message |
| Success | Green checkmark (brief) |

### Inline Validation Messages

| Field | Error | Message |
|-------|-------|---------|
| SKU | Duplicate | "SKU already exists" |
| SKU | Empty | "SKU is required" |
| Price | Zero/negative | "Price must be greater than 0" |
| Stock | Negative | "Stock cannot be negative" |

### Save Indicators

```
Saving:
┌──────────────────────────┐
│ [TSH-M-RD] ⟳ Saving...  │
└──────────────────────────┘

Success:
┌──────────────────────────┐
│ TSH-M-RD ✓ Saved         │
└──────────────────────────┘

Error:
┌──────────────────────────┐
│ [TSH-M-RD] ✗ Error       │
│ SKU already exists       │
└──────────────────────────┘
```

### Optimistic Updates

| Action | UI Response | On Error |
|--------|-------------|----------|
| Edit SKU | Show new value immediately | Revert to original |
| Edit Price | Update display | Revert and show error |
| Edit Stock | Update count | Revert and show error |

### Expected Outcome
- Seamless inline editing within variant table
- Instant feedback on validation errors
- Keyboard navigation for efficiency
- Auto-save functionality with undo option
- Clear visual states for all interactions

### Verification Checklist
- [ ] Component file created
- [ ] Double-click activates edit mode
- [ ] All editable fields support inline editing
- [ ] Enter key saves changes
- [ ] Escape key cancels editing
- [ ] Tab navigation works
- [ ] Validation shows errors inline
- [ ] Save indicator displays during API call
- [ ] Success toast appears after save
- [ ] Error handling prevents data loss
- [ ] Optimistic updates work correctly

---

## Task 76: Create Variant Bulk Edit

### Overview
Create bulk editing functionality that allows users to apply changes to multiple selected variants simultaneously. This feature significantly improves efficiency when managing large variant sets by enabling operations like price adjustments, stock updates, and status changes across multiple variants at once.

### Dependencies
- Task 74: Create Variant Table (row selection)

### Instructions

1. **Create bulk edit component**
   - Create `VariantBulkEdit.tsx` file
   - Modal or slide-over panel interface
   - Accept selected variant IDs as props

2. **Design bulk edit interface**
   - Show selected variant count
   - List of available bulk operations
   - Input fields for each operation
   - Preview of changes before applying

3. **Implement bulk price operations**
   - Set exact price (e.g., $29.99 for all)
   - Increase by amount (e.g., +$5.00)
   - Increase by percentage (e.g., +10%)
   - Decrease by amount (e.g., -$3.00)
   - Decrease by percentage (e.g., -15%)

4. **Add bulk stock operations**
   - Set exact stock quantity
   - Add to current stock
   - Subtract from current stock
   - Set low stock alert threshold

5. **Create bulk status operations**
   - Set status to Active
   - Set status to Inactive
   - Toggle status for all selected

6. **Implement bulk SKU operations**
   - Add prefix to SKUs
   - Add suffix to SKUs
   - Find and replace in SKUs
   - Regenerate SKUs with pattern

7. **Add preview functionality**
   - Show before/after comparison
   - Calculate new values in real-time
   - Highlight changes in preview table
   - Warning for destructive actions

8. **Create validation before apply**
   - Ensure no duplicate SKUs after changes
   - Validate price remains positive
   - Validate stock remains non-negative
   - Show warnings for potential issues

9. **Implement apply changes**
   - Batch API request for efficiency
   - Progress indicator for large operations
   - Handle partial failures gracefully
   - Show summary of successful/failed updates

10. **Add undo capability**
    - Store original values before changes
    - Undo button available immediately after apply
    - Time-limited undo (30 seconds)
    - Confirmation before undo

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| selectedVariants | Variant[] | Yes | Variants to edit |
| onClose | () => void | Yes | Close modal callback |
| onApply | (updates: BulkUpdate) => Promise<void> | Yes | Apply changes callback |

### Bulk Edit Interface

```
┌────────────────────────────────────────────┐
│  Bulk Edit Variants (12 selected)          │
├────────────────────────────────────────────┤
│  Operation: [Price Update ▼]               │
│                                            │
│  ○ Set Exact Price                         │
│    Price: [$_______]                       │
│                                            │
│  ○ Increase by Amount                      │
│    Amount: [$_______]                      │
│                                            │
│  ○ Increase by Percentage                  │
│    Percentage: [_______]%                  │
│                                            │
│  ○ Decrease by Percentage                  │
│    Percentage: [_______]%                  │
│                                            │
│  Preview:                                  │
│  • S-Red: $29.99 → $32.99                 │
│  • S-Blue: $29.99 → $32.99                │
│  • M-Red: $31.99 → $35.19                 │
│  ... and 9 more                            │
│                                            │
│  [Cancel]  [Apply Changes]                 │
└────────────────────────────────────────────┘
```

### Price Operations

| Operation | Input | Formula | Example |
|-----------|-------|---------|---------|
| Set Exact | $35.00 | new = value | All → $35.00 |
| Add Amount | $5.00 | new = old + value | $30 → $35.00 |
| Add % | 10% | new = old × 1.10 | $30 → $33.00 |
| Subtract Amount | $5.00 | new = old - value | $30 → $25.00 |
| Subtract % | 10% | new = old × 0.90 | $30 → $27.00 |

### Stock Operations

| Operation | Description | Example |
|-----------|-------------|---------|
| Set Quantity | Set all to same value | All → 50 units |
| Add Stock | Increase by amount | +20 units |
| Remove Stock | Decrease by amount | -10 units |
| Set Alert Threshold | Set low stock warning | Alert at 5 units |

### SKU Operations

| Operation | Description | Example |
|-----------|-------------|---------|
| Add Prefix | Prepend text | TSH-M-RD → NEW-TSH-M-RD |
| Add Suffix | Append text | TSH-M-RD → TSH-M-RD-V2 |
| Find/Replace | Replace substring | TSH → SHIRT |
| Regenerate | Apply pattern | Use {BASE}-{SIZE}-{COLOR} |

### Preview Table

```
┌──────────────────────────────────────────┐
│  Preview Changes                          │
├───────────┬──────────┬─────────┬─────────┤
│ Variant   │ Old Price│ New Price│ Change │
├───────────┼──────────┼─────────┼─────────┤
│ S-Red     │ $29.99   │ $32.99  │ +$3.00 │
│ S-Blue    │ $29.99   │ $32.99  │ +$3.00 │
│ M-Red     │ $31.99   │ $35.19  │ +$3.20 │
│ M-Blue    │ $31.99   │ $35.19  │ +$3.20 │
└───────────┴──────────┴─────────┴─────────┘
```

### Validation Warnings

| Condition | Warning Message |
|-----------|-----------------|
| Duplicate SKUs | "⚠ Warning: 2 variants will have duplicate SKUs" |
| Zero/Negative Price | "⚠ Error: Price cannot be zero or negative" |
| Negative Stock | "⚠ Error: Stock cannot be negative" |
| Large Decrease | "⚠ Warning: Prices will decrease by >50%" |

### Progress Indicator

```
Applying changes...
[████████████░░░░░░░░] 60% (12/20)

Updating variant prices...
```

### Result Summary

```
┌────────────────────────────────────┐
│  Bulk Update Complete               │
├────────────────────────────────────┤
│  ✓ Successfully updated: 18         │
│  ✗ Failed: 2                        │
│                                    │
│  Failed variants:                   │
│  • M-Red: Duplicate SKU            │
│  • L-Blue: Invalid price           │
│                                    │
│  [Undo Changes]  [Close]           │
└────────────────────────────────────┘
```

### Expected Outcome
- Functional bulk edit interface
- Multiple operation types supported
- Real-time preview of changes
- Validation before applying
- Progress tracking during updates
- Summary of results with error handling

### Verification Checklist
- [ ] Component file created
- [ ] Bulk edit modal opens with selected variants
- [ ] Price operations work correctly
- [ ] Stock operations functional
- [ ] SKU operations apply correctly
- [ ] Preview shows accurate calculations
- [ ] Validation prevents invalid operations
- [ ] Apply button sends batch updates
- [ ] Progress indicator shows during operation
- [ ] Success/failure summary displays
- [ ] Undo functionality works (if implemented)

---

## Task 77: Create Variant Delete Action

### Overview
Create the delete functionality for product variants, including single variant deletion and bulk deletion. Implement proper confirmation dialogs to prevent accidental deletions and handle cascade effects (e.g., deleting a variant with existing inventory or orders).

### Dependencies
- Task 74: Create Variant Table

### Instructions

1. **Create delete dialog component**
   - Create `DeleteVariantDialog.tsx` file
   - Modal dialog with confirmation
   - Accept variant data as props

2. **Design single variant delete flow**
   - Delete button in variant table actions
   - Click opens confirmation dialog
   - Show variant details in confirmation
   - Require explicit confirmation

3. **Implement bulk delete flow**
   - Bulk delete button when variants selected
   - Show count of selected variants
   - List variants to be deleted (if < 10)
   - Stronger warning for multiple deletions

4. **Add warning checks**
   - Check if variant has inventory
   - Check if variant appears in orders
   - Check if variant has images/assets
   - Display warnings in confirmation dialog

5. **Create confirmation dialog content**
   - Clear heading: "Delete Variant?"
   - Variant information display
   - List of consequences (inventory loss, etc.)
   - Checkbox: "I understand this cannot be undone"
   - Delete and Cancel buttons

6. **Implement soft delete option**
   - Option to deactivate instead of delete
   - Preserve data for reporting
   - Clear indication of deactivated status
   - Ability to restore later

7. **Handle delete operation**
   - Send delete request to API
   - Show loading state during deletion
   - Handle API errors gracefully
   - Remove from local state on success

8. **Add success/error feedback**
   - Success toast: "Variant deleted successfully"
   - Error toast: "Failed to delete variant"
   - Refresh variant list after deletion
   - Scroll to top of table

9. **Implement undo delete (optional)**
   - Store deleted variant data temporarily
   - Show undo toast for 10 seconds
   - Restore variant if undo clicked
   - Clear undo data after timeout

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| variant | Variant \| null | No | Single variant to delete |
| variantIds | string[] | No | Multiple variants to delete |
| isOpen | boolean | Yes | Dialog open state |
| onClose | () => void | Yes | Close dialog callback |
| onConfirm | (ids: string[]) => Promise<void> | Yes | Delete confirmation callback |

### Single Delete Dialog

```
┌─────────────────────────────────────┐
│  Delete Variant?                     │
├─────────────────────────────────────┤
│                                     │
│  Variant: M-Red                     │
│  SKU: TSH-M-RD                      │
│  Stock: 15 units                    │
│                                     │
│  ⚠ This variant has inventory. All  │
│    stock records will be deleted.   │
│                                     │
│  ☐ I understand this action cannot  │
│     be undone                        │
│                                     │
│  [Cancel]  [Delete Variant]         │
└─────────────────────────────────────┘
```

### Bulk Delete Dialog

```
┌─────────────────────────────────────┐
│  Delete Multiple Variants?           │
├─────────────────────────────────────┤
│                                     │
│  You are about to delete 12 variants│
│                                     │
│  Selected variants:                  │
│  • S-Red                            │
│  • S-Blue                           │
│  • M-Red                            │
│  • M-Blue                           │
│  ... and 8 more                     │
│                                     │
│  ⚠ Warning: 8 variants have existing│
│    inventory that will be deleted.  │
│                                     │
│  ☑ I understand this action cannot  │
│     be undone                        │
│                                     │
│  [Cancel]  [Delete All]             │
└─────────────────────────────────────┘
```

### Warning Conditions

| Condition | Warning Message |
|-----------|-----------------|
| Has Inventory | "⚠ This variant has inventory that will be deleted" |
| In Orders | "⚠ This variant appears in {count} orders" |
| Has Images | "⚠ Associated images will also be deleted" |
| Last Variant | "⚠ This is the last variant for this product" |

### Soft Delete Option

```
┌─────────────────────────────────────┐
│  Instead of deleting, you can:       │
│                                     │
│  ○ Delete permanently                │
│  ● Deactivate (recommended)          │
│                                     │
│  Deactivated variants are hidden    │
│  but can be restored later.         │
└─────────────────────────────────────┘
```

### Delete Confirmation Checkbox

| State | Enabled | Label |
|-------|---------|-------|
| Unchecked | No | "☐ I understand this cannot be undone" |
| Checked | Yes | "☑ I understand this cannot be undone" |

### Delete Operation Flow

```
User clicks Delete
  ↓
Open confirmation dialog
  ↓
Show variant info + warnings
  ↓
User checks confirmation ──No──→ Delete disabled
  ↓ Yes
User clicks Delete button
  ↓
Show loading state
  ↓
Send API request
  ↓
Success? ──No──→ Show error toast
  ↓ Yes
Remove from local state
  ↓
Show success toast
  ↓
Refresh variant list
  ↓
Close dialog
```

### Success Toast

```
┌───────────────────────────────┐
│ ✓ Variant deleted successfully │
│   [Undo]                       │
└───────────────────────────────┘
```

### Error Handling

| Error Type | Message |
|------------|---------|
| Network Error | "Unable to delete variant. Check connection." |
| Permission Error | "You don't have permission to delete variants" |
| Validation Error | "Cannot delete variant: {reason}" |
| Server Error | "Server error occurred. Please try again." |

### Undo Delete

```
Delete initiated
  ↓
Show success toast with Undo button
  ↓
10-second countdown
  ↓
User clicks Undo? ──No──→ Permanent deletion
  ↓ Yes
Cancel deletion
  ↓
Restore variant
  ↓
Show "Deletion cancelled" toast
```

### Expected Outcome
- Functional delete action for single and bulk variants
- Clear confirmation dialogs with warnings
- Proper error handling and user feedback
- Optional soft delete for data preservation
- Undo functionality for accidental deletions

### Verification Checklist
- [ ] Delete dialog component created
- [ ] Single delete button triggers dialog
- [ ] Bulk delete button works with selection
- [ ] Dialog shows variant information
- [ ] Warnings display for inventory/orders
- [ ] Confirmation checkbox required
- [ ] Delete button disabled until checked
- [ ] API call made on confirmation
- [ ] Success toast shows after deletion
- [ ] Error toast shows on failure
- [ ] Variant removed from table after delete
- [ ] Undo functionality works (if implemented)
- [ ] Soft delete option available (if implemented)

---

## Summary

This document established the complete variant management interface, including the variant management page, attribute selection, matrix generation for creating variants, variant table display, inline editing, bulk editing operations, and deletion functionality. These components enable efficient management of product variants with multiple attribute combinations.

### Completed Tasks
1. ✓ Created variant management page at `/products/[id]/variants`
2. ✓ Created attribute selector for choosing variant attributes
3. ✓ Created matrix builder for generating variant combinations
4. ✓ Created variant table with comprehensive display
5. ✓ Created inline editor for quick edits
6. ✓ Created bulk edit functionality for efficiency
7. ✓ Created delete action with confirmation

### Next Steps
Proceed to [02_Tasks-78-86_Category-Management.md](02_Tasks-78-86_Category-Management.md) to create the category management interface with tree view, category CRUD operations, and category assignment functionality.

