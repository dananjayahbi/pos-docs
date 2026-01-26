# Tasks 46-54: Categorization, Media & Submit

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 08 - Product Management UI  
> **Group:** C - Product Form & Creation  
> **Document:** 02 of 02  
> **Tasks Covered:** 46, 47, 48, 49, 50, 51, 52, 53, 54

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-35-45_Form-Schema-Sections.md](01_Tasks-35-45_Form-Schema-Sections.md)

---

## Document Overview

This document covers the completion of the product creation form by implementing categorization features, media/image management, form submission logic, and the final create product page. It builds upon the form schema and main sections created in Document 01, adding hierarchical category selection, tag input with autocomplete, drag-and-drop image upload with preview and management, API integration for form submission, and the complete page assembly.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 46 | Create Categorization Section | Medium | 30 min |
| 47 | Create Category Multi-Select | Medium | 40 min |
| 48 | Create Tags Input | Medium | 35 min |
| 49 | Create Media Section | Medium | 25 min |
| 50 | Create Image Upload Zone | Medium | 45 min |
| 51 | Create Image Preview Grid | Medium | 35 min |
| 52 | Create Image Delete Action | Low | 20 min |
| 53 | Create Form Submit Handler | Medium | 40 min |
| 54 | Create Create Product Page | Low | 25 min |

---

## Task 46: Create Categorization Section

### Overview
Create the CategorizationSection component that provides product classification through categories and tags. This section includes fields for selecting multiple categories from a hierarchical structure and adding tags for improved searchability and organization. The section integrates with the ProductForm component and uses React Hook Form for state management.

### Dependencies
- Task 36: Create Product Form Component
- Task 47: Create Category Multi-Select (parallel)
- Task 48: Create Tags Input (parallel)

### Instructions

1. **Create component file structure**
   - Navigate to `frontend/components/modules/products/ProductForm/` directory
   - Create new file named `CategorizationSection.tsx`
   - Set up React functional component with TypeScript

2. **Import required dependencies**
   - Import React and React Hook Form utilities
   - Import CategoryMultiSelect component (Task 47)
   - Import TagsInput component (Task 48)
   - Import UI components (Label, FormField, FormItem)

3. **Define section component structure**
   - Accept form control as prop
   - Create section container with proper styling
   - Add section heading and description

4. **Implement category field integration**
   - Use FormField with control from props
   - Set field name to "category_ids"
   - Render CategoryMultiSelect component
   - Display validation errors below field

5. **Implement tags field integration**
   - Use FormField with control from props
   - Set field name to "tags"
   - Render TagsInput component
   - Display validation errors below field

6. **Add section layout styling**
   - Apply consistent spacing with other sections
   - Use grid or flex layout for field arrangement
   - Ensure responsive design for mobile devices

7. **Add help text and guidance**
   - Provide description for category selection
   - Explain tag usage and benefits
   - Include examples or placeholders

### Section Structure

```
┌─────────────────────────────────────────┐
│ Categorization                          │
│ ─────────────────────────────────────── │
│                                         │
│ Categories *                            │
│ ┌─────────────────────────────────┐   │
│ │ CategoryMultiSelect Component   │   │
│ │ (Hierarchical dropdown)         │   │
│ └─────────────────────────────────┘   │
│ Select categories for this product     │
│                                         │
│ Tags                                    │
│ ┌─────────────────────────────────┐   │
│ │ TagsInput Component             │   │
│ │ (Chip input with autocomplete)  │   │
│ └─────────────────────────────────┘   │
│ Add tags for better searchability      │
└─────────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| control | Control<ProductFormValues> | Yes | React Hook Form control |
| isLoading | boolean | No | Disable inputs during submission |

### Field Specifications

| Field Name | Type | Validation | Default |
|------------|------|------------|---------|
| category_ids | string[] | Optional, must be valid UUIDs | [] |
| tags | string[] | Optional, max 20 tags | [] |

### Categorization Guidelines

| Aspect | Recommendation |
|--------|----------------|
| Category Selection | Choose most specific applicable categories |
| Multiple Categories | Select 1-3 relevant categories |
| Tag Count | Use 3-10 descriptive tags |
| Tag Format | Lowercase, hyphen-separated |

### Expected Outcome
- Functional categorization section component
- Integrated with React Hook Form
- Category and tag fields with validation
- Clear labels and help text
- Responsive layout

### Verification Checklist
- [ ] Component file created in ProductForm directory
- [ ] Imports React Hook Form utilities correctly
- [ ] Accepts control prop from parent form
- [ ] Renders CategoryMultiSelect component
- [ ] Renders TagsInput component
- [ ] Displays validation errors appropriately
- [ ] Section heading and description present
- [ ] Responsive design implemented
- [ ] Component exports properly

---

## Task 47: Create Category Multi-Select

### Overview
Create the CategoryMultiSelect component that allows users to select multiple product categories from a hierarchical tree structure. This component fetches categories from the API, displays them in an expandable tree view with parent-child relationships, supports multiple selection with checkboxes, includes search/filter functionality, and integrates seamlessly with React Hook Form.

### Dependencies
- Task 46: Create Categorization Section

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/products/ProductForm/` directory
   - Create `CategoryMultiSelect.tsx` file
   - Set up TypeScript React functional component

2. **Import required dependencies**
   - Import React hooks (useState, useEffect, useMemo)
   - Import UI components (Popover, Command, Checkbox)
   - Import icons (ChevronRight, ChevronDown, Check)
   - Import category API hooks (useGetCategories)

3. **Define component props interface**
   - Value prop (string[] of category IDs)
   - OnChange callback for selection updates
   - Optional disabled prop
   - Optional placeholder prop

4. **Fetch categories from API**
   - Use useGetCategories hook to fetch category list
   - Handle loading and error states
   - Transform flat list to hierarchical structure

5. **Build hierarchical tree structure**
   - Create helper function to nest categories
   - Identify parent-child relationships
   - Sort categories alphabetically within levels
   - Maintain tree structure in component state

6. **Implement category tree rendering**
   - Create recursive component for tree nodes
   - Display parent categories with expand/collapse icons
   - Indent child categories for hierarchy visualization
   - Show checkboxes for selection

7. **Implement selection logic**
   - Track selected category IDs in state
   - Update selection on checkbox click
   - Support multi-select (add/remove from array)
   - Call onChange callback with updated selection

8. **Add search/filter functionality**
   - Create search input field in popover
   - Filter categories by name in real-time
   - Show filtered results with breadcrumb path
   - Clear search resets to full tree view

9. **Implement popover trigger**
   - Create trigger button showing selected count
   - Display selected category names (truncated if many)
   - Show placeholder when no selection
   - Add dropdown icon indicator

10. **Add keyboard navigation**
    - Support arrow keys for tree navigation
    - Enter key to toggle selection
    - Escape key to close popover
    - Tab navigation support

11. **Handle validation display**
    - Accept error prop for validation errors
    - Display error message below component
    - Apply error styling to trigger button

