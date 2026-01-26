# Tasks 78-86: Category Management

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 08 - Product Management UI  
> **Group:** E - Variant & Category Management  
> **Document:** 02 of 02  
> **Tasks Covered:** 78, 79, 80, 81, 82, 83, 84, 85, 86

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-71-77_Variant-Management.md](01_Tasks-71-77_Variant-Management.md)

---

## Document Overview

This document covers the complete category management interface, including hierarchical category trees, CRUD operations, slug generation, parent-child relationships, image uploads, and safe deletion handling. It establishes a robust system for organizing products into categories with full support for nested hierarchies.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 78 | Create Category List Page | Medium | 30 min |
| 79 | Create Category Tree View | Medium | 45 min |
| 80 | Create Category Form | Medium | 40 min |
| 81 | Create Category Name Input | Low | 20 min |
| 82 | Create Parent Category Select | Medium | 35 min |
| 83 | Create Category Image Upload | Low | 25 min |
| 84 | Create Category Create Page | Low | 20 min |
| 85 | Create Category Edit Page | Low | 20 min |
| 86 | Create Category Delete Dialog | Low | 30 min |

---

## Task 78: Create Category List Page

### Overview
Create the main category listing page that displays all categories in both list and tree views. The page provides navigation to create new categories, edit existing ones, and delete categories. It serves as the central hub for category management with filtering, search, and action buttons.

### Dependencies
- Task 14: Create Product List Page (for pattern reference)
- SubPhase-05 (Form Components & Validation)
- SubPhase-03 (Layout & Navigation)

### Instructions

1. **Create the page file**
   - Navigate to `frontend/app/(dashboard)/products/categories/` directory
   - Create new file named `page.tsx`
   - Set up as Next.js server component with metadata

2. **Configure page metadata**
   - Set page title to "Product Categories | LankaCommerce Cloud"
   - Add description for SEO
   - Configure Open Graph tags if needed

3. **Define page layout structure**
   - Create header section with page title and breadcrumbs
   - Add "Create Category" button in top-right corner
   - Include search/filter toolbar below header
   - Add main content area for category display

4. **Implement search and filter toolbar**
   - Add search input for category name filtering
   - Include filter for root categories only
   - Add toggle between tree view and flat list view
   - Include filter for categories with/without products

5. **Create action buttons section**
   - Place "New Category" button with icon
   - Add export button for category data
   - Include bulk action dropdown if multiple selected

6. **Set up data fetching**
   - Fetch categories from API endpoint
   - Include parent-child relationships
   - Load product counts per category
   - Handle loading and error states

7. **Implement view toggle**
   - Default to tree view (Task 79)
   - Allow switch to flat list view
   - Persist user preference in localStorage
   - Maintain filter state across views

8. **Add empty state**
   - Display when no categories exist
   - Show helpful message and create button
   - Include illustration or icon

### Page Layout Structure

```
┌──────────────────────────────────────────────────────┐
│ Breadcrumb: Products > Categories                    │
├──────────────────────────────────────────────────────┤
│                                                       │
│ Product Categories              [+ New Category]     │
│                                                       │
│ ┌─────────────────┐  ┌──────────┐  ┌──────────┐    │
│ │ 🔍 Search...    │  │ View: 🌲 │  │ Filter ▼ │    │
│ └─────────────────┘  └──────────┘  └──────────┘    │
│                                                       │
│ ┌──────────────────────────────────────────────┐    │
│ │                                              │    │
│ │        Category Tree View (Task 79)         │    │
│ │                                              │    │
│ └──────────────────────────────────────────────┘    │
│                                                       │
└──────────────────────────────────────────────────────┘
```

### Page Sections

| Section | Component | Purpose |
|---------|-----------|---------|
| Header | PageHeader | Title, breadcrumb, actions |
| Toolbar | SearchFilter | Search, filter, view toggle |
| Content | CategoryTree | Tree or list display |
| Empty | EmptyState | No categories message |

### URL Structure

| URL | Description |
|-----|-------------|
| `/products/categories` | Category list (this page) |
| `/products/categories/new` | Create new category |
| `/products/categories/[id]` | Edit existing category |

### Filter Options

| Filter | Options | Behavior |
|--------|---------|----------|
| Search | Text input | Filter by name, slug |
| Level | Root only, All | Show hierarchy depth |
| Status | Active, All | Filter by status |
| Products | With products, Empty | Filter by usage |

### Expected Outcome
- Functional category listing page with proper routing
- Search and filter capabilities
- View toggle between tree and list
- Navigation to create/edit pages
- Empty state for new tenants

### Verification Checklist
- [ ] Page file created at correct path
- [ ] Metadata configured properly
- [ ] Header with title and breadcrumbs
- [ ] "New Category" button navigates correctly
- [ ] Search functionality works
- [ ] Filter options function properly
- [ ] View toggle persists preference
- [ ] Empty state displays when needed
- [ ] Data fetches from API successfully

---

## Task 79: Create Category Tree View

### Overview
Build an interactive hierarchical tree view component that displays categories with parent-child relationships. The tree supports expanding/collapsing nodes, displays product counts, shows category depth with indentation, and provides quick actions (edit, delete) for each category. This is the primary visualization method for category hierarchy.

### Dependencies
- Task 78: Create Category List Page

### Instructions

1. **Create the tree component file**
   - Navigate to `frontend/components/modules/products/Categories/` directory
   - Create new file named `CategoryTree.tsx`
   - Set up as client component with "use client" directive

2. **Define component props interface**
   - Accept categories array with nested children
   - Include onEdit callback function
   - Include onDelete callback function
   - Add expandedByDefault boolean option

3. **Design tree node structure**
   - Each node displays category name
   - Show product count badge
   - Include expand/collapse toggle for parents
   - Add action buttons (edit, delete)

4. **Implement recursive rendering**
   - Create recursive function to render children
   - Use proper indentation for depth levels
   - Apply different styling for different levels
   - Handle unlimited nesting depth

5. **Add expand/collapse functionality**
   - Track expanded nodes in component state
   - Show chevron icon (right=collapsed, down=expanded)
   - Toggle on icon or name click
   - Persist expansion state optionally