### Hierarchical Structure Example

```
Categories
├── Electronics
│   ├── Computers
│   │   ├── Laptops
│   │   └── Desktops
│   └── Mobile Phones
├── Clothing
│   ├── Men's Wear
│   └── Women's Wear
└── Home & Garden
    ├── Furniture
    └── Kitchen Appliances
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| value | string[] | Yes | - | Selected category IDs |
| onChange | (value: string[]) => void | Yes | - | Selection change handler |
| disabled | boolean | No | false | Disable interactions |
| placeholder | string | No | "Select categories..." | Placeholder text |
| error | string | No | undefined | Validation error message |

### Tree Node Structure

| Property | Description |
|----------|-------------|
| id | Unique category UUID |
| name | Display name |
| parent_id | Parent category ID (null for root) |
| children | Array of child categories |
| level | Depth in hierarchy (0 = root) |

### Selection Display

```
No Selection:
┌───────────────────────────────┐
│ Select categories...      ▼  │
└───────────────────────────────┘

Single Selection:
┌───────────────────────────────┐
│ Electronics               ▼  │
└───────────────────────────────┘

Multiple Selections:
┌───────────────────────────────┐
│ 3 categories selected     ▼  │
└───────────────────────────────┘
```

### Popover Content Layout

```
┌────────────────────────────────┐
│ Search: [____________]     [x] │
├────────────────────────────────┤
│ ☐ Electronics            [>]  │
│   ☑ Computers            [v]  │
│     ☐ Laptops                 │
│     ☑ Desktops                │
│   ☐ Mobile Phones             │
│ ☐ Clothing               [>]  │
│ ☐ Home & Garden          [>]  │
└────────────────────────────────┘
```

### Search Functionality

| Feature | Implementation |
|---------|----------------|
| Real-time | Filter on keystroke |
| Case-insensitive | Convert to lowercase for comparison |
| Partial match | Match anywhere in category name |
| Breadcrumb | Show parent path for results |

### API Integration

| Endpoint | Method | Response |
|----------|--------|----------|
| `/api/categories/` | GET | Array of category objects |
| Parameters | - | tenant_id (automatic) |
| Caching | Yes | React Query cache |

### Expected Outcome
- Functional hierarchical category selector
- Multiple category selection support
- Search and filter capabilities
- Visual hierarchy with expand/collapse
- Integration with React Hook Form

### Verification Checklist
- [ ] Component file created
- [ ] Fetches categories from API successfully
- [ ] Builds hierarchical tree structure
- [ ] Renders tree with proper indentation
- [ ] Expand/collapse functionality works
- [ ] Multiple selection with checkboxes works
- [ ] Search/filter functionality implemented
- [ ] Selected categories display correctly
- [ ] onChange callback fires on selection change
- [ ] Keyboard navigation supported
- [ ] Error state displays properly
- [ ] Disabled state works correctly
- [ ] Component exports properly

---

## Task 48: Create Tags Input

### Overview
Create the TagsInput component that allows users to add, remove, and manage product tags. This component provides autocomplete suggestions from existing tags, supports free-text entry for new tags, displays tags as removable chips/badges, validates tag format (lowercase, hyphen-separated), and limits the number of tags. The component integrates with React Hook Form and enhances product discoverability through flexible tagging.

### Dependencies
- Task 46: Create Categorization Section

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/ui/` directory
   - Create `TagsInput.tsx` file (reusable UI component)
   - Set up TypeScript React functional component

2. **Import required dependencies**
   - Import React hooks (useState, useRef)
   - Import UI components (Input, Badge, Command)
   - Import icons (X, Plus, Tag)
   - Import tag API hooks (useGetTags, useCreateTag)

3. **Define component props interface**
   - Value prop (string[] of tags)
   - OnChange callback for tag updates
   - Optional maxTags prop (default 20)
   - Optional placeholder prop
   - Optional disabled prop

4. **Set up component state**
   - Input value state for current typing
   - Suggestions state for autocomplete
   - Focus state for input styling
   - Error state for validation messages

5. **Fetch existing tags for autocomplete**
   - Use useGetTags hook to fetch tag list
   - Filter suggestions based on input value
   - Exclude already selected tags from suggestions
   - Display top 10 matching suggestions

6. **Implement tag input field**
   - Create input element for typing new tags
   - Show placeholder when no tags present
   - Auto-focus on container click
   - Clear input after tag addition

7. **Implement tag addition logic**
   - Trigger on Enter key or comma input
   - Trim whitespace and convert to lowercase
   - Replace spaces with hyphens
   - Validate tag format (alphanumeric and hyphens)
   - Check maximum tag limit
   - Prevent duplicate tags
   - Call onChange with updated tag array

8. **Render tag chips/badges**
   - Display each tag as a Badge component
   - Show remove button (X icon) on each badge
   - Apply tag styling (colored background)
   - Arrange tags in flex wrap layout

9. **Implement tag removal**
   - Add click handler to remove button
   - Remove tag from array on click
   - Call onChange with updated array
   - Maintain input focus after removal

10. **Add autocomplete dropdown**
    - Show suggestions dropdown when input is focused
    - Display matching tags from API
    - Click suggestion to add tag
    - Hide dropdown when no matches or input empty

11. **Implement tag validation**
    - Validate length (2-30 characters)
    - Allow only lowercase letters, numbers, hyphens
    - No leading/trailing hyphens
    - Show error message for invalid tags

12. **Add keyboard navigation**
    - Arrow keys to navigate suggestions
    - Enter to select suggestion or add new tag
    - Backspace on empty input removes last tag
    - Escape to close suggestions dropdown

### Component Structure

```
┌─────────────────────────────────────────┐
│ ┌──────┐ ┌──────┐ ┌──────┐            │
│ │ tag1 │ │ tag2 │ │ tag3 │  [_____]   │
│ └───x──┘ └───x──┘ └───x──┘            │
│                                         │
│ ┌─── Suggestions ───────────────────┐ │
│ │ electronics                        │ │
│ │ electronic-accessories             │ │
│ │ electronic-gadgets                 │ │
│ └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| value | string[] | Yes | - | Array of current tags |
| onChange | (value: string[]) => void | Yes | - | Change handler |
| maxTags | number | No | 20 | Maximum tag limit |
| placeholder | string | No | "Add tags..." | Input placeholder |
| disabled | boolean | No | false | Disable interactions |
| error | string | No | undefined | Validation error |

### Tag Format Rules

| Rule | Description | Example |
|------|-------------|---------|
| Lowercase | All characters lowercase | "electronics" ✓ |
| Hyphen separator | Replace spaces with hyphens | "phone-case" ✓ |
| No special chars | Only letters, numbers, hyphens | "4k-tv" ✓ |
| Length | 2-30 characters | "a" ✗, "tv" ✓ |
| No duplicates | Each tag must be unique | - |

### Tag Input Behavior

| User Action | System Response |
|-------------|-----------------|
| Type "Phone Case" + Enter | Add tag "phone-case" |
| Type "electronics," | Add tag "electronics" |
| Press Backspace (empty input) | Remove last tag |
| Click suggestion | Add suggested tag |
| Exceed maxTags | Show error message |
| Duplicate tag | Ignore, show error |

### Autocomplete Logic

```
User types: "elec"
     ↓