6. **Style the tree hierarchy**
   - Use indentation (padding-left) for depth
   - Apply border or lines to show relationships
   - Different background for alternate levels
   - Highlight on hover

7. **Add interactive features**
   - Click category name to view details
   - Click edit icon to navigate to edit page
   - Click delete icon to open delete dialog
   - Drag-and-drop for reordering (optional)

8. **Implement loading and empty states**
   - Show skeleton while loading
   - Display message for empty categories
   - Handle error states gracefully

### Tree Structure Example

```
Electronics (45)                          [Edit] [Delete]
├─ Computers (20)                         [Edit] [Delete]
│  ├─ Laptops (12)                        [Edit] [Delete]
│  └─ Desktops (8)                        [Edit] [Delete]
├─ Mobile Phones (15)                     [Edit] [Delete]
│  ├─ Smartphones (10)                    [Edit] [Delete]
│  └─ Feature Phones (5)                  [Edit] [Delete]
└─ Accessories (10)                       [Edit] [Delete]

Clothing (78)                             [Edit] [Delete]
├─ Men (35)                               [Edit] [Delete]
│  ├─ Shirts (15)                         [Edit] [Delete]
│  ├─ Pants (12)                          [Edit] [Delete]
│  └─ Shoes (8)                           [Edit] [Delete]
└─ Women (43)                             [Edit] [Delete]
   ├─ Dresses (20)                        [Edit] [Delete]
   └─ Tops (23)                           [Edit] [Delete]
```

### Tree Node Components

| Element | Content | Position |
|---------|---------|----------|
| Toggle | Chevron icon | Left |
| Name | Category name | Center-left |
| Badge | Product count | Center-right |
| Actions | Edit, Delete buttons | Right |

### Indentation System

| Level | Padding | Visual |
|-------|---------|--------|
| 0 (Root) | pl-0 | No indent |
| 1 | pl-6 | One level |
| 2 | pl-12 | Two levels |
| 3 | pl-18 | Three levels |
| 4+ | pl-24 | Max indent |

### Component Props

```typescript
interface CategoryTreeProps {
  categories: CategoryWithChildren[]
  onEdit: (categoryId: string) => void
  onDelete: (categoryId: string) => void
  expandedByDefault?: boolean
  maxDepth?: number
}

interface CategoryWithChildren {
  id: string
  name: string
  slug: string
  productCount: number
  children?: CategoryWithChildren[]
}
```

### Tree Node States

| State | Visual | Behavior |
|-------|--------|----------|
| Collapsed | ▶ | Show chevron right |
| Expanded | ▼ | Show chevron down |
| No Children | • | Show bullet point |
| Loading | ⟳ | Show spinner |

### Interactive Features

| Action | Trigger | Result |
|--------|---------|--------|
| Expand | Click chevron/name | Show children |
| Collapse | Click chevron/name | Hide children |
| Edit | Click edit icon | Navigate to edit page |
| Delete | Click delete icon | Open delete dialog |
| Select | Click checkbox | Bulk operations |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Keyboard Nav | Arrow keys, Enter, Space |
| ARIA | role="tree", aria-expanded |
| Focus | Visible focus indicators |
| Screen Reader | Announce level and state |

### Expected Outcome
- Interactive hierarchical tree view
- Expandable/collapsible nodes
- Visual hierarchy with indentation
- Product count badges
- Edit and delete actions per node
- Smooth animations for expand/collapse

### Verification Checklist
- [ ] Component file created
- [ ] Props interface defined
- [ ] Recursive rendering works
- [ ] Expand/collapse functionality
- [ ] Proper indentation for levels
- [ ] Product counts display correctly
- [ ] Edit button navigates properly
- [ ] Delete button triggers dialog
- [ ] Hover states work
- [ ] Keyboard navigation functional
- [ ] Empty state displays

---

## Task 80: Create Category Form

### Overview
Build a comprehensive form component for creating and editing categories. The form includes fields for category name (with slug generation), parent category selection, description, image upload, status, and metadata. It handles validation, submission, and error states, serving as the core data entry interface for category management.

### Dependencies
- Task 78: Create Category List Page
- SubPhase-05 (Form Components & Validation)

### Instructions

1. **Create the form component file**
   - Navigate to `frontend/components/modules/products/Categories/` directory
   - Create new file named `CategoryForm.tsx`
   - Set up as client component with form handling

2. **Set up React Hook Form**
   - Initialize useForm with validation schema
   - Define form fields and default values
   - Set up Zod schema for validation
   - Configure error handling

3. **Define form structure**
   - Organize fields into logical sections
   - Basic Info: Name, Slug, Parent
   - Details: Description, Image
   - Settings: Status, SEO fields
   - Actions: Save, Cancel buttons

4. **Integrate form field components**
   - Use CategoryNameInput (Task 81) for name/slug
   - Use ParentCategorySelect (Task 82) for parent
   - Use CategoryImageUpload (Task 83) for image
   - Use FormTextarea for description

5. **Implement form validation**
   - Required fields: name
   - Unique slug validation
   - Parent validation (cannot be self)
   - Image size and type validation

6. **Handle form submission**
   - Collect all form data
   - Format data for API
   - Submit to create or update endpoint
   - Handle success and error responses

7. **Add loading states**
   - Disable form during submission
   - Show loading spinner on submit button
   - Prevent duplicate submissions
   - Show processing indicators

8. **Implement error display**
   - Show field-level validation errors
   - Display server-side errors
   - Highlight invalid fields
   - Provide clear error messages

### Form Structure

```
┌────────────────────────────────────────────┐
│ Category Form                              │
├────────────────────────────────────────────┤
│                                            │
│ Basic Information                          │
│ ┌────────────────────────────────────┐   │
│ │ Name: [________________] *         │   │
│ │ Slug: clothing-accessories         │   │
│ └────────────────────────────────────┘   │
│                                            │
│ ┌────────────────────────────────────┐   │
│ │ Parent: [Select category... ▼]    │   │
│ └────────────────────────────────────┘   │
│                                            │
│ Description                                │
│ ┌────────────────────────────────────┐   │
│ │                                    │   │
│ │  [Textarea...]                     │   │
│ │                                    │   │
│ └────────────────────────────────────┘   │
│                                            │
│ Category Image                             │
│ ┌────────────────────────────────────┐   │
│ │  [Upload Image]  [Preview]         │   │
│ └────────────────────────────────────┘   │
│                                            │
│ Settings                                   │
│ ┌────────────────────────────────────┐   │
│ │ Status: ○ Active  ○ Inactive       │   │
│ └────────────────────────────────────┘   │
│                                            │
│         [Cancel]  [Save Category]          │
└────────────────────────────────────────────┘
```

### Form Sections

| Section | Fields | Description |
|---------|--------|-------------|
| Basic Info | Name, Slug, Parent | Core identification |
| Details | Description, Image | Content and media |
| Settings | Status, Display Order | Configuration |
| SEO | Meta Title, Description | Search optimization |

### Form Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Name | Text | Yes | Min 2, Max 100 chars |
| Slug | Text | Yes | Unique, URL-safe |
| Parent | Select | No | Valid category ID |
| Description | Textarea | No | Max 500 chars |
| Image | File | No | Max 2MB, jpg/png |
| Status | Radio | Yes | Active/Inactive |

### Validation Schema

```typescript
interface CategoryFormData {
  name: string
  slug: string
  parentId: string | null
  description: string
  imageUrl: string | null
  status: 'active' | 'inactive'
  displayOrder: number
  metaTitle?: string
  metaDescription?: string
}
```

### Form States

| State | Behavior | Visual |
|-------|----------|--------|
| Initial | Empty or with data | Normal fields |
| Dirty | User modified | Unsaved indicator |
| Submitting | Processing | Disabled, spinner |
| Error | Validation failed | Red borders, messages |
| Success | Saved successfully | Redirect or toast |

### Error Messages

| Error | Message |
|-------|---------|
| Name Required | "Category name is required" |
| Slug Taken | "This URL slug is already in use" |
| Parent Invalid | "Cannot select this category as parent" |
| Image Too Large | "Image must be smaller than 2MB" |
| Server Error | "Failed to save category. Please try again" |

### Component Props

```typescript
interface CategoryFormProps {
  initialData?: CategoryFormData
  mode: 'create' | 'edit'
  onSubmit: (data: CategoryFormData) => Promise<void>
  onCancel: () => void
  categories?: Category[]  // For parent select
}
```

### Expected Outcome
- Fully functional category form
- All fields properly integrated
- Validation working correctly
- Submission handling with feedback
- Error display for all field types
- Loading states during submission

### Verification Checklist
- [ ] Form component created
- [ ] React Hook Form configured
- [ ] All fields render correctly
- [ ] Name and slug fields integrated (Task 81)
- [ ] Parent select integrated (Task 82)
- [ ] Image upload integrated (Task 83)
- [ ] Validation schema working
- [ ] Submit handler functional
- [ ] Error messages display
- [ ] Loading states work
- [ ] Cancel button functions
- [ ] Form resets after submission

---

## Task 81: Create Category Name Input

### Overview
Create a specialized input component for category names that automatically generates URL-friendly slugs in real-time. The component provides both name and slug fields, allows manual slug editing with validation, shows slug preview, and ensures URL-safe formatting. This enhances user experience by automating slug creation while maintaining flexibility.

### Dependencies
- Task 80: Create Category Form

### Instructions

1. **Create the component file**
   - Navigate to `frontend/components/modules/products/Categories/` directory
   - Create file named `CategoryNameInput.tsx` or integrate into form
   - Set up as controlled component with state

2. **Design component structure**
   - Primary input field for category name
   - Secondary field for slug (auto-generated)
   - Toggle or lock icon to enable manual editing
   - Preview URL display

3. **Implement auto-slug generation**
   - Convert name to lowercase
   - Replace spaces with hyphens
   - Remove special characters
   - Transliterate non-ASCII characters
   - Update slug in real-time as user types

4. **Add manual slug editing**
   - Initially lock slug field
   - Provide unlock/edit button
   - Once unlocked, allow manual editing
   - Continue validating for URL-safe format

5. **Implement slug validation**
   - Only allow lowercase letters, numbers, hyphens
   - No consecutive hyphens
   - No leading or trailing hyphens
   - Check uniqueness against existing slugs
   - Show validation status (valid/invalid)

6. **Create slug formatting functions**
   - Create utility function for slug generation
   - Handle edge cases (empty, special chars)
   - Ensure consistent formatting
   - Prevent duplicate processing

7. **Add visual feedback**
   - Show preview URL: `/products/category/your-slug`
   - Display character count
   - Show validation status icon
   - Indicate when auto-generation is active

8. **Integrate with parent form**
   - Accept name and slug as props
   - Call onChange callbacks for both fields
   - Integrate with React Hook Form
   - Handle validation errors from parent

### Component Layout

```
┌──────────────────────────────────────────┐
│ Category Name *                          │
│ ┌──────────────────────────────────┐   │
│ │ Clothing & Accessories           │   │
│ └──────────────────────────────────┘   │
│                                          │
│ URL Slug                          [🔓]  │
│ ┌──────────────────────────────────┐   │
│ │ clothing-accessories         ✓   │   │
│ └──────────────────────────────────┘   │
│                                          │
│ Preview: /products/category/clothing-... │
└──────────────────────────────────────────┘
```

### Slug Generation Rules

| Input | Auto-Generated Slug |
|-------|---------------------|
| "Men's Clothing" | men-s-clothing |
| "T-Shirts & Tops" | t-shirts-tops |
| "Electronics / Phones" | electronics-phones |
| "  Shoes   " | shoes |
| "Size 42" | size-42 |

### Slug Character Rules

| Allowed | Not Allowed |
|---------|-------------|
| a-z | A-Z (convert to lowercase) |
| 0-9 | Spaces (convert to hyphen) |
| - (hyphen) | Special chars (remove) |
| | Consecutive hyphens |
| | Leading/trailing hyphens |

### Slug Generation Algorithm