Query existing tags
     ↓
Filter matches:
- electronics
- electronic-accessories
- electronic-devices
     ↓
Display top 10
     ↓
User selects → Add to tags
```

### Tag Badge Display

```
┌──────────────┐
│ electronics  │ × 
└──────────────┘
     ↑        ↑
   Tag text  Remove
```

### Validation Messages

| Scenario | Error Message |
|----------|---------------|
| Too short | "Tag must be at least 2 characters" |
| Too long | "Tag must be less than 30 characters" |
| Invalid chars | "Tag can only contain letters, numbers, and hyphens" |
| Duplicate | "This tag already exists" |
| Max limit | "Maximum 20 tags allowed" |

### Expected Outcome
- Functional tag input with autocomplete
- Tag chips with remove functionality
- Validation for tag format
- Maximum tag limit enforcement
- Integration with React Hook Form

### Verification Checklist
- [ ] Component file created in ui directory
- [ ] Accepts value and onChange props
- [ ] Fetches existing tags for autocomplete
- [ ] Displays autocomplete suggestions
- [ ] Adds tag on Enter or comma
- [ ] Formats tags correctly (lowercase, hyphens)
- [ ] Displays tags as removable badges
- [ ] Removes tags on click
- [ ] Validates tag format
- [ ] Enforces maximum tag limit
- [ ] Prevents duplicate tags
- [ ] Keyboard navigation works
- [ ] Backspace removes last tag
- [ ] Error messages display correctly
- [ ] Component exports properly

---

## Task 49: Create Media Section

### Overview
Create the MediaSection component that serves as the container for product image management. This section includes the image upload zone, image preview grid, and image management controls. It provides a clear interface for users to add, view, reorder, and delete product images, with support for multiple image uploads and primary image designation.

### Dependencies
- Task 36: Create Product Form Component
- Task 50: Create Image Upload Zone (parallel)
- Task 51: Create Image Preview Grid (parallel)
- Task 52: Create Image Delete Action (parallel)

### Instructions

1. **Create component file structure**
   - Navigate to `frontend/components/modules/products/ProductForm/` directory
   - Create new file named `MediaSection.tsx`
   - Set up React functional component with TypeScript

2. **Import required dependencies**
   - Import React and React Hook Form utilities
   - Import ImageUploadZone component (Task 50)
   - Import ImagePreviewGrid component (Task 51)
   - Import state management hooks (useState)

3. **Define section component structure**
   - Accept form control and setValue as props
   - Create section container with proper styling
   - Add section heading and description

4. **Set up image state management**
   - Create state for uploaded images array
   - Include image data: file, preview URL, isPrimary flag
   - Sync with form field value ("images")

5. **Implement ImageUploadZone integration**
   - Render ImageUploadZone component
   - Pass onUpload callback to receive new images
   - Handle file validation (type, size, count)
   - Generate preview URLs for uploaded files

6. **Implement ImagePreviewGrid integration**
   - Render ImagePreviewGrid component
   - Pass images array to display
   - Pass handlers for reorder, delete, set primary
   - Update form value when images change

7. **Add image management handlers**
   - onImagesAdd: Add new images to array
   - onImageDelete: Remove image by index
   - onImageReorder: Update image order
   - onSetPrimary: Mark image as primary

8. **Add upload guidelines**
   - Display accepted file types (JPEG, PNG, WebP)
   - Show maximum file size (5MB per image)
   - Show maximum image count (10 images)
   - Provide image dimension recommendations

9. **Handle validation errors**
   - Display form validation errors
   - Show upload errors (file too large, wrong type)
   - Provide clear error messages

### Section Structure

```
┌─────────────────────────────────────────┐
│ Product Images                          │
│ ─────────────────────────────────────── │
│                                         │
│ Upload Guidelines:                      │
│ • Max 10 images • Max 5MB each          │
│ • JPEG, PNG, WebP • 1000x1000px ideal  │
│                                         │
│ ┌─────────────────────────────────┐   │
│ │ ImageUploadZone Component       │   │
│ │ (Drag-drop or click to upload)  │   │
│ └─────────────────────────────────┘   │
│                                         │
│ ┌─────────────────────────────────┐   │
│ │ ImagePreviewGrid Component      │   │
│ │ (Thumbnails with actions)       │   │
│ └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| control | Control<ProductFormValues> | Yes | React Hook Form control |
| setValue | UseFormSetValue<ProductFormValues> | Yes | Form setValue function |
| isLoading | boolean | No | Disable uploads during submission |

### Image Data Structure

| Property | Type | Description |
|----------|------|-------------|
| file | File | Original file object |
| preview | string | Blob URL for preview |
| id | string | Unique identifier (UUID) |
| isPrimary | boolean | Primary image flag |
| order | number | Display order (0-based) |

### Image Validation Rules

| Rule | Limit | Error Message |
|------|-------|---------------|
| File types | JPEG, PNG, WebP | "Invalid file type" |
| File size | 5MB per image | "File too large (max 5MB)" |
| Total count | 10 images | "Maximum 10 images allowed" |
| Dimensions | 1000x1000px recommended | Warning (not blocking) |

### Upload Guidelines Display

```
Accepted Formats: JPEG, PNG, WebP
Maximum Size: 5MB per image
Maximum Count: 10 images
Recommended Size: 1000x1000 pixels
```

### Image Array Management

```
Initial State: []
     ↓
Upload 3 images
     ↓
State: [
  { id: "uuid1", file: File, preview: "blob://...", isPrimary: true, order: 0 },
  { id: "uuid2", file: File, preview: "blob://...", isPrimary: false, order: 1 },
  { id: "uuid3", file: File, preview: "blob://...", isPrimary: false, order: 2 }
]
     ↓
Delete image 2
     ↓
State: [
  { id: "uuid1", ... order: 0 },
  { id: "uuid3", ... order: 1 }
]
```

### Primary Image Logic

| Scenario | Behavior |
|----------|----------|
| First image uploaded | Automatically set as primary |
| Primary image deleted | Next image becomes primary |
| User sets primary | Previous primary becomes non-primary |
| Only one image | Always primary (unchangeable) |

### Expected Outcome
- Functional media section component
- Image upload zone integrated
- Image preview grid integrated
- Image state management working
- Validation and error handling
- Upload guidelines displayed

### Verification Checklist
- [ ] Component file created in ProductForm directory
- [ ] Imports React Hook Form utilities correctly
- [ ] Accepts control and setValue props
- [ ] Renders ImageUploadZone component
- [ ] Renders ImagePreviewGrid component
- [ ] Image state management implemented
- [ ] Upload handlers working correctly
- [ ] Delete handlers working correctly
- [ ] Reorder functionality (if implemented)
- [ ] Set primary functionality (if implemented)
- [ ] Upload guidelines displayed
- [ ] Validation errors displayed
- [ ] Section heading and description present
- [ ] Component exports properly

---

## Task 50: Create Image Upload Zone

### Overview
Create the ImageUploadZone component that provides an intuitive interface for uploading product images. This component supports drag-and-drop file uploads, click-to-browse functionality, multiple file selection, client-side validation (file type, size), visual feedback during drag operations, and progress indication during upload. The component follows modern UX patterns with clear visual cues and accessibility features.

### Dependencies
- Task 49: Create Media Section

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/products/ProductForm/` directory
   - Create `ImageUploadZone.tsx` file
   - Set up TypeScript React functional component

2. **Import required dependencies**
   - Import React hooks (useState, useRef, useCallback)
   - Import UI components (Button, Card)
   - Import icons (Upload, Image, AlertCircle)
   - Import utility functions (file validation)

3. **Define component props interface**
   - onUpload callback for file selection
   - maxFiles prop (default 10)
   - maxSize prop (default 5MB)
   - acceptedTypes prop (default: image/jpeg, image/png, image/webp)
   - disabled prop for loading states

4. **Set up component state**
   - isDragging state for drag feedback
   - uploadProgress state (if upload to server)
   - error state for validation errors
   - Reference to hidden file input element

5. **Implement file input element**
   - Create hidden input element with type="file"
   - Set accept attribute to image types
   - Set multiple attribute for multi-select
   - Connect to click-to-upload handler

6. **Implement drag-and-drop handlers**
   - onDragEnter: Set isDragging to true
   - onDragLeave: Set isDragging to false
   - onDragOver: Prevent default behavior
   - onDrop: Handle dropped files, validate, call onUpload

7. **Implement click-to-upload handler**
   - Add onClick to upload zone
   - Trigger file input click programmatically
   - Handle file selection from input onChange

8. **Implement file validation**
   - Validate file type against accepted types
   - Validate file size against maximum
   - Validate total count against maximum
   - Return validation errors if any

9. **Handle file processing**
   - Receive files from drop or input
   - Validate each file individually
   - Filter out invalid files
   - Call onUpload callback with valid files

10. **Add visual feedback**
    - Change border color during drag
    - Change background color during drag
    - Show upload icon and instructions
    - Display accepted formats and limits

11. **Implement error display**
    - Show error messages for validation failures
    - Display errors inline within component
    - Auto-clear errors after timeout

12. **Add accessibility features**
    - Add proper ARIA labels
    - Support keyboard interaction (Enter to trigger)
    - Announce errors to screen readers
    - Focus management for file input

### Component Structure

```
┌─────────────────────────────────────────┐
│               [Upload Icon]             │
│                                         │
│      Drag and drop images here          │
│               or click to browse        │
│                                         │
│   Accepted: JPEG, PNG, WebP             │
│   Max size: 5MB per image               │
└─────────────────────────────────────────┘

During Drag:
┌═════════════════════════════════════════┐
║               [Upload Icon]             ║
║                                         ║
║         Drop images to upload           ║
║                                         ║
║   Accepted: JPEG, PNG, WebP             ║
║   Max size: 5MB per image               ║
└═════════════════════════════════════════┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| onUpload | (files: File[]) => void | Yes | - | Upload callback |
| maxFiles | number | No | 10 | Maximum file count |
| maxSize | number | No | 5242880 (5MB) | Max size in bytes |
| acceptedTypes | string[] | No | ["image/jpeg", "image/png", "image/webp"] | Accepted MIME types |
| disabled | boolean | No | false | Disable upload |
| currentCount | number | No | 0 | Current image count |

### File Validation Logic

```
For each file:
  ├── Check file type
  │   ├── Is MIME type in acceptedTypes?
  │   └── If no → Add to errors
  ├── Check file size
  │   ├── Is size <= maxSize?
  │   └── If no → Add to errors
  └── Check total count
      ├── Will total exceed maxFiles?
      └── If yes → Add to errors
```

### Drag-and-Drop States

| State | Visual Feedback |
|-------|-----------------|
| Default | Gray border, white background |
| Drag Over | Blue border, blue-tinted background |
| Disabled | Gray background, reduced opacity |
| Error | Red border, error message below |

### Upload Zone Styling

| State | Border | Background | Cursor |
|-------|--------|------------|--------|
| Default | `border-2 border-dashed border-gray-300` | `bg-gray-50` | `cursor-pointer` |
| Hover | `border-blue-400` | `bg-blue-50` | `cursor-pointer` |
| Dragging | `border-blue-600` | `bg-blue-100` | `cursor-copy` |
| Disabled | `border-gray-200` | `bg-gray-100` | `cursor-not-allowed` |

### Error Handling

| Error Type | Message | Action |
|------------|---------|--------|
| Invalid type | "File type not supported" | Reject file |
| File too large | "File exceeds 5MB limit" | Reject file |
| Too many files | "Maximum 10 images allowed" | Reject excess |
| Upload failed | "Upload failed, please try again" | Show retry |

### File Processing Flow

```
User drops/selects files
     ↓
Validate file types
     ↓
Validate file sizes
     ↓
Check total count limit
     ↓
Filter valid files
     ↓
Call onUpload(validFiles)
     ↓
Parent component handles storage
```

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Keyboard | Enter/Space to trigger file input |
| Screen Reader | ARIA labels for zone and input |
| Focus | Visible focus ring on zone |
| Errors | ARIA-live region for announcements |

### Expected Outcome
- Functional drag-and-drop upload zone
- Click-to-browse functionality
- File validation working correctly
- Visual feedback during interactions
- Error handling and display
- Accessibility compliance

### Verification Checklist
- [ ] Component file created
- [ ] Drag-and-drop functionality works
- [ ] Click-to-upload triggers file browser
- [ ] Multiple file selection supported
- [ ] File type validation working
- [ ] File size validation working
- [ ] Maximum count validation working
- [ ] Visual feedback during drag
- [ ] Error messages display correctly
- [ ] Disabled state works properly
- [ ] Keyboard navigation supported
- [ ] ARIA labels implemented
- [ ] Component exports properly

---

## Task 51: Create Image Preview Grid

### Overview
Create the ImagePreviewGrid component that displays uploaded product images in a responsive grid layout with thumbnail previews. This component provides image management functionality including viewing images, deleting images, setting the primary image, reordering images (optional), and displaying image metadata. The grid adapts to different screen sizes and provides clear visual indication of the primary product image.