```
Step 1: Convert to lowercase
"Men's Clothing" → "men's clothing"

Step 2: Replace spaces with hyphens
"men's clothing" → "men's-clothing"

Step 3: Remove special characters
"men's-clothing" → "mens-clothing"

Step 4: Remove consecutive hyphens
"mens--clothing" → "mens-clothing"

Step 5: Trim leading/trailing hyphens
"-mens-clothing-" → "mens-clothing"
```

### Component States

| State | Name Field | Slug Field | Lock Icon |
|-------|------------|------------|-----------|
| Initial | Empty | Empty | Locked |
| Auto | Typing | Auto-updating | Locked |
| Manual | Any | User editing | Unlocked |
| Locked | Any | Read-only | Locked |

### Validation Rules

| Rule | Check | Error Message |
|------|-------|---------------|
| Required | Not empty | "Slug is required" |
| Format | Matches pattern | "Use only lowercase, numbers, hyphens" |
| Unique | Not in database | "This slug is already in use" |
| Length | 2-100 chars | "Slug must be 2-100 characters" |

### Component Props

```typescript
interface CategoryNameInputProps {
  name: string
  slug: string
  onNameChange: (name: string) => void
  onSlugChange: (slug: string) => void
  existingSlugs?: string[]
  error?: string
}
```

### Real-time Behavior

| User Action | Name Field | Slug Field | Sync |
|-------------|------------|------------|------|
| Types name | Updates | Auto-updates | Yes |
| Unlocks slug | No change | Editable | No |
| Edits slug | No change | Updates | No |
| Locks slug | No change | Syncs again | Yes |

### Expected Outcome
- Name input with real-time slug generation
- Editable slug field with lock/unlock
- URL-safe slug validation
- Preview URL display
- Clear visual feedback

### Verification Checklist
- [ ] Component created and integrated
- [ ] Name input updates correctly
- [ ] Slug auto-generates from name
- [ ] Lock/unlock functionality works
- [ ] Manual slug editing allowed when unlocked
- [ ] Slug validation rules enforced
- [ ] Special characters removed
- [ ] Preview URL displays correctly
- [ ] Unique slug checking works
- [ ] Error messages display properly
- [ ] Integration with form successful

---

## Task 82: Create Parent Category Select

### Overview
Build a hierarchical dropdown selector for choosing a parent category. The component displays categories in a tree structure within a dropdown, shows the full path for nested categories, prevents circular references (selecting self or descendants), and provides search functionality. This enables users to organize categories into logical hierarchies.

### Dependencies
- Task 80: Create Category Form
- Task 79: Create Category Tree View (for tree display logic)

### Instructions

1. **Create the component file**
   - Navigate to `frontend/components/modules/products/Categories/` directory
   - Create file named `ParentCategorySelect.tsx`
   - Set up as controlled component

2. **Design dropdown structure**
   - Use select element or custom dropdown
   - Display categories in hierarchical format
   - Show indentation for nested levels
   - Include "No Parent (Root Level)" option

3. **Implement hierarchical display**
   - Indent child categories with visual markers
   - Show full path: "Electronics > Computers > Laptops"
   - Or indent with symbols: "— — Laptops"
   - Sort by name within each level

4. **Add circular reference prevention**
   - Disable current category (when editing)
   - Disable all descendant categories
   - Show disabled state with explanation
   - Only enable valid parent options

5. **Implement search functionality**
   - Add search input at top of dropdown
   - Filter categories by name
   - Maintain hierarchy in results
   - Show "No results" message

6. **Handle selection**
   - Update parent value on selection
   - Clear selection with "None" option
   - Show selected category path
   - Trigger onChange callback

7. **Add visual hierarchy indicators**
   - Use indentation (padding or margin)
   - Add prefix symbols (├─, └─)
   - Different colors for depth levels
   - Show nesting with connecting lines

8. **Implement loading and error states**
   - Show loading spinner while fetching
   - Display error message if fetch fails
   - Handle empty categories gracefully

### Dropdown Display Format

```
┌────────────────────────────────────┐
│ Parent Category                ▼  │
├────────────────────────────────────┤
│ (None - Root Level)               │
│ Electronics                        │
│ ├─ Computers               [disabled]
│ │  ├─ Laptops                     │
│ │  └─ Desktops                    │
│ ├─ Mobile Phones                  │
│ └─ Accessories                     │
│ Clothing                           │
│ ├─ Men                            │
│ │  ├─ Shirts                      │
│ │  └─ Pants                       │
│ └─ Women                          │
│    ├─ Dresses                     │
│    └─ Tops                        │
└────────────────────────────────────┘
```

### Category Display Options

| Style | Example | Use Case |
|-------|---------|----------|
| Indented | "— — Laptops" | Simple hierarchy |
| Full Path | "Electronics > Computers > Laptops" | Clarity |
| Tree Symbols | "├─ Laptops" | Visual hierarchy |
| Combination | "— — Electronics > Laptops" | Balance |

### Circular Reference Prevention

```
Current Category: "Computers"

Valid Parents:
✓ (None - Root)
✓ Electronics (sibling)
✓ Clothing (unrelated)

Invalid Parents:
✗ Computers (self)
✗ Laptops (child)
✗ Desktops (child)
```

### Disabled State Logic

| Condition | Reason | Visual |
|-----------|--------|--------|
| Self | Cannot be own parent | Grayed + tooltip |
| Descendant | Creates circular ref | Grayed + tooltip |
| Deleted | No longer exists | Hidden |

### Search Functionality

| Search Query | Results |
|--------------|---------|
| "lap" | Laptops (under Electronics > Computers) |
| "men" | Men (under Clothing), Women (under Clothing) |
| "elect" | Electronics (root), all children |
| "" (empty) | All categories |

### Component Props

```typescript
interface ParentCategorySelectProps {
  value: string | null
  onChange: (categoryId: string | null) => void
  currentCategoryId?: string  // When editing
  categories: Category[]
  disabled?: boolean
  error?: string
}

interface Category {
  id: string
  name: string
  parentId: string | null
  children?: Category[]
}
```

### Selection Behavior

| Action | Result |
|--------|--------|
| Select category | Set as parent |
| Select "None" | Clear parent (root level) |
| Select disabled | No action, show tooltip |
| Clear selection | Same as "None" |