### Dependencies
- Task 49: Create Media Section
- Task 52: Create Image Delete Action

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/products/ProductForm/` directory
   - Create `ImagePreviewGrid.tsx` file
   - Set up TypeScript React functional component

2. **Import required dependencies**
   - Import React hooks (useState)
   - Import UI components (Card, Button, Badge)
   - Import icons (Star, Trash2, Eye, GripVertical)
   - Import image type definitions

3. **Define component props interface**
   - images prop (array of image objects)
   - onDelete callback for image deletion
   - onSetPrimary callback for primary designation
   - onReorder callback for reordering (optional)
   - disabled prop for loading states

4. **Set up component state**
   - selectedImage state for preview modal (optional)
   - isDragging state for reorder drag feedback (optional)
   - hoveredIndex state for hover effects

5. **Implement grid layout**
   - Use CSS Grid or Flexbox for responsive layout
   - Set columns: 2 on mobile, 3 on tablet, 4 on desktop
   - Apply consistent gap spacing between items
   - Ensure equal height for all grid items

6. **Render image thumbnails**
   - Map through images array
   - Display each image in grid item
   - Use Next.js Image component for optimization
   - Set object-fit to cover for consistent sizing

7. **Implement primary image indicator**
   - Check isPrimary flag for each image
   - Display star icon badge on primary image
   - Position badge in top-left corner
   - Use distinct color (yellow/gold) for visibility

8. **Add image action buttons**
   - Set as primary button (star icon)
   - Delete button (trash icon)
   - View/preview button (eye icon, optional)
   - Position buttons as overlay on hover

9. **Implement hover effects**
   - Darken image overlay on hover
   - Show action buttons on hover
   - Add smooth transitions for professional feel
   - Maintain accessibility for touch devices

10. **Implement delete functionality**
    - Add click handler to delete button
    - Show confirmation dialog (optional but recommended)
    - Call onDelete callback with image ID/index
    - Handle primary image deletion (promote next)

11. **Implement set primary functionality**
    - Add click handler to set primary button
    - Disable button for already-primary image
    - Call onSetPrimary callback with image ID
    - Update visual indicator immediately

12. **Add drag-and-drop reordering (optional)**
    - Make grid items draggable
    - Show drag handle icon (grip icon)
    - Implement drag-and-drop handlers
    - Update image order on drop
    - Call onReorder callback with new order

13. **Add empty state**
    - Display message when images array is empty
    - Show helpful text ("No images uploaded yet")
    - Include icon for visual appeal

14. **Add image metadata display (optional)**
    - Show file size below thumbnail
    - Show dimensions if available
    - Display upload status indicator

### Grid Layout Structure

```
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│  [IMG]  │ │  [IMG]  │ │  [IMG]  │ │  [IMG]  │
│ ★Primary│ │         │ │         │ │         │
│ [Actions]│ │[Actions]│ │[Actions]│ │[Actions]│
└─────────┘ └─────────┘ └─────────┘ └─────────┘
┌─────────┐ ┌─────────┐
│  [IMG]  │ │  [IMG]  │
│         │ │         │
│ [Actions]│ │[Actions]│
└─────────┘ └─────────┘

Mobile: 2 columns
Tablet: 3 columns
Desktop: 4 columns
```

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| images | ImageData[] | Yes | Array of image objects |
| onDelete | (id: string) => void | Yes | Delete handler |
| onSetPrimary | (id: string) => void | Yes | Set primary handler |
| onReorder | (newOrder: ImageData[]) => void | No | Reorder handler |
| disabled | boolean | No | Disable actions |

### Image Data Structure

```typescript
interface ImageData {
  id: string;              // Unique identifier
  file: File;              // File object
  preview: string;         // Blob URL or base64
  isPrimary: boolean;      // Primary flag
  order: number;           // Display order
  size?: number;           // File size in bytes
  dimensions?: {           // Image dimensions
    width: number;
    height: number;
  };
}
```

### Grid Item Structure

```
┌───────────────────────┐
│ ★ Primary       [===] │ ← Badges/drag handle
│                       │
│       [Image]         │ ← Thumbnail
│                       │
│  ┌──────────────────┐│
│  │ [★] [👁] [🗑]   ││ ← Actions (on hover)
│  └──────────────────┘│
│  2.3 MB • 800x600    │ ← Metadata (optional)
└───────────────────────┘
```

### Action Buttons

| Button | Icon | Action | Availability |
|--------|------|--------|--------------|
| Set Primary | Star | Mark as primary image | Not on primary |
| View | Eye | Open preview modal | Always |
| Delete | Trash | Remove image | Always |

### Primary Image Indicator

```
┌─────────────────┐
│ ★ Primary       │ ← Badge with star icon
│   [Image]       │
│                 │
└─────────────────┘
```

### Hover State

```
Default State:
┌─────────────┐
│             │
│   [Image]   │
│             │
└─────────────┘

Hover State:
┌─────────────┐
│ [Overlay]   │ ← Dark overlay (bg-black/50)
│ [★][👁][🗑]│ ← Action buttons visible
│             │
└─────────────┘
```

### Responsive Grid Columns

| Breakpoint | Columns | Tailwind Class |
|------------|---------|----------------|
| Mobile (< 640px) | 2 | `grid-cols-2` |
| Tablet (640px-1024px) | 3 | `sm:grid-cols-3` |
| Desktop (> 1024px) | 4 | `lg:grid-cols-4` |

### Empty State Display

```
┌─────────────────────────────────────┐
│                                     │
│          [Image Icon]               │
│                                     │
│     No images uploaded yet          │
│  Upload images to showcase your     │
│           product                   │
│                                     │
└─────────────────────────────────────┘
```

### Delete Confirmation

| Scenario | Confirmation |
|----------|--------------|
| Non-primary image | "Delete this image?" |
| Primary image | "Delete primary image? The next image will become primary." |
| Last image | "Delete last image?" |

### Expected Outcome
- Responsive image grid layout
- Primary image indicator working
- Action buttons functional
- Delete functionality with confirmation
- Set primary functionality working
- Hover effects implemented
- Empty state displayed when needed

### Verification Checklist
- [ ] Component file created
- [ ] Grid layout responsive (2/3/4 columns)
- [ ] Images display as thumbnails
- [ ] Primary image badge displays correctly
- [ ] Action buttons appear on hover
- [ ] Set primary button works correctly
- [ ] Delete button triggers confirmation
- [ ] onDelete callback fires properly
- [ ] onSetPrimary callback fires properly
- [ ] Disabled state works correctly
- [ ] Empty state displays when no images
- [ ] Hover effects smooth and professional
- [ ] Touch devices can access actions
- [ ] Component exports properly

---

## Task 52: Create Image Delete Action

### Overview
Create the image deletion functionality with proper user confirmation, state management, and visual feedback. This task implements the delete action handlers, confirmation dialog integration, primary image handling when deleting the primary image, cleanup of blob URLs to prevent memory leaks, and proper error handling. The implementation ensures a smooth user experience with clear feedback and prevents accidental deletions.

### Dependencies
- Task 51: Create Image Preview Grid

### Instructions

1. **Create confirmation dialog component (optional)**
   - If not using existing dialog component, create `ConfirmDialog.tsx`
   - Place in `frontend/components/ui/` directory
   - Implement modal with confirm/cancel buttons

2. **Implement delete handler in MediaSection**
   - Navigate to `MediaSection.tsx` component
   - Create `handleImageDelete` function
   - Accept image ID or index as parameter

3. **Add confirmation logic**
   - Show confirmation dialog before deletion
   - Use different messages for primary vs non-primary
   - Provide cancel option to prevent accidental deletion

4. **Implement image removal from state**
   - Filter out deleted image from images array
   - Update form field value with new array
   - Trigger form validation if needed

5. **Handle primary image deletion**
   - Check if deleted image is primary
   - If yes, set next image (index 0 after deletion) as primary
   - If deleting last image, clear primary flag
   - Update isPrimary flags in remaining images

6. **Clean up blob URLs**
   - Revoke blob URL for deleted image
   - Call `URL.revokeObjectURL(preview)`
   - Prevent memory leaks from unrevoked URLs

7. **Update image order**
   - Reindex remaining images after deletion
   - Ensure order property is sequential (0, 1, 2, ...)
   - Maintain relative order of remaining images

8. **Add optimistic UI updates**
   - Remove image from grid immediately
   - Show loading state if server deletion is needed
   - Revert if server deletion fails

9. **Implement error handling**
   - Handle deletion failures gracefully
   - Show error message to user
   - Restore image if deletion fails

10. **Add undo functionality (optional)**
    - Show toast with undo option after deletion
    - Keep deleted image in temporary state
    - Restore image if undo clicked within timeout

### Confirmation Dialog Flow

```
User clicks delete button
     ↓