### Hierarchy Display Algorithm

```
Function: renderCategoryOption(category, depth)
  1. Calculate indentation: depth * 16px
  2. Add prefix: "├─ " or "└─ "
  3. Check if disabled (self or descendant)
  4. Render option with styling
  5. Recursively render children with depth + 1
```

### Expected Outcome
- Hierarchical category dropdown
- Clear visual hierarchy with indentation
- Circular reference prevention
- Search functionality
- Proper disabled states with tooltips
- Integration with form validation

### Verification Checklist
- [ ] Component created
- [ ] Categories display hierarchically
- [ ] Indentation shows depth correctly
- [ ] "None" option available for root level
- [ ] Current category disabled when editing
- [ ] Descendant categories disabled
- [ ] Search filters categories
- [ ] Selection updates form value
- [ ] onChange callback fires
- [ ] Error messages display
- [ ] Tooltip explains disabled options
- [ ] Integration with form successful

---

## Task 83: Create Category Image Upload

### Overview
Build an image upload component specifically for category images. The component supports drag-and-drop, file selection, image preview, cropping, size validation, and displays the uploaded image. It integrates with the category form and handles both new uploads and existing images, providing a seamless media management experience.

### Dependencies
- Task 80: Create Category Form
- SubPhase-10 (File Storage Configuration from Phase 03)

### Instructions

1. **Create the component file**
   - Navigate to `frontend/components/modules/products/Categories/` directory
   - Create file named `CategoryImageUpload.tsx`
   - Set up as client component with state

2. **Design upload interface**
   - Create dropzone area for drag-and-drop
   - Add "Choose File" button
   - Show image preview when uploaded
   - Display file name and size

3. **Implement drag-and-drop**
   - Add drag event listeners
   - Show visual feedback on drag over
   - Accept image files only
   - Handle multiple file drops (use first)

4. **Add file selection**
   - Create hidden file input
   - Trigger on button click
   - Filter to image types (jpg, png, webp)
   - Limit file size (recommended 2MB)

5. **Implement image preview**
   - Show thumbnail after upload
   - Display image dimensions
   - Show file size
   - Add remove/replace button

6. **Add image validation**
   - Check file type (image/jpeg, image/png, etc.)
   - Validate file size (max 2MB recommended)
   - Check dimensions (min 200x200px recommended)
   - Show validation errors clearly

7. **Implement upload to server**
   - Use FormData for file upload
   - Upload to file storage endpoint
   - Get back image URL
   - Handle upload progress
   - Show upload status

8. **Handle existing images**
   - Display existing image URL
   - Allow replacement
   - Confirm before removing
   - Keep aspect ratio

### Upload Interface Layout

```
┌────────────────────────────────────────┐
│ Category Image                         │
│                                        │
│ No Image:                              │
│ ┌────────────────────────────────────┐│
│ │                                    ││
│ │    📁 Drag image here              ││
│ │       or                           ││
│ │    [Choose File]                   ││
│ │                                    ││
│ │    Max 2MB, JPG/PNG                ││
│ │                                    ││
│ └────────────────────────────────────┘│
│                                        │
│ With Image:                            │
│ ┌────────────────────────────────────┐│
│ │  ┌─────────┐                       ││
│ │  │         │  category-img.jpg     ││
│ │  │ [IMG]   │  245 KB               ││
│ │  │         │  800x600               ││
│ │  └─────────┘                       ││
│ │           [Replace] [Remove]       ││
│ └────────────────────────────────────┘│
└────────────────────────────────────────┘
```

### File Upload States

| State | Visual | Description |
|-------|--------|-------------|
| Empty | Dropzone | No image uploaded |
| Dragging | Highlighted | User dragging file |
| Uploading | Progress bar | File uploading |
| Preview | Thumbnail | Image uploaded |
| Error | Error message | Upload failed |

### Image Specifications

| Specification | Requirement |
|---------------|-------------|
| File Types | JPG, PNG, WebP, SVG |
| Max Size | 2 MB (configurable) |
| Min Dimensions | 200x200 px (recommended) |
| Max Dimensions | 2000x2000 px (recommended) |
| Aspect Ratio | Any (square preferred) |

### Validation Rules

| Rule | Check | Error Message |
|------|-------|---------------|
| File Type | MIME type | "Please upload a valid image (JPG, PNG)" |
| File Size | < 2MB | "Image must be smaller than 2MB" |
| Dimensions | Min 200x200 | "Image must be at least 200x200 pixels" |
| Format | Valid image | "Invalid image file" |

### Component Props

```typescript
interface CategoryImageUploadProps {
  value: string | null  // Image URL
  onChange: (imageUrl: string | null) => void
  error?: string
  disabled?: boolean
  maxSizeMB?: number
  acceptedTypes?: string[]
}
```

### Upload Flow

```
1. User selects/drops file
         ↓
2. Validate file type and size
         ↓
3. Create preview (FileReader)
         ↓
4. Upload to server (FormData)
         ↓
5. Receive image URL
         ↓
6. Update form with URL
         ↓
7. Display preview
```

### Drag-and-Drop Events

| Event | Action |
|-------|--------|
| dragenter | Show highlight |
| dragover | Maintain highlight |
| dragleave | Remove highlight |
| drop | Process file |

### Image Preview Display

| Element | Content |
|---------|---------|
| Thumbnail | 150x150px preview |
| Filename | "category-electronics.jpg" |
| Size | "1.2 MB" |
| Dimensions | "800x600 px" |
| Actions | Replace, Remove buttons |

### Upload Progress

| Progress | Display |
|----------|---------|
| 0% | "Preparing..." |
| 1-99% | Progress bar with % |
| 100% | "Processing..." |
| Complete | Show preview |
| Error | Error message |

### Expected Outcome
- Functional image upload component
- Drag-and-drop support
- File validation working
- Image preview display
- Upload progress indication
- Integration with category form
- Remove/replace functionality

### Verification Checklist
- [ ] Component created
- [ ] Dropzone renders correctly
- [ ] Drag-and-drop works
- [ ] File input button functional
- [ ] File type validation works
- [ ] File size validation works
- [ ] Image preview displays
- [ ] Upload to server successful
- [ ] Progress indicator shows
- [ ] Image URL stored in form
- [ ] Replace button works
- [ ] Remove button works
- [ ] Error messages display
- [ ] Integration with form complete

---

## Task 84: Create Category Create Page

### Overview
Create the dedicated page for adding new categories. This page integrates the CategoryForm component (Task 80) with proper page structure, metadata, breadcrumbs, and navigation. It handles form submission, success/error feedback, and redirects to the appropriate page after successful creation.

### Dependencies
- Task 80: Create Category Form
- Task 78: Create Category List Page

### Instructions

1. **Create the page file**
   - Navigate to `frontend/app/(dashboard)/products/categories/new/` directory
   - Create new file named `page.tsx`
   - Set up as Next.js page with metadata

2. **Configure page metadata**
   - Set title to "Create Category | LankaCommerce Cloud"
   - Add description for SEO
   - Configure breadcrumb data

3. **Design page layout**
   - Add page header with title "Create Category"
   - Include breadcrumb: Products > Categories > Create
   - Place form in centered container
   - Add back button to return to category list

4. **Integrate CategoryForm component**
   - Import and render CategoryForm
   - Pass mode="create"
   - Provide onSubmit handler
   - Provide onCancel handler

5. **Implement form submission handler**
   - Collect form data from CategoryForm
   - Send POST request to API endpoint
   - Handle loading state
   - Process success and error responses

6. **Handle success scenario**
   - Show success toast notification
   - Redirect to category list page
   - Or redirect to edit page of created category
   - Clear form state

7. **Handle error scenario**
   - Display error message/toast
   - Keep form data intact
   - Highlight specific field errors
   - Allow user to retry

8. **Add navigation options**
   - Back button to category list
   - Cancel button in form
   - Save and continue editing option (optional)

### Page Layout

```
┌──────────────────────────────────────────┐
│ ← Products > Categories > Create        │
├──────────────────────────────────────────┤
│                                          │
│  Create Category                         │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │                                    │ │
│  │      CategoryForm Component       │ │
│  │      (From Task 80)               │ │
│  │                                    │ │
│  └────────────────────────────────────┘ │
│                                          │
└──────────────────────────────────────────┘
```

### Page Sections

| Section | Content | Purpose |
|---------|---------|---------|
| Breadcrumb | Navigation path | User orientation |
| Header | Page title, back button | Page identification |
| Form | CategoryForm component | Data entry |
| Actions | Save, Cancel buttons | Form submission |

### API Integration

| Action | Method | Endpoint | Body |
|--------|--------|----------|------|
| Create | POST | `/api/categories` | Category data |
| Validate | GET | `/api/categories/validate-slug?slug=...` | Query param |
| Upload Image | POST | `/api/upload` | FormData |

### Form Submission Flow

```
1. User fills form
         ↓
2. User clicks "Save Category"
         ↓
3. Validate form data
         ↓
4. Submit to API
         ↓
5. If success:
   - Show success toast
   - Redirect to list/edit page
         ↓
6. If error:
   - Show error message
   - Keep form data
   - Allow retry
```

### Success Redirect Options

| Option | Destination | Use Case |
|--------|-------------|----------|
| List | `/products/categories` | Default behavior |
| Edit | `/products/categories/[id]` | Continue editing |
| Create Another | Same page, clear form | Bulk creation |

### Error Handling

| Error Type | Handling |
|------------|----------|
| Validation | Show field errors |
| Duplicate Slug | Highlight slug field |
| Network | Show retry button |
| Server Error | Show generic message |

### URL Structure

| URL | Description |
|-----|-------------|
| `/products/categories/new` | Create category page (this page) |
| `/products/categories` | List page (after success) |
| `/products/categories/[id]` | Edit page (optional redirect) |

### Component Structure

```typescript
// Page Component
export default async function CreateCategoryPage() {
  // Fetch categories for parent select
  const categories = await fetchCategories()
  
  return (
    <div>
      <Breadcrumb items={...} />
      <PageHeader title="Create Category" />
      
      <CategoryForm
        mode="create"
        categories={categories}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  )
}
```

### Expected Outcome
- Functional category creation page
- CategoryForm integrated properly
- Form submission to API working
- Success feedback and redirect
- Error handling with clear messages
- Navigation back to list page

### Verification Checklist
- [ ] Page file created at correct path
- [ ] Metadata configured
- [ ] Breadcrumb displays correctly
- [ ] Page title shows "Create Category"
- [ ] CategoryForm renders
- [ ] Form fields all functional
- [ ] Submit sends to correct API endpoint
- [ ] Success shows toast and redirects
- [ ] Error displays appropriately
- [ ] Cancel button returns to list
- [ ] Back button works
- [ ] Page accessible at `/products/categories/new`

---

## Task 85: Create Category Edit Page

### Overview
Create the page for editing existing categories. This dynamic page loads category data based on the URL parameter, populates the CategoryForm with existing values, handles updates, and provides options to delete the category. It includes breadcrumbs showing the category name and proper navigation throughout the editing process.

### Dependencies
- Task 80: Create Category Form
- Task 78: Create Category List Page
- Task 84: Create Category Create Page

### Instructions

1. **Create the dynamic page file**
   - Navigate to `frontend/app/(dashboard)/products/categories/[id]/` directory
   - Create new file named `page.tsx`
   - Set up as dynamic route with id parameter

2. **Fetch category data**
   - Extract category ID from page params
   - Fetch category details from API
   - Fetch all categories for parent select
   - Handle category not found (404)

3. **Configure page metadata**
   - Set title to "Edit: [Category Name] | LankaCommerce Cloud"
   - Use category name in title
   - Generate metadata dynamically

4. **Design page layout**
   - Add breadcrumb with category name
   - Display page title "Edit Category"
   - Show category name as subtitle
   - Add delete button in header

5. **Integrate CategoryForm component**
   - Import and render CategoryForm
   - Pass mode="edit"
   - Populate initialData with fetched category
   - Provide onSubmit handler

6. **Implement update handler**
   - Collect updated form data
   - Send PUT/PATCH request to API
   - Handle loading state
   - Process success and error responses