Show confirmation dialog
     │
     ├─→ User clicks "Cancel"
     │        ↓
     │   Close dialog, no action
     │
     └─→ User clicks "Delete"
             ↓
        Remove from state
             ↓
        Clean up blob URL
             ↓
        Update primary if needed
             ↓
        Update form value
             ↓
        Show success feedback
```

### Confirmation Messages

| Scenario | Message | Buttons |
|----------|---------|---------|
| Non-primary image | "Are you sure you want to delete this image?" | Cancel, Delete |
| Primary image | "Delete primary image? The next image will become primary." | Cancel, Delete |
| Last image | "Delete the last product image?" | Cancel, Delete |

### Delete Handler Function Signature

```typescript
const handleImageDelete = async (imageId: string) => {
  // Show confirmation
  // Remove from state
  // Clean up blob URL
  // Handle primary image logic
  // Update form value
}
```

### Primary Image Handling Logic

```
Delete Image
     ↓
Is deleted image primary?
     ├─→ No: Just remove, no other changes
     │
     └─→ Yes: Need to assign new primary
            ↓
       Are there remaining images?
            ├─→ No: Set form primary to null
            │
            └─→ Yes: Set first remaining as primary
                     (image at index 0)
```

### Image State Update

```
Before Delete (5 images):
[
  { id: "1", isPrimary: true, order: 0 },
  { id: "2", isPrimary: false, order: 1 },  ← Delete this
  { id: "3", isPrimary: false, order: 2 },
  { id: "4", isPrimary: false, order: 3 },
  { id: "5", isPrimary: false, order: 4 }
]

After Delete (4 images):
[
  { id: "1", isPrimary: true, order: 0 },
  { id: "3", isPrimary: false, order: 1 },  ← Reindexed
  { id: "4", isPrimary: false, order: 2 },  ← Reindexed
  { id: "5", isPrimary: false, order: 3 }   ← Reindexed
]
```

### Blob URL Cleanup

```typescript
// Before deletion
const imageToDelete = images.find(img => img.id === imageId);

// Revoke blob URL to free memory
if (imageToDelete?.preview.startsWith('blob:')) {
  URL.revokeObjectURL(imageToDelete.preview);
}

// Then remove from array
const updatedImages = images.filter(img => img.id !== imageId);
```

### Error Handling Scenarios

| Error | Cause | Action |
|-------|-------|--------|
| Deletion fails | Server error | Show error toast, keep image |
| Primary reassignment fails | State error | Restore previous state |
| Invalid image ID | Logic error | Log error, show generic message |

### Visual Feedback

| Action | Feedback |
|--------|----------|
| Delete clicked | Show confirmation dialog |
| Confirmed | Remove image with fade animation |
| Success | Show toast: "Image deleted" |
| With undo | Toast: "Image deleted" + Undo button |
| Error | Toast: "Failed to delete image" |

### Undo Functionality (Optional)

```
Delete confirmed
     ↓
Store in temporary state (5 sec timeout)
     ↓
Show toast with undo button
     │
     ├─→ Timeout expires
     │        ↓
     │   Permanently delete, cleanup
     │
     └─→ Undo clicked
             ↓
        Restore from temporary state
             ↓
        Add back to images array
```

### Expected Outcome
- Delete button triggers confirmation
- Image removed from state after confirmation
- Primary image handled correctly
- Blob URLs cleaned up properly
- Form value updated
- Visual feedback provided

### Verification Checklist
- [ ] Delete handler function implemented
- [ ] Confirmation dialog shows before deletion
- [ ] Different messages for primary/non-primary
- [ ] Image removed from state correctly
- [ ] Blob URL revoked after deletion
- [ ] Primary image reassigned if needed
- [ ] Last image deletion handled properly
- [ ] Image order reindexed after deletion
- [ ] Form value updated correctly
- [ ] Error handling implemented
- [ ] Success feedback displayed
- [ ] Animation smooth (fade out)
- [ ] Undo functionality (if implemented)

---

## Task 53: Create Form Submit Handler

### Overview
Create the comprehensive form submission handler that processes the product creation form, validates all fields, prepares data for API submission including file uploads, handles the API request using the product creation mutation hook, manages loading and error states, and provides user feedback. This handler orchestrates the entire submission flow from form validation through successful product creation.

### Dependencies
- Task 36: Create Product Form Component
- All previous tasks (35-52)

### Instructions

1. **Set up API mutation hook**
   - Navigate to `frontend/lib/api/products.ts` (or hooks file)
   - Create or import `useCreateProduct` mutation hook
   - Use React Query's useMutation for API call
   - Define request and response types

2. **Implement onSubmit handler in ProductForm**
   - Create `onSubmit` function accepting form values
   - Receive validated data from React Hook Form
   - Set loading state to disable form during submission

3. **Prepare basic product data**
   - Extract form values (name, SKU, description, etc.)
   - Format prices as numbers (remove currency formatting)
   - Convert string values to appropriate types
   - Validate required fields one final time

4. **Handle category IDs**
   - Extract category_ids array from form values
   - Ensure all IDs are valid UUIDs
   - Filter out any empty or invalid values

5. **Handle tags array**
   - Extract tags from form values
   - Ensure proper formatting (lowercase, hyphens)
   - Remove duplicates if any
   - Trim whitespace

6. **Prepare image upload**
   - Extract images array from form values
   - Identify primary image (isPrimary flag)
   - Create FormData for multipart upload
   - Append all images to FormData

7. **Build API request payload**
   - Combine all prepared data into request object
   - Follow API schema requirements
   - Include tenant context if needed
   - Format according to backend expectations

8. **Execute API mutation**
   - Call mutation function with prepared data
   - Use try-catch for error handling
   - Await response from server

9. **Handle success response**
   - Extract created product data from response
   - Show success toast notification
   - Redirect to product detail page or listing
   - Clear form if staying on page (optional)

10. **Handle error response**
    - Catch and parse error from API
    - Extract error messages (field-specific or general)
    - Display errors using toast or form error display
    - Map API errors to form fields if applicable

11. **Implement loading state management**
    - Set isSubmitting to true at start
    - Disable form inputs during submission
    - Show loading indicator on submit button
    - Reset loading state on completion or error

12. **Add form validation trigger**
    - Trigger validation before submission
    - Display all validation errors if present
    - Prevent submission if validation fails
    - Focus first error field

### Submit Handler Flow

```
User clicks "Create Product"
     ↓