7. **Add delete functionality**
   - Place delete button in header
   - Open delete confirmation dialog (Task 86)
   - Handle delete success
   - Redirect after deletion

8. **Handle loading and error states**
   - Show loading skeleton while fetching
   - Display 404 page if category not found
   - Show error message if fetch fails

### Page Layout

```
┌──────────────────────────────────────────┐
│ ← Products > Categories > Electronics   │
├──────────────────────────────────────────┤
│                                          │
│  Edit Category         [Delete Category] │
│  Electronics                             │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │                                    │ │
│  │   CategoryForm with Initial Data  │ │
│  │                                    │ │
│  │   Name: Electronics               │ │
│  │   Slug: electronics               │ │
│  │   Parent: (None)                  │ │
│  │   Description: ...                │ │
│  │   Image: [preview]                │ │
│  │                                    │ │
│  │   [Cancel] [Update Category]      │ │
│  │                                    │ │
│  └────────────────────────────────────┘ │
│                                          │
└──────────────────────────────────────────┘
```

### Page Sections

| Section | Content | Purpose |
|---------|---------|---------|
| Breadcrumb | Path with category name | Navigation context |
| Header | Title, subtitle, delete button | Page actions |
| Form | Pre-populated CategoryForm | Edit data |
| Actions | Update, Cancel, Delete | Form submission |

### Data Fetching

| Data | Endpoint | Purpose |
|------|----------|---------|
| Category | `/api/categories/[id]` | Load existing data |
| All Categories | `/api/categories` | Parent select options |
| Children Count | Included in response | Delete validation |

### API Integration

| Action | Method | Endpoint | Body |
|--------|--------|----------|------|
| Fetch | GET | `/api/categories/[id]` | None |
| Update | PUT | `/api/categories/[id]` | Updated data |
| Delete | DELETE | `/api/categories/[id]` | None |

### Update Flow

```
1. Page loads with category ID
         ↓
2. Fetch category data
         ↓
3. Populate form with data
         ↓
4. User modifies fields
         ↓
5. User clicks "Update"
         ↓
6. Send PUT request
         ↓
7. If success:
   - Show success toast
   - Reload data or redirect
         ↓
8. If error:
   - Show error message
   - Keep form data
```

### URL Structure

| URL | Description |
|-----|-------------|
| `/products/categories/[id]` | Edit page (this page) |
| `/products/categories` | List page (after delete) |
| `/products/categories/new` | Create page |

### Error Scenarios

| Error | Handling |
|-------|----------|
| Category Not Found | Show 404 page |
| Fetch Failed | Show error with retry |
| Update Failed | Show toast, keep form |
| Delete Failed | Show error in dialog |

### Parent Selection Validation

```
Current Category: "Computers" (id: 123)
Children: ["Laptops", "Desktops"]

Cannot Select:
✗ Computers (self)
✗ Laptops (descendant)
✗ Desktops (descendant)

Can Select:
✓ (None - Root)
✓ Electronics (current parent)
✓ Mobile Phones (sibling)
```

### Component Structure

```typescript
// Page Component
export default async function EditCategoryPage({
  params
}: {
  params: { id: string }
}) {
  // Fetch category
  const category = await fetchCategory(params.id)
  const allCategories = await fetchCategories()
  
  if (!category) {
    notFound()
  }
  
  return (
    <div>
      <Breadcrumb items={...} />
      <PageHeader 
        title="Edit Category"
        subtitle={category.name}
        actions={<DeleteButton />}
      />
      
      <CategoryForm
        mode="edit"
        initialData={category}
        categories={allCategories}
        onSubmit={handleUpdate}
        onCancel={handleCancel}
      />
    </div>
  )
}
```

### Expected Outcome
- Functional category edit page
- Dynamic routing with category ID
- Form pre-populated with existing data
- Update functionality working
- Delete button integrated
- Proper error handling

### Verification Checklist
- [ ] Dynamic page file created
- [ ] Category ID extracted from params
- [ ] Category data fetched successfully
- [ ] Form populated with initial data
- [ ] All fields editable
- [ ] Update submits to correct endpoint
- [ ] Success shows toast and updates data
- [ ] Delete button opens dialog (Task 86)
- [ ] 404 handling for invalid ID
- [ ] Cancel returns to list
- [ ] Breadcrumb shows category name
- [ ] Page accessible at `/products/categories/[id]`

---

## Task 86: Create Category Delete Dialog

### Overview
Build a confirmation dialog for deleting categories that handles various scenarios: categories with products, categories with child categories, and empty categories. The dialog provides clear warnings, options for handling related data (move products, move children), and prevents accidental deletions through confirmation requirements.

### Dependencies
- Task 78: Create Category List Page
- Task 85: Create Category Edit Page

### Instructions

1. **Create the dialog component file**
   - Navigate to `frontend/components/modules/products/Categories/` directory
   - Create file named `DeleteCategoryDialog.tsx`
   - Set up as controlled dialog component

2. **Design dialog structure**
   - Title: "Delete Category?"
   - Category name display
   - Warning message based on status
   - Action options
   - Cancel and Confirm buttons

3. **Implement status checking**
   - Check if category has products
   - Check if category has child categories
   - Show different messages for each case
   - Allow deletion only if safe or confirmed

4. **Handle categories with products**
   - Show warning: "X products in this category"
   - Provide options:
     - Move products to another category
     - Move products to parent category
     - Delete products (if allowed)
   - Require explicit selection

5. **Handle categories with children**
   - Show warning: "X child categories"
   - Provide options:
     - Move children to parent (flatten)
     - Delete children recursively (dangerous)
     - Cancel operation
   - Require explicit confirmation

6. **Add confirmation input (optional but recommended)**
   - Require typing category name to confirm
   - Or require checking "I understand" checkbox
   - Particularly for categories with children

7. **Implement delete action**
   - Collect selected options
   - Send DELETE request to API with options
   - Show loading state during deletion
   - Handle success and error

8. **Handle success and error**
   - On success: Close dialog, show toast, refresh list
   - On error: Show error message, keep dialog open
   - Allow retry on error

### Dialog Layouts