Trigger form validation
     │
     ├─→ Validation fails
     │        ↓
     │   Show errors, focus first field
     │
     └─→ Validation passes
             ↓
        onSubmit handler called
             ↓
        Set loading state
             ↓
        Prepare product data
             ↓
        Format prices, categories, tags
             ↓
        Prepare image uploads
             ↓
        Build API payload
             ↓
        Call createProduct mutation
             │
             ├─→ Success
             │        ↓
             │   Show success toast
             │        ↓
             │   Redirect to product page
             │
             └─→ Error
                     ↓
                Display error messages
                     ↓
                Reset loading state
```

### API Request Payload Structure

```typescript
interface CreateProductPayload {
  // Basic Info
  name: string;
  sku: string;
  description?: string;
  
  // Pricing
  cost_price: number;
  selling_price: number;
  tax_category_id?: string;
  
  // Inventory
  track_inventory: boolean;
  initial_stock?: number;
  reorder_point?: number;
  
  // Categorization
  category_ids: string[];
  tags: string[];
  
  // Images (FormData for multipart upload)
  images: File[];
  primary_image_index: number;
}
```

### Data Transformation Examples

| Form Value | API Value | Transformation |
|------------|-----------|----------------|
| "LKR 1,500.00" | 1500.00 | Remove prefix, parse float |
| "PHONE CASE" | "phone-case" | Lowercase, replace spaces |
| ["uuid1", "", "uuid2"] | ["uuid1", "uuid2"] | Filter empty |
| Date string | ISO 8601 | Format conversion |

### FormData Construction (for images)

```typescript
const formData = new FormData();

// Append basic fields
formData.append('name', values.name);
formData.append('sku', values.sku);
formData.append('cost_price', values.cost_price.toString());
// ... other fields

// Append images
values.images.forEach((image, index) => {
  formData.append(`images`, image.file);
  if (image.isPrimary) {
    formData.append('primary_image_index', index.toString());
  }
});

// Append arrays as JSON
formData.append('category_ids', JSON.stringify(values.category_ids));
formData.append('tags', JSON.stringify(values.tags));
```

### Error Handling

| Error Type | Response | User Feedback |
|------------|----------|---------------|
| Network error | Catch exception | "Network error. Please check your connection." |
| Validation error (400) | Field errors in response | Map errors to form fields |
| Duplicate SKU (409) | Conflict message | "Product with this SKU already exists" |
| Server error (500) | Generic error | "Server error. Please try again." |
| Unauthorized (401) | Auth error | Redirect to login |

### Success Flow

```
API returns success (201 Created)
     ↓
Extract product data
     ↓
Show success toast
     ↓
Get created product ID
     ↓
Navigate to: /products/{productId}
     or
Navigate to: /products (listing)
```

### Loading States

| Element | Loading State |
|---------|---------------|
| Submit button | Disabled, shows spinner |
| Form inputs | Disabled (read-only) |
| Upload zone | Disabled (no new uploads) |
| Navigation | Disabled (prevent leaving) |

### Mutation Hook Setup

```typescript
const createProduct = useMutation({
  mutationFn: async (data: CreateProductPayload) => {
    const response = await axios.post('/api/products/', data);
    return response.data;
  },
  onSuccess: (data) => {
    // Invalidate product list query
    queryClient.invalidateQueries(['products']);
    // Show success notification
    toast.success('Product created successfully');
    // Navigate to product page
    router.push(`/products/${data.id}`);
  },
  onError: (error) => {
    // Show error notification
    toast.error('Failed to create product');
  }
});
```

### Form Reset (Optional)

| Scenario | Action |
|----------|--------|
| Success + stay on page | Reset form to initial values |
| Success + navigate | No reset needed (leaving page) |
| Error | Keep form data (allow correction) |
| User cancels | Confirm before reset |

### Expected Outcome
- Complete form submission flow
- Data prepared and formatted correctly
- API request executed successfully
- Loading states managed properly
- Success/error feedback displayed
- Navigation after successful creation

### Verification Checklist
- [ ] onSubmit handler implemented
- [ ] Form validation triggered before submit
- [ ] Loading state set during submission
- [ ] Product data prepared correctly
- [ ] Prices formatted as numbers
- [ ] Category IDs formatted correctly
- [ ] Tags formatted correctly
- [ ] Images prepared for upload
- [ ] FormData constructed properly
- [ ] API mutation called with correct data
- [ ] Success response handled
- [ ] Success toast displayed
- [ ] Navigation to product page works
- [ ] Error responses handled
- [ ] Error messages displayed
- [ ] Field-specific errors mapped
- [ ] Loading states disable interactions
- [ ] Submit button shows loading indicator
- [ ] Form reset on success (if applicable)

---

## Task 54: Create Create Product Page

### Overview
Create the complete create product page that brings together all components and functionality from previous tasks. This page serves as the main entry point for creating new products, includes the page layout with header and breadcrumbs, renders the ProductForm component with all sections, handles routing and navigation, implements proper authentication checks, and provides a complete user experience for product creation.

### Dependencies
- Task 53: Create Form Submit Handler
- All form components from previous tasks

### Instructions

1. **Create page file in app directory**
   - Navigate to `frontend/app/(dashboard)/products/` directory
   - Create `new` directory for the create product route
   - Create `page.tsx` file inside `new` directory
   - Full path: `app/(dashboard)/products/new/page.tsx`

2. **Set up page metadata**
   - Export metadata object for SEO
   - Set title: "Create Product | LankaCommerce Cloud"
   - Set description for better SEO

3. **Import required components**
   - Import ProductForm component
   - Import page layout components (PageHeader, Breadcrumbs)
   - Import UI components (Card, Button)
   - Import authentication utilities

4. **Implement authentication check**
   - Check if user is authenticated
   - Verify user has "create product" permission
   - Redirect to login if not authenticated
   - Show permission denied if unauthorized

5. **Create page layout structure**
   - Add page container with proper padding
   - Include maximum width constraint (max-w-7xl)
   - Ensure responsive padding for mobile devices

6. **Implement breadcrumbs navigation**
   - Show breadcrumb trail: Home > Products > Create
   - Make breadcrumbs clickable with proper links
   - Use Breadcrumbs component or custom implementation

7. **Create page header**
   - Display page title: "Create New Product"
   - Add description text explaining the page
   - Include cancel/back button
   - Style consistently with other pages

8. **Render ProductForm component**
   - Place form in main content area
   - Wrap in Card component for visual grouping (optional)
   - Pass any required props to form
   - Ensure proper spacing around form

9. **Add cancel/back functionality**
   - Create "Cancel" button in header
   - Link back to products listing page
   - Show confirmation if form has unsaved changes (optional)
   - Use Next.js router for navigation

10. **Implement page loading state**
    - Show loading skeleton while checking auth
    - Display loading state while fetching categories/tags
    - Use Suspense boundaries where appropriate

11. **Add error boundary (optional)**
    - Wrap page in error boundary component
    - Handle and display page-level errors gracefully
    - Provide retry or navigation options

12. **Test routing and navigation**
    - Verify page accessible at `/products/new`
    - Test navigation from product listing page
    - Verify back button functionality
    - Test breadcrumb links

### Page Structure

```
┌─────────────────────────────────────────┐
│ Home > Products > Create                │ ← Breadcrumbs
├─────────────────────────────────────────┤
│                                         │
│ Create New Product          [Cancel]   │ ← Header
│ ─────────────────────────────────────── │
│ Add a new product to your catalog       │ ← Description
│                                         │
│ ┌─────────────────────────────────┐   │
│ │                                 │   │
│ │      ProductForm Component      │   │ ← Form
│ │                                 │   │
│ │  • Basic Info Section           │   │
│ │  • Pricing Section              │   │
│ │  • Inventory Section            │   │
│ │  • Categorization Section       │   │
│ │  • Media Section                │   │
│ │                                 │   │
│ │         [Create Product]        │   │
│ │                                 │   │
│ └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### File Location