**Empty Category (Safe Delete)**
```
┌────────────────────────────────────┐
│ Delete Category?                   │
├────────────────────────────────────┤
│                                    │
│ Category: Electronics              │
│                                    │
│ ⚠️  This action cannot be undone.  │
│                                    │
│ This category has no products or   │
│ child categories.                  │
│                                    │
│        [Cancel]  [Delete]          │
└────────────────────────────────────┘
```

**Category with Products**
```
┌────────────────────────────────────┐
│ Delete Category?                   │
├────────────────────────────────────┤
│                                    │
│ Category: Electronics              │
│                                    │
│ ⚠️  This category has 45 products. │
│                                    │
│ What should happen to products?    │
│ ○ Move to parent category          │
│ ○ Move to different category       │
│   [Select category ▼]              │
│ ○ Remove category (keep products)  │
│                                    │
│        [Cancel]  [Delete]          │
└────────────────────────────────────┘
```

**Category with Children**
```
┌────────────────────────────────────┐
│ Delete Category?                   │
├────────────────────────────────────┤
│                                    │
│ Category: Electronics              │
│                                    │
│ ⚠️  This category has 3 children:  │
│    • Computers                     │
│    • Mobile Phones                 │
│    • Accessories                   │
│                                    │
│ What should happen to children?    │
│ ○ Move to parent (flatten)         │
│ ○ Delete all recursively ⚠️        │
│                                    │
│ [ ] I understand this will delete  │
│     all child categories           │
│                                    │
│        [Cancel]  [Delete]          │
└────────────────────────────────────┘
```

### Dialog States

| State | Condition | Actions |
|-------|-----------|---------|
| Safe | No products, no children | Simple confirm |
| Has Products | Product count > 0 | Select move option |
| Has Children | Child count > 0 | Select child handling |
| Complex | Both products and children | Handle both |

### Product Handling Options

| Option | Action | Safety |
|--------|--------|--------|
| Move to Parent | Reassign to parent category | Safe |
| Move to Other | Select target category | Safe |
| Keep Uncategorized | Remove category reference | Safe |
| Delete Products | Delete all products | Dangerous |

### Children Handling Options

| Option | Action | Safety |
|--------|--------|--------|
| Move to Parent | Flatten hierarchy | Safe |
| Delete Recursively | Delete all descendants | Dangerous |
| Cancel | Abort deletion | Safe |

### Confirmation Requirements

| Category Type | Confirmation Method |
|---------------|---------------------|
| Empty | Simple confirm button |
| With Products | Select option + confirm |
| With Children | Select option + checkbox + confirm |
| Both | Both options + checkbox + confirm |

### API Request Structure

```typescript
DELETE /api/categories/[id]

Body:
{
  moveProductsTo?: string | null,  // Target category ID or null
  handleChildren?: 'move' | 'delete',
  confirmed: boolean
}
```

### Component Props

```typescript
interface DeleteCategoryDialogProps {
  isOpen: boolean
  onClose: () => void
  category: {
    id: string
    name: string
    productCount: number
    childCount: number
    children?: string[]
  }
  onSuccess: () => void
}
```

### Deletion Flow

```
1. User clicks Delete button
         ↓
2. Check category status
         ↓
3. Show appropriate dialog
         ↓
4. User selects options (if needed)
         ↓
5. User confirms
         ↓
6. Send DELETE request with options
         ↓
7. If success:
   - Close dialog
   - Show success toast
   - Refresh list
   - Redirect if on edit page
         ↓
8. If error:
   - Show error message
   - Keep dialog open
   - Allow retry
```

### Warning Messages

| Condition | Message |
|-----------|---------|
| Has Products | "⚠️ This category contains {count} products" |
| Has Children | "⚠️ This category has {count} child categories" |
| Has Both | "⚠️ This category has {products} products and {children} children" |
| Cannot Delete | "❌ Cannot delete. Remove products and children first" |

### Error Scenarios

| Error | Message | Action |
|-------|---------|--------|
| Has Products | Not allowed if no option selected | Show error |
| Has Children | Not allowed without handling | Show error |
| In Use | Referenced elsewhere | Show details |
| Network Error | Request failed | Allow retry |

### Expected Outcome
- Functional delete confirmation dialog
- Different warnings based on status
- Options for handling related data
- Safe deletion with confirmation
- Success/error feedback
- Integration with list and edit pages

### Verification Checklist
- [ ] Dialog component created
- [ ] Opens from edit page and list page
- [ ] Displays category name correctly
- [ ] Checks for products correctly
- [ ] Checks for children correctly
- [ ] Shows appropriate warnings
- [ ] Product handling options work
- [ ] Children handling options work
- [ ] Confirmation checkbox required when needed
- [ ] Delete button disabled until valid
- [ ] DELETE request sent correctly
- [ ] Success closes dialog and refreshes
- [ ] Error displays in dialog
- [ ] Cancel button works
- [ ] Integration with both pages complete

---

## Summary

This document established the complete category management system, including hierarchical category organization, CRUD operations, intelligent slug generation, parent-child relationships, image uploads, and safe deletion with data handling. These components provide a robust foundation for organizing products into logical hierarchies.

### Completed Tasks
1. ✓ Created category list page with search and filters
2. ✓ Created interactive category tree view with expand/collapse
3. ✓ Created comprehensive category form with validation
4. ✓ Created name input with auto-slug generation
5. ✓ Created hierarchical parent category selector
6. ✓ Created category image upload with drag-and-drop
7. ✓ Created category create page
8. ✓ Created category edit page with pre-populated data
9. ✓ Created delete dialog with safe handling of products and children

### Key Features Delivered
- **Hierarchical Organization:** Tree view with unlimited nesting
- **Smart Slug Generation:** Auto-generate URL-safe slugs from names
- **Circular Reference Prevention:** Cannot select self or descendants as parent
- **Image Management:** Upload, preview, and replace category images
- **Safe Deletion:** Handle products and children before deleting
- **Search & Filter:** Find categories quickly in large hierarchies

### Next Steps
Proceed to the next group (Group F) for Import/Export and Testing functionality to complete the Product Management UI SubPhase.