```
frontend/app/(dashboard)/products/new/page.tsx
     │         │            │      │
     │         │            │      └─ Page file
     │         │            └─ Route segment (products/new)
     │         └─ Dashboard layout group
     └─ App router root
```

### Page Metadata

```typescript
export const metadata = {
  title: 'Create Product | LankaCommerce Cloud',
  description: 'Create a new product in your LankaCommerce Cloud catalog'
}
```

### Breadcrumbs Configuration

| Level | Label | Link |
|-------|-------|------|
| 1 | Home | `/` or `/dashboard` |
| 2 | Products | `/products` |
| 3 | Create | `/products/new` (current) |

### Page Header Elements

| Element | Content | Action |
|---------|---------|--------|
| Title | "Create New Product" | - |
| Description | "Add a new product to your catalog" | - |
| Cancel Button | "Cancel" | Navigate to `/products` |

### Authentication Flow

```
User navigates to /products/new
     ↓
Check authentication status
     │
     ├─→ Not authenticated
     │        ↓
     │   Redirect to /login?redirect=/products/new
     │
     └─→ Authenticated
             ↓
        Check permissions
             │
             ├─→ No "create product" permission
             │        ↓
             │   Show 403 error page
             │
             └─→ Has permission
                     ↓
                Render page
```

### URL Routing

| URL Path | Page | Access |
|----------|------|--------|
| `/products` | Product listing | Authenticated users |
| `/products/new` | Create product | Users with create permission |
| `/products/[id]` | Product detail | Authenticated users |
| `/products/[id]/edit` | Edit product | Users with edit permission |

### Navigation Flow

```
Product Listing Page
     ↓
Click "Add Product" button
     ↓
Navigate to /products/new
     ↓
Fill in form
     ↓
Click "Create Product"
     ↓
Submit to API
     ↓
Success: Navigate to /products/[newId]
```

### Cancel Button Behavior

| Form State | Action | Confirmation |
|------------|--------|--------------|
| Empty (pristine) | Navigate immediately | No |
| Has changes (dirty) | Show confirm dialog | Yes |
| Submitting | Disabled | N/A |

### Loading States

| Component | Loading State |
|-----------|---------------|
| Page | Skeleton loader |
| Auth check | Spinner or skeleton |
| Categories (in form) | Loading in dropdown |
| Tags (in form) | Loading in input |

### Error Handling

| Error | Display | Action |
|-------|---------|--------|
| Not authenticated | Redirect | Go to login |
| No permission | 403 page | Show message, link to home |
| Form error | In-form errors | Show per field |
| API error | Toast notification | Allow retry |

### Expected Outcome
- Complete, functional create product page
- Proper routing at `/products/new`
- Page layout with header and breadcrumbs
- ProductForm rendered correctly
- Authentication and permissions enforced
- Navigation and cancel functionality working

### Verification Checklist
- [ ] Page file created in correct location
- [ ] URL route `/products/new` accessible
- [ ] Page metadata configured
- [ ] Authentication check implemented
- [ ] Permission check implemented
- [ ] Breadcrumbs display correctly
- [ ] All breadcrumb links functional
- [ ] Page header with title and description
- [ ] Cancel button present and functional
- [ ] ProductForm component renders
- [ ] All form sections display correctly
- [ ] Form submission works end-to-end
- [ ] Success navigation works
- [ ] Cancel navigation works
- [ ] Unsaved changes warning (if implemented)
- [ ] Loading states display properly
- [ ] Error states handled appropriately
- [ ] Responsive design on all devices

---

## Summary

This document completed the product creation form by implementing advanced categorization features, comprehensive media management with drag-and-drop upload, form submission with API integration, and the final product creation page. Together with Document 01, this provides a complete, production-ready product creation flow.

### Completed Tasks
1. ✓ Created Categorization Section with integrated fields
2. ✓ Created Category Multi-Select with hierarchical tree view
3. ✓ Created Tags Input with autocomplete and validation
4. ✓ Created Media Section as container for image management
5. ✓ Created Image Upload Zone with drag-and-drop functionality
6. ✓ Created Image Preview Grid with responsive layout
7. ✓ Created Image Delete Action with confirmation and cleanup
8. ✓ Created Form Submit Handler with comprehensive error handling
9. ✓ Created Create Product Page with complete user experience

### Key Features Delivered
- **Hierarchical Category Selection:** Multi-level category tree with search
- **Flexible Tagging:** Autocomplete suggestions with free-text creation
- **Modern Image Upload:** Drag-and-drop with preview and management
- **Comprehensive Validation:** Client-side and server-side error handling
- **Responsive Design:** Mobile-first approach across all components
- **User-Friendly UX:** Clear feedback, loading states, confirmation dialogs

### Next Steps
Proceed to Group D to implement product editing and detail views, building upon the form components created in this group.
