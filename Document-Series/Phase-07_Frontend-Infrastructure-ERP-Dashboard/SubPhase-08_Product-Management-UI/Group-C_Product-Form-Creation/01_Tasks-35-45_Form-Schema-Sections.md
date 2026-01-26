# Tasks 35-45: Form Schema and Sections

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 08 - Product Management UI  
> **Group:** C - Product Form & Creation  
> **Document:** 01 of 02  
> **Tasks Covered:** 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-46-54_Categorization-Media-Submit.md](02_Tasks-46-54_Categorization-Media-Submit.md)

---

## Document Overview

This document covers the creation of the product form schema and the first three major sections: Basic Info, Pricing, and Inventory. It establishes the Zod validation schema for product data, creates the main ProductForm component using React Hook Form, and implements specialized inputs including SKU auto-generation, rich text description, LKR-formatted price inputs, and inventory tracking.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 35 | Create Product Form Schema | Medium | 30 min |
| 36 | Create Product Form Component | Medium | 35 min |
| 37 | Create Basic Info Section | Medium | 30 min |
| 38 | Create SKU Auto-Generate | Low | 20 min |
| 39 | Create Description Editor | Medium | 25 min |
| 40 | Create Pricing Section | Medium | 30 min |
| 41 | Create Price Input Component | Low | 25 min |
| 42 | Create Tax Category Select | Low | 20 min |
| 43 | Create Inventory Section | Medium | 30 min |
| 44 | Create Initial Stock Input | Low | 15 min |
| 45 | Create Reorder Point Input | Low | 15 min |

---

## Task 35: Create Product Form Schema

### Overview
Create a comprehensive Zod validation schema for product data. This schema validates all product fields including basic information, pricing, inventory, categorization, and media. The schema ensures data integrity before submission to the API and provides type-safe form handling with React Hook Form.

### Dependencies
- Task 14: Product type definitions must be complete
- Zod library installed and configured
- Product types available from API types

### Instructions

1. **Create validation schema file**
   - Navigate to `frontend/lib/validations/` directory
   - Create new file named `product.ts`
   - This file will contain all product-related validation schemas

2. **Import required dependencies**
   - Import `z` from 'zod'
   - Import any custom validation helpers if needed
   - Import product types from API definitions

3. **Define product schema structure**
   - Create `productFormSchema` using `z.object()`
   - Include all required and optional fields
   - Apply appropriate validation rules to each field

4. **Define basic information fields**
   - `name`: Required string, min 2 chars, max 200 chars, trim whitespace
   - `sku`: Required string, pattern validation for SKU format (uppercase alphanumeric with dashes)
   - `description`: Optional string, max 5000 chars, trim whitespace
   - Add helpful error messages for each validation rule

5. **Define pricing fields**
   - `cost_price`: Required number, min 0, transform to 2 decimal places
   - `selling_price`: Required number, min 0, transform to 2 decimal places
   - `tax_category_id`: Optional string UUID format
   - Add custom refinement to ensure selling_price >= cost_price

6. **Define inventory fields**
   - `track_inventory`: Boolean, default true
   - `initial_stock`: Optional number, min 0, integer only
   - `reorder_point`: Optional number, min 0, integer only
   - Add conditional validation: if track_inventory is true, initial_stock is required

7. **Define categorization fields**
   - `category_ids`: Optional array of string UUIDs
   - `tags`: Optional array of strings, max 20 tags, each max 30 chars

8. **Define media fields**
   - `images`: Optional array of File objects
   - Add validation for file type (JPEG, PNG, WebP)
   - Add validation for file size (max 5MB per image)
   - Add validation for array length (max 10 images)

9. **Create TypeScript type from schema**
   - Export `ProductFormData` type using `z.infer<typeof productFormSchema>`
   - This provides type-safe form data throughout the application

10. **Add custom validation rules**
    - Create custom refinement for price comparison
    - Add SKU format validator (uppercase, alphanumeric, dashes only)
    - Add image file type validator

### Schema Structure

```
Product Form Schema
│
├── Basic Information
│   ├── name (string, required, 2-200 chars)
│   ├── sku (string, required, pattern validated)
│   └── description (string, optional, max 5000)
│
├── Pricing
│   ├── cost_price (number, required, ≥ 0)
│   ├── selling_price (number, required, ≥ cost_price)
│   └── tax_category_id (UUID, optional)
│
├── Inventory
│   ├── track_inventory (boolean, default true)
│   ├── initial_stock (number, optional, ≥ 0)
│   └── reorder_point (number, optional, ≥ 0)
│
├── Categorization
│   ├── category_ids (UUID[], optional)
│   └── tags (string[], optional, max 20)
│
└── Media
    └── images (File[], optional, max 10, 5MB each)
```

### Validation Rules Matrix

| Field | Type | Required | Min | Max | Pattern | Custom Rule |
|-------|------|----------|-----|-----|---------|-------------|
| name | string | Yes | 2 | 200 | - | Trim whitespace |
| sku | string | Yes | - | - | ^[A-Z0-9-]+$ | Uppercase only |
| description | string | No | - | 5000 | - | Trim whitespace |
| cost_price | number | Yes | 0 | - | - | 2 decimals |
| selling_price | number | Yes | 0 | - | - | ≥ cost_price |
| tax_category_id | UUID | No | - | - | UUID v4 | - |
| track_inventory | boolean | Yes | - | - | - | Default true |
| initial_stock | number | Conditional | 0 | - | - | Integer only |
| reorder_point | number | No | 0 | - | - | Integer only |
| category_ids | UUID[] | No | - | - | UUID v4 | - |
| tags | string[] | No | - | 20 items | - | Each max 30 chars |
| images | File[] | No | - | 10 items | - | JPEG/PNG/WebP, 5MB |

### Expected Outcome
- Complete Zod validation schema for product forms
- Type-safe ProductFormData type exported
- Comprehensive validation rules with helpful error messages
- Ready for integration with React Hook Form

### Verification Checklist
- [ ] `frontend/lib/validations/product.ts` file created
- [ ] All fields from schema matrix are defined
- [ ] Custom validation rules implemented
- [ ] ProductFormData type exported
- [ ] Error messages are clear and user-friendly
- [ ] Schema compiles without TypeScript errors

---

## Task 36: Create Product Form Component

### Overview
Create the main ProductForm component that serves as the container for all product form sections. This component integrates React Hook Form with the Zod schema, manages form state, handles form submission, and provides the structure for rendering all form sections (Basic Info, Pricing, Inventory, Categorization, and Media).

### Dependencies
- Task 35: Create Product Form Schema

### Instructions

1. **Create ProductForm component directory**
   - Navigate to `frontend/components/modules/products/` directory
   - Create new directory named `ProductForm`
   - This directory will contain all form-related components

2. **Create main ProductForm component file**
   - Inside `ProductForm/` directory, create `ProductForm.tsx`
   - This will be the main form container component

3. **Import required dependencies**
   - Import React hooks (useState, useEffect)
   - Import useForm from 'react-hook-form'
   - Import zodResolver from '@hookform/resolvers/zod'
   - Import productFormSchema and ProductFormData from validations
   - Import Form components from UI library
   - Import Button, Card, and other UI components

4. **Define component props interface**
   - Define `ProductFormProps` interface
   - Include optional `initialData` for edit mode (ProductFormData | undefined)
   - Include `onSubmit` callback (function accepting ProductFormData)
   - Include optional `isLoading` boolean for submission state

5. **Initialize React Hook Form**
   - Use `useForm` hook with ProductFormData type
   - Configure resolver with zodResolver and productFormSchema
   - Set default values from initialData or empty defaults
   - Configure form mode to 'onBlur' for validation timing

6. **Create form submission handler**
   - Define `handleSubmit` function using form.handleSubmit
   - Call onSubmit prop with validated form data
   - Handle loading states during submission
   - Reset form after successful submission (if creating)

7. **Structure form layout**
   - Create form element with Form component
   - Divide form into sections using Card components
   - Each section in its own Card with title and description
   - Sections: Basic Info, Pricing, Inventory, Categorization, Media

8. **Add section placeholders**
   - Create placeholder divs for each section
   - These will be replaced in subsequent tasks
   - Add section titles and brief descriptions
   - Ensure proper spacing between sections

9. **Add form action buttons**
   - Create footer area with action buttons
   - Include "Cancel" button (navigates back)
   - Include "Save Draft" button (optional, for future)
   - Include "Create Product" button (primary action)
   - Disable submit button when form is invalid or loading

10. **Add form state debugging**
    - Conditionally render form state (dev mode only)
    - Display form values, errors, and validation state
    - This helps during development and troubleshooting

### Form Structure Diagram

```
┌─────────────────────────────────────────────────────┐
│              ProductForm Component                  │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │        Basic Info Section (Task 37)          │ │
│  │  - Name input                                │ │
│  │  - SKU input with auto-generate              │ │
│  │  - Description editor                        │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │        Pricing Section (Task 40)             │ │
│  │  - Cost price input                          │ │
│  │  - Selling price input (LKR)                 │ │
│  │  - Tax category select                       │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │        Inventory Section (Task 43)           │ │
│  │  - Track inventory toggle                    │ │
│  │  - Initial stock input                       │ │
│  │  - Reorder point input                       │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │     Categorization Section (Task 46)         │ │
│  │  - Category multi-select                     │ │
│  │  - Tags input                                │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │        Media Section (Task 49)               │ │
│  │  - Image upload zone                         │ │
│  │  - Image preview grid                        │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │    [Cancel]  [Save Draft]  [Create Product]  │ │
│  └───────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### Form Props Configuration

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| initialData | ProductFormData | No | Pre-fill form for editing |
| onSubmit | (data) => void | Yes | Submission callback |
| isLoading | boolean | No | Shows loading state |

### React Hook Form Configuration

| Option | Value | Purpose |
|--------|-------|---------|
| resolver | zodResolver(productFormSchema) | Zod validation |
| mode | 'onBlur' | Validate on blur |
| defaultValues | initialData \|\| defaults | Initial form state |
| reValidateMode | 'onChange' | Re-validate on change |

### Expected Outcome
- Functional ProductForm component with React Hook Form
- Zod schema integration for validation
- Structured layout with section placeholders
- Form submission handler ready
- Action buttons configured

### Verification Checklist
- [ ] `frontend/components/modules/products/ProductForm/ProductForm.tsx` created
- [ ] React Hook Form initialized with Zod resolver
- [ ] ProductFormProps interface defined
- [ ] Section placeholders created (5 sections)
- [ ] Action buttons rendered
- [ ] Form compiles without errors
- [ ] Form state accessible via form methods

---

## Task 37: Create Basic Info Section

### Overview
Create the BasicInfoSection component that contains the fundamental product information fields: name, SKU, and description. This section is the first and most essential part of the product form, providing the core identifying information for every product.

### Dependencies
- Task 36: Create Product Form Component

### Instructions

1. **Create BasicInfoSection component file**
   - Navigate to `frontend/components/modules/products/ProductForm/` directory
   - Create new file named `BasicInfoSection.tsx`
   - This component will be imported into ProductForm

2. **Import required dependencies**
   - Import React and form components
   - Import FormField, FormItem, FormLabel, FormControl, FormMessage
   - Import Input, Textarea components
   - Import Control type from react-hook-form
   - Import ProductFormData type

3. **Define component props interface**
   - Define `BasicInfoSectionProps` interface
   - Include `control` prop (Control<ProductFormData>)
   - Include `isLoading` optional prop for disabled state

4. **Create section container**
   - Return Card component with section styling
   - Add CardHeader with title "Basic Information"
   - Add CardDescription with section purpose
   - Add CardContent for form fields

5. **Create name field**
   - Use FormField with control prop
   - Field name: "name"
   - Render Input component for text entry
   - Label: "Product Name"
   - Placeholder: "Enter product name"
   - Add helper text: "The name customers will see"
   - Display validation errors using FormMessage

6. **Create SKU field container**
   - Use FormField with control prop
   - Field name: "sku"
   - Create horizontal layout with Input and Button
   - Label: "SKU (Stock Keeping Unit)"
   - Placeholder: "e.g., PROD-12345"
   - Add "Generate" button next to input (Task 38)
   - Display validation errors using FormMessage

7. **Create description field**
   - Use FormField with control prop
   - Field name: "description"
   - Render Textarea component for multi-line text
   - Label: "Product Description"
   - Placeholder: "Describe the product features and benefits"
   - Set rows to 5 for adequate space
   - Add character count display (0/5000)
   - Display validation errors using FormMessage
   - Add helper text: "Optional - Detailed product information"

8. **Add field layout and spacing**
   - Stack fields vertically with consistent spacing
   - Use gap-4 or gap-6 for field separation
   - Ensure responsive layout for mobile devices

9. **Handle disabled state**
   - When isLoading is true, disable all inputs
   - Apply disabled styling to inputs and buttons

10. **Integrate into ProductForm**
    - Import BasicInfoSection into ProductForm.tsx
    - Replace Basic Info placeholder with BasicInfoSection component
    - Pass control prop from form instance
    - Pass isLoading state

### Basic Info Section Layout

```
┌────────────────────────────────────────────────┐
│          Basic Information                     │
│  Core product identification details           │
│                                                │
│  Product Name *                                │
│  ┌──────────────────────────────────────────┐ │
│  │ [Enter product name                   ] │ │
│  └──────────────────────────────────────────┘ │
│  The name customers will see                   │
│                                                │
│  SKU (Stock Keeping Unit) *                    │
│  ┌──────────────────────────────┐ ┌─────────┐ │
│  │ [e.g., PROD-12345         ] │ │Generate │ │
│  └──────────────────────────────┘ └─────────┘ │
│  Unique product identifier                     │
│                                                │
│  Product Description                           │
│  ┌──────────────────────────────────────────┐ │
│  │ [Describe the product features...     ] │ │
│  │                                          │ │
│  │                                          │ │
│  │                                          │ │
│  └──────────────────────────────────────────┘ │
│  Optional - Detailed product information       │
│  0 / 5000 characters                           │
└────────────────────────────────────────────────┘
```

### Field Configuration

| Field | Type | Required | Validation | Helper Text |
|-------|------|----------|------------|-------------|
| name | Input | Yes | 2-200 chars | The name customers will see |
| sku | Input | Yes | Pattern: A-Z0-9- | Unique product identifier |
| description | Textarea | No | Max 5000 | Detailed product information |

### Expected Outcome
- Functional BasicInfoSection component
- Three form fields properly configured
- Integration with React Hook Form
- Validation and error display working
- Ready for SKU auto-generation (Task 38)

### Verification Checklist
- [ ] `BasicInfoSection.tsx` file created
- [ ] Three fields rendered: name, sku, description
- [ ] Integrated into ProductForm component
- [ ] Form validation working for each field
- [ ] Error messages display correctly
- [ ] Helper text visible for each field
- [ ] Character count for description works
- [ ] Component compiles without errors

---

## Task 38: Create SKU Auto-Generate

### Overview
Implement SKU auto-generation functionality that creates a unique product SKU based on the product name. The SKU is generated by taking the product name, removing special characters, converting to uppercase, replacing spaces with dashes, and adding a random suffix. Users can manually override the generated SKU if needed.

### Dependencies
- Task 37: Create Basic Info Section

### Instructions

1. **Create SKU generation utility**
   - Navigate to `frontend/lib/utils/` directory
   - Create new file named `sku.ts`
   - This file will contain SKU generation logic

2. **Implement generateSKU function**
   - Create function that accepts product name string
   - Remove all special characters except spaces and dashes
   - Convert string to uppercase
   - Replace multiple spaces with single space
   - Replace spaces with dashes
   - Trim leading/trailing dashes
   - Limit to 20 characters maximum
   - Add 5-character random alphanumeric suffix
   - Return formatted SKU string

3. **Add random suffix generator**
   - Create helper function `generateRandomSuffix`
   - Generate 5 random alphanumeric characters
   - Use uppercase letters and numbers only
   - Ensure suffix is unique enough for practical use

4. **Add SKU validation helper**
   - Create `isValidSKU` function
   - Check if SKU matches pattern: ^[A-Z0-9-]+$
   - Check if SKU length is between 3 and 30 characters
   - Return boolean result

5. **Update BasicInfoSection component**
   - Import generateSKU and isValidSKU utilities
   - Import useFormContext or access form methods
   - Add state to track manual SKU editing

6. **Add Generate button handler**
   - Create `handleGenerateSKU` function
   - Get current name field value
   - Call generateSKU with name value
   - Set SKU field value using form.setValue
   - Show warning if name is empty
   - Mark SKU as auto-generated (not manually edited)

7. **Add auto-generation on name change**
   - Watch name field changes using form.watch
   - When name changes and SKU hasn't been manually edited, auto-generate
   - Use useEffect to trigger generation
   - Only auto-generate when SKU field is empty or not manually edited

8. **Add manual edit detection**
   - Listen to SKU field onChange event
   - When user manually types in SKU field, mark as manually edited
   - Stop auto-generation when manually edited
   - Allow "Generate" button to override manual edit

9. **Add visual feedback**
   - Show icon or badge when SKU is auto-generated
   - Add tooltip explaining auto-generation
   - Show regenerate icon on Generate button
   - Display warning if generated SKU fails validation

10. **Test edge cases**
    - Handle empty product name
    - Handle very short names (1-2 chars)
    - Handle names with only special characters
    - Handle very long names (>50 chars)
    - Ensure uniqueness with random suffix

### SKU Generation Flow

```
Product Name Input
        │
        ▼
   "Gaming Mouse Pro 2024"
        │
        ▼
[Remove Special Chars]
        │
        ▼
   "Gaming Mouse Pro 2024"
        │
        ▼
  [Convert to Upper]
        │
        ▼
   "GAMING MOUSE PRO 2024"
        │
        ▼
[Replace Spaces with -]
        │
        ▼
   "GAMING-MOUSE-PRO-2024"
        │
        ▼
 [Truncate to 20 chars]
        │
        ▼
   "GAMING-MOUSE-PRO-20"
        │
        ▼
  [Add Random Suffix]
        │
        ▼
   "GAMING-MOUSE-PRO-20-A7K2M"
        │
        ▼
    Generated SKU
```

### Generation Algorithm

| Step | Action | Example |
|------|--------|---------|
| 1 | Input | "Gaming Mouse Pro 2024!" |
| 2 | Remove specials | "Gaming Mouse Pro 2024" |
| 3 | Uppercase | "GAMING MOUSE PRO 2024" |
| 4 | Replace spaces | "GAMING-MOUSE-PRO-2024" |
| 5 | Truncate | "GAMING-MOUSE-PRO-20" |
| 6 | Add suffix | "GAMING-MOUSE-PRO-20-A7K2M" |

### User Interactions

| Action | Behavior |
|--------|----------|
| Enter product name | SKU auto-generates (if empty) |
| Click "Generate" | New SKU generated from name |
| Manually type SKU | Auto-generation stops |
| Clear SKU field | Auto-generation resumes |
| Edit name later | SKU doesn't change (if manually edited) |

### Expected Outcome
- Working SKU auto-generation from product name
- "Generate" button triggers manual generation
- Manual editing prevents auto-generation
- Valid SKU format guaranteed
- Random suffix ensures uniqueness

### Verification Checklist
- [ ] `frontend/lib/utils/sku.ts` file created
- [ ] generateSKU function implemented
- [ ] Random suffix generator working
- [ ] Generate button triggers SKU generation
- [ ] Auto-generation on name change works
- [ ] Manual editing detection works
- [ ] Edge cases handled (empty name, special chars, etc.)
- [ ] Generated SKUs are valid format
- [ ] Visual feedback for auto-generation present

---

## Task 39: Create Description Editor

### Overview
Enhance the basic description textarea with a rich text editor or an advanced textarea component that provides better user experience for entering product descriptions. This includes features like markdown support or formatting toolbar, character count, and preview functionality.

### Dependencies
- Task 37: Create Basic Info Section

### Instructions

1. **Choose editor approach**
   - Decision: Simple enhanced textarea vs. full rich text editor
   - For Phase 07, recommend enhanced textarea with markdown support
   - Full WYSIWYG editor (Tiptap, Quill) can be added in future phase
   - Keep it simple but functional

2. **Create DescriptionEditor component file**
   - Navigate to `frontend/components/modules/products/ProductForm/` directory
   - Create new file named `DescriptionEditor.tsx`
   - This component will replace basic textarea in BasicInfoSection

3. **Import required dependencies**
   - Import React hooks (useState, useRef)
   - Import Textarea from UI components
   - Import FormControl, FormItem, FormLabel, FormMessage
   - Import necessary types from react-hook-form

4. **Define component props interface**
   - Define `DescriptionEditorProps` interface
   - Include `value` prop (string)
   - Include `onChange` prop (function)
   - Include `error` prop (string | undefined)
   - Include `disabled` prop (boolean)

5. **Create editor state management**
   - Use useState for character count
   - Use useRef for textarea reference
   - Track cursor position if needed for markdown insertion

6. **Implement character count**
   - Calculate character count from value
   - Display count as "X / 5000 characters"
   - Show warning color when approaching limit (>4500)
   - Show error color when exceeding limit
   - Update count on every change

7. **Add markdown toolbar (optional)**
   - Create simple toolbar with common formatting buttons
   - Bold, Italic, Link, Bullet List, Numbered List
   - Insert markdown syntax at cursor position
   - Toolbar buttons: **Bold**, *Italic*, [Link](), - List, 1. Numbered

8. **Implement markdown helpers**
   - Create helper functions to insert markdown syntax
   - `insertBold`: Wraps selection with **text**
   - `insertItalic`: Wraps selection with *text*
   - `insertLink`: Inserts [text](url)
   - `insertList`: Adds bullet point at line start

9. **Add preview toggle (optional)**
   - Add "Preview" button to toggle between edit and preview
   - Use markdown library to render preview (react-markdown)
   - Display rendered HTML in preview mode
   - Keep this feature optional for future enhancement

10. **Update BasicInfoSection integration**
    - Replace basic Textarea with DescriptionEditor
    - Pass all necessary props from FormField
    - Ensure validation and error display still works
    - Maintain consistent styling with other fields

### Description Editor Layout

```
┌─────────────────────────────────────────────────┐
│  Product Description                            │
│  ┌───────────────────────────────────────────┐  │
│  │  B  I  Link  • List  1. Numbered         │  │  (Toolbar - Optional)
│  └───────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────┐  │
│  │ [Describe the product features...      ] │  │
│  │                                           │  │
│  │ This **bold** text and *italic* text     │  │
│  │                                           │  │
│  │ - Feature 1                               │  │
│  │ - Feature 2                               │  │
│  │                                           │  │
│  └───────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────┐  │
│  │ [Edit]  [Preview]         234 / 5000     │  │
│  └───────────────────────────────────────────┘  │
│  Optional - Supports markdown formatting        │
└─────────────────────────────────────────────────┘
```

### Markdown Toolbar Features

| Button | Markdown | Action |
|--------|----------|--------|
| **B** | `**text**` | Bold text |
| *I* | `*text*` | Italic text |
| Link | `[text](url)` | Insert link |
| • | `- item` | Bullet list |
| 1. | `1. item` | Numbered list |

### Character Count States

| Characters | Color | Message |
|------------|-------|---------|
| 0-4000 | Neutral | "X / 5000 characters" |
| 4001-4800 | Warning | "X / 5000 characters (approaching limit)" |
| 4801-5000 | Warning | "X / 5000 characters (near limit)" |
| >5000 | Error | "X / 5000 characters (exceeds limit)" |

### Expected Outcome
- Enhanced description editor component
- Character count with limit warnings
- Optional markdown toolbar for basic formatting
- Integration with React Hook Form validation
- Better UX than basic textarea

### Verification Checklist
- [ ] `DescriptionEditor.tsx` file created
- [ ] Character count displays and updates
- [ ] Character limit warnings work
- [ ] Markdown toolbar implemented (if chosen)
- [ ] Integration with BasicInfoSection works
- [ ] Form validation still functions
- [ ] Error messages display correctly
- [ ] Component is accessible (keyboard navigation)

---

## Task 40: Create Pricing Section

### Overview
Create the PricingSection component that handles all product pricing information including cost price, selling price, and tax category selection. This section ensures proper pricing structure with validation to prevent selling below cost and proper tax configuration for Sri Lankan tax regulations.

### Dependencies
- Task 36: Create Product Form Component

### Instructions

1. **Create PricingSection component file**
   - Navigate to `frontend/components/modules/products/ProductForm/` directory
   - Create new file named `PricingSection.tsx`
   - This component will be imported into ProductForm

2. **Import required dependencies**
   - Import React and form components
   - Import FormField, FormItem, FormLabel, FormControl, FormMessage
   - Import Control type from react-hook-form
   - Import ProductFormData type
   - Import PriceInput component (Task 41)
   - Import Select component for tax category

3. **Define component props interface**
   - Define `PricingSectionProps` interface
   - Include `control` prop (Control<ProductFormData>)
   - Include `isLoading` optional prop for disabled state
   - Include `watch` prop to observe field values

4. **Create section container**
   - Return Card component with section styling
   - Add CardHeader with title "Pricing"
   - Add CardDescription: "Set product pricing and margins"
   - Add CardContent for form fields

5. **Create cost price field**
   - Use FormField with control prop
   - Field name: "cost_price"
   - Label: "Cost Price"
   - Use PriceInput component (Task 41)
   - Placeholder: "0.00"
   - Helper text: "Your cost to acquire/produce this product"
   - Display validation errors

6. **Create selling price field**
   - Use FormField with control prop
   - Field name: "selling_price"
   - Label: "Selling Price"
   - Use PriceInput component (Task 41)
   - Placeholder: "0.00"
   - Helper text: "Price customers will pay (before tax)"
   - Display validation errors
   - Show warning if selling price < cost price

7. **Calculate and display margin**
   - Watch both cost_price and selling_price using form.watch
   - Calculate profit margin: ((selling_price - cost_price) / selling_price) × 100
   - Display margin percentage below selling price
   - Color code: Green if >0%, Red if <0%, Gray if 0%
   - Format: "Profit Margin: 25.5%"

8. **Calculate and display markup**
   - Calculate markup: ((selling_price - cost_price) / cost_price) × 100
   - Display markup percentage
   - Format: "Markup: 34.5%"
   - Show alongside margin for comparison

9. **Create tax category field**
   - Use FormField with control prop
   - Field name: "tax_category_id"
   - Label: "Tax Category"
   - Use Select component (Task 42)
   - Helper text: "Select applicable tax rate"
   - Display validation errors
   - This will be fully implemented in Task 42

10. **Add pricing summary card**
    - Create separate card showing price breakdown
    - Display: Cost Price, Selling Price, Tax Amount, Final Price
    - Make it responsive and visually clear
    - Update dynamically as prices change

### Pricing Section Layout

```
┌─────────────────────────────────────────────────┐
│           Pricing                               │
│  Set product pricing and margins                │
│                                                 │
│  Cost Price *                                   │
│  ┌──────────────────────────────────────────┐  │
│  │ LKR  [0.00                           ] │  │
│  └──────────────────────────────────────────┘  │
│  Your cost to acquire/produce this product      │
│                                                 │
│  Selling Price *                                │
│  ┌──────────────────────────────────────────┐  │
│  │ LKR  [0.00                           ] │  │
│  └──────────────────────────────────────────┘  │
│  Price customers will pay (before tax)          │
│  ✓ Profit Margin: 25.5% | Markup: 34.5%        │
│                                                 │
│  Tax Category                                   │
│  ┌──────────────────────────────────────────┐  │
│  │ [Select tax category            ▼]      │  │
│  └──────────────────────────────────────────┘  │
│  Select applicable tax rate                     │
│                                                 │
│  ┌──────────── Price Summary ────────────────┐ │
│  │  Cost Price:        LKR 1,000.00         │ │
│  │  Selling Price:     LKR 1,350.00         │ │
│  │  Tax (12%):         LKR   162.00         │ │
│  │  ─────────────────────────────────────── │ │
│  │  Final Price:       LKR 1,512.00         │ │
│  └──────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### Pricing Calculations

| Metric | Formula | Example (Cost: 1000, Selling: 1350) |
|--------|---------|--------------------------------------|
| Profit | Selling - Cost | 350 LKR |
| Margin | (Profit / Selling) × 100 | 25.93% |
| Markup | (Profit / Cost) × 100 | 35% |
| Tax (12%) | Selling × 0.12 | 162 LKR |
| Final Price | Selling + Tax | 1512 LKR |

### Margin Color Coding

| Margin | Color | Meaning |
|--------|-------|---------|
| > 20% | Dark Green | Excellent margin |
| 10-20% | Green | Good margin |
| 0-10% | Yellow | Low margin |
| < 0% | Red | Selling below cost! |

### Expected Outcome
- Functional PricingSection component
- Cost and selling price inputs with LKR formatting
- Real-time margin and markup calculation
- Tax category selector placeholder
- Price summary with breakdown

### Verification Checklist
- [ ] `PricingSection.tsx` file created
- [ ] Cost price and selling price fields rendered
- [ ] Margin calculation displays correctly
- [ ] Markup calculation displays correctly
- [ ] Color coding for margin works
- [ ] Tax category field rendered (placeholder)
- [ ] Price summary card displays
- [ ] Integrated into ProductForm component
- [ ] Validation errors display correctly

---

## Task 41: Create Price Input Component

### Overview
Create a specialized PriceInput component that formats currency values in Sri Lankan Rupees (LKR) with proper thousand separators, decimal places, and validation. This reusable component ensures consistent price formatting throughout the application and provides a better user experience for entering monetary values.

### Dependencies
- Task 40: Create Pricing Section

### Instructions

1. **Create PriceInput component file**
   - Navigate to `frontend/components/ui/` directory
   - Create new file named `PriceInput.tsx`
   - This is a UI component, reusable across the application

2. **Import required dependencies**
   - Import React hooks (useState, useEffect, forwardRef)
   - Import Input component from UI library
   - Import currency formatting utilities

3. **Define component props interface**
   - Define `PriceInputProps` interface extending InputHTMLAttributes
   - Include `value` prop (number | string)
   - Include `onChange` prop (function)
   - Include `onBlur` prop (function)
   - Include `prefix` prop (string, default "LKR")
   - Include `decimals` prop (number, default 2)

4. **Create internal state**
   - Use useState to manage display value (formatted string)
   - Use useState to manage focus state
   - Separate display value from actual numeric value

5. **Implement formatting logic**
   - Create `formatPrice` function
   - Add thousand separators using Intl.NumberFormat
   - Fixed to specified decimal places
   - Format: "1,234,567.89"
   - Handle edge cases (null, undefined, NaN)

6. **Implement parsing logic**
   - Create `parsePrice` function
   - Remove all non-numeric characters except decimal point
   - Convert string to number
   - Handle edge cases (empty string, invalid input)
   - Return null for invalid input

7. **Handle input events**
   - On focus: Show unformatted value for easy editing
   - On blur: Format value with thousand separators
   - On change: Allow only numeric input and single decimal point
   - Prevent multiple decimal points
   - Prevent negative values (optional)

8. **Implement value synchronization**
   - Use useEffect to sync display value with prop value
   - Format prop value on component mount
   - Update display value when prop changes
   - Don't update during focus to avoid interrupting typing

9. **Create prefix display**
   - Add "LKR" prefix as read-only text
   - Position before input field
   - Style to match input field
   - Use muted color to differentiate from input

10. **Add validation styling**
    - Apply error styles when error prop present
    - Add success styles when value is valid
    - Highlight on focus
    - Show currency symbol in brand color

### Price Input Layout

```
┌────────────────────────────────────┐
│ LKR  [1,234,567.89            ] │
└────────────────────────────────────┘
  │            │
  │            └─ Formatted value with separators
  └─ Currency prefix (read-only)

States:
- Unfocused: "LKR  1,234.56" (formatted)
- Focused:   "LKR  1234.56" (unformatted for editing)
- Empty:     "LKR  0.00" (placeholder)
- Invalid:   "LKR  " (red border, error state)
```

### Formatting Examples

| Input | Internal Value | Displayed (unfocused) |
|-------|----------------|-----------------------|
| 1234.56 | 1234.56 | LKR 1,234.56 |
| 1234567 | 1234567.00 | LKR 1,234,567.00 |
| 0 | 0.00 | LKR 0.00 |
| Empty | 0.00 | LKR 0.00 |
| "abc" | null | LKR (error) |

### Input Validation Rules

| Rule | Behavior |
|------|----------|
| Numbers only | Allow 0-9 |
| Single decimal | Only one "." allowed |
| Two decimal places | Limit to 2 digits after decimal |
| No negative | Prevent minus sign (optional) |
| Max value | Optional max validation |
| Min value | Typically 0 for prices |

### Expected Outcome
- Reusable PriceInput component
- Proper LKR formatting with thousand separators
- Smooth UX with format on blur, unformat on focus
- Integration with React Hook Form
- Consistent currency display throughout app

### Verification Checklist
- [ ] `frontend/components/ui/PriceInput.tsx` file created
- [ ] Component accepts standard input props
- [ ] Formatting logic works correctly
- [ ] Thousand separators display properly
- [ ] Decimal places fixed to 2
- [ ] LKR prefix displays
- [ ] Focus/blur behavior works correctly
- [ ] Integration with FormField works
- [ ] Validation errors display
- [ ] Component is accessible

---

## Task 42: Create Tax Category Select

### Overview
Create a tax category selector component that allows users to choose the appropriate tax rate for products according to Sri Lankan tax regulations. This component displays available tax categories (Standard 12%, Reduced 5%, Zero-rated 0%, and Exempt) and integrates with the product form validation.

### Dependencies
- Task 40: Create Pricing Section

### Instructions

1. **Define tax categories data**
   - Create constants file for tax categories
   - Navigate to `frontend/lib/constants/` directory
   - Create file named `tax.ts`
   - Define TAX_CATEGORIES array

2. **Structure tax category objects**
   - Each category has: id, name, rate, description
   - Standard: 12% - Most goods and services
   - Reduced: 5% - Essential goods
   - Zero-rated: 0% - Exports, specific items
   - Exempt: N/A - No VAT applied
   - Include UUID placeholders (to be replaced with API data)

3. **Create TaxCategorySelect component file**
   - Navigate to `frontend/components/modules/products/ProductForm/` directory
   - Create file named `TaxCategorySelect.tsx`
   - This component wraps Select with tax-specific logic

4. **Import required dependencies**
   - Import React and form components
   - Import Select, SelectTrigger, SelectValue, SelectContent, SelectItem
   - Import TAX_CATEGORIES constant
   - Import necessary types

5. **Define component props interface**
   - Define `TaxCategorySelectProps` interface
   - Include `value` prop (string | undefined)
   - Include `onChange` prop (function)
   - Include `disabled` prop (boolean)
   - Include `error` prop (string | undefined)

6. **Create select component structure**
   - Render Select component from UI library
   - Configure with value and onChange handlers
   - Set default to first option (Standard 12%)

7. **Render select trigger**
   - Use SelectTrigger component
   - Display selected category name and rate
   - Show placeholder "Select tax category" when empty
   - Apply error styling when error present

8. **Render select options**
   - Map through TAX_CATEGORIES array
   - Render SelectItem for each category
   - Display category name and rate in option
   - Add description as subtitle or tooltip
   - Format: "Standard - 12%"

9. **Add visual indicators**
   - Add icon or badge for each tax rate
   - Color code by rate (Standard: blue, Reduced: green, Zero: gray, Exempt: orange)
   - Show checkmark for selected option
   - Add helpful tooltips explaining each category

10. **Integrate into PricingSection**
    - Import TaxCategorySelect into PricingSection
    - Replace placeholder select with TaxCategorySelect
    - Connect to form control
    - Pass value, onChange, and error props
    - Update price summary to calculate tax based on selection

### Tax Categories Data Structure

```typescript
[
  {
    id: "uuid-1",
    name: "Standard",
    rate: 12,
    description: "Most goods and services",
    color: "blue"
  },
  {
    id: "uuid-2",
    name: "Reduced",
    rate: 5,
    description: "Essential goods (food, medicine, etc.)",
    color: "green"
  },
  {
    id: "uuid-3",
    name: "Zero-rated",
    rate: 0,
    description: "Exports and specific items",
    color: "gray"
  },
  {
    id: "uuid-4",
    name: "Exempt",
    rate: null,
    description: "No VAT applied (financial services, etc.)",
    color: "orange"
  }
]
```

### Tax Category Select Layout

```
┌────────────────────────────────────────┐
│ Tax Category                           │
│ ┌────────────────────────────────────┐ │
│ │ Standard - 12%              ▼    │ │
│ └────────────────────────────────────┘ │
│                                        │
│ Dropdown Options:                      │
│ ┌────────────────────────────────────┐ │
│ │ ✓ Standard - 12%                  │ │
│ │   Most goods and services          │ │
│ ├────────────────────────────────────┤ │
│ │   Reduced - 5%                     │ │
│ │   Essential goods                  │ │
│ ├────────────────────────────────────┤ │
│ │   Zero-rated - 0%                  │ │
│ │   Exports and specific items       │ │
│ ├────────────────────────────────────┤ │
│ │   Exempt                           │ │
│ │   No VAT applied                   │ │
│ └────────────────────────────────────┘ │
└────────────────────────────────────────┘
```

### Tax Rate Application

| Category | Rate | Example (Price: 1000 LKR) |
|----------|------|---------------------------|
| Standard | 12% | Tax: 120 LKR, Total: 1120 LKR |
| Reduced | 5% | Tax: 50 LKR, Total: 1050 LKR |
| Zero-rated | 0% | Tax: 0 LKR, Total: 1000 LKR |
| Exempt | N/A | Not applicable |

### Expected Outcome
- Functional tax category selector
- All four Sri Lankan tax categories available
- Clear descriptions for each category
- Integration with pricing calculations
- Visual differentiation between categories

### Verification Checklist
- [ ] `frontend/lib/constants/tax.ts` file created
- [ ] Four tax categories defined with rates
- [ ] `TaxCategorySelect.tsx` component created
- [ ] Component integrated into PricingSection
- [ ] Dropdown displays all options correctly
- [ ] Selected value displays in trigger
- [ ] Descriptions visible in dropdown
- [ ] Price summary updates based on selection
- [ ] Form validation works with tax category
- [ ] Component is accessible

---

## Task 43: Create Inventory Section

### Overview
Create the InventorySection component that manages product inventory settings including inventory tracking toggle, initial stock quantity, and reorder point threshold. This section allows businesses to enable or disable inventory tracking per product and set appropriate stock levels and reorder alerts.

### Dependencies
- Task 36: Create Product Form Component

### Instructions

1. **Create InventorySection component file**
   - Navigate to `frontend/components/modules/products/ProductForm/` directory
   - Create new file named `InventorySection.tsx`
   - This component will be imported into ProductForm

2. **Import required dependencies**
   - Import React and form components
   - Import FormField, FormItem, FormLabel, FormControl, FormMessage
   - Import Switch, Input components
   - Import Control type from react-hook-form
   - Import ProductFormData type

3. **Define component props interface**
   - Define `InventorySectionProps` interface
   - Include `control` prop (Control<ProductFormData>)
   - Include `watch` prop to observe track_inventory value
   - Include `isLoading` optional prop for disabled state

4. **Create section container**
   - Return Card component with section styling
   - Add CardHeader with title "Inventory Management"
   - Add CardDescription: "Configure stock tracking and levels"
   - Add CardContent for form fields

5. **Create track inventory toggle**
   - Use FormField with control prop
   - Field name: "track_inventory"
   - Render Switch component
   - Label: "Track Inventory"
   - Description: "Enable to manage stock levels for this product"
   - Default value: true
   - Display FormMessage for errors

6. **Add inventory tracking info alert**
   - Below track inventory toggle, show info alert
   - When enabled: "Stock levels will be automatically adjusted with sales and purchases"
   - When disabled: "This product will not affect inventory counts"
   - Use appropriate icon (Info icon)

7. **Create conditional fields container**
   - Watch track_inventory value using form.watch
   - Only show stock fields when track_inventory is true
   - Use conditional rendering or animated collapse
   - Smooth transition when toggling

8. **Create initial stock field**
   - Use FormField with control prop
   - Field name: "initial_stock"
   - Label: "Initial Stock Quantity"
   - Render Input component with type="number"
   - Placeholder: "0"
   - Helper text: "Starting inventory quantity"
   - Min value: 0
   - Display validation errors
   - Only visible when track_inventory is true
   - Implementation details in Task 44

9. **Create reorder point field**
   - Use FormField with control prop
   - Field name: "reorder_point"
   - Label: "Reorder Point"
   - Render Input component with type="number"
   - Placeholder: "0"
   - Helper text: "Alert when stock falls below this level"
   - Min value: 0
   - Display validation errors
   - Only visible when track_inventory is true
   - Implementation details in Task 45

10. **Add inventory status indicator**
    - When track_inventory is true, show stock status card
    - Display current stock (initial_stock value)
    - Calculate and display "Days of inventory" (placeholder)
    - Show reorder status (Above/Below reorder point)
    - Color code status (Green: healthy, Yellow: approaching, Red: below)

### Inventory Section Layout

```
┌─────────────────────────────────────────────────┐
│      Inventory Management                       │
│  Configure stock tracking and levels            │
│                                                 │
│  Track Inventory              [ON/OFF Toggle]  │
│  Enable to manage stock levels for this product │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ ℹ️  Stock levels will be automatically   │   │
│  │    adjusted with sales and purchases     │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ╔═══════════════════════════════════════════╗ │
│  ║  (Visible only when Track Inventory = ON) ║ │
│  ║                                           ║ │
│  ║  Initial Stock Quantity *                 ║ │
│  ║  ┌────────────────────────────────────┐  ║ │
│  ║  │ [0                              ] │  ║ │
│  ║  └────────────────────────────────────┘  ║ │
│  ║  Starting inventory quantity              ║ │
│  ║                                           ║ │
│  ║  Reorder Point                            ║ │
│  ║  ┌────────────────────────────────────┐  ║ │
│  ║  │ [0                              ] │  ║ │
│  ║  └────────────────────────────────────┘  ║ │
│  ║  Alert when stock falls below this level  ║ │
│  ║                                           ║ │
│  ║  ┌────── Stock Status ──────────────┐    ║ │
│  ║  │  Current Stock:    100 units     │    ║ │
│  ║  │  Reorder Point:    20 units      │    ║ │
│  ║  │  Status:           ✓ Healthy     │    ║ │
│  ║  └───────────────────────────────────┘    ║ │
│  ╚═══════════════════════════════════════════╝ │
└─────────────────────────────────────────────────┘
```

### Track Inventory Behavior

| State | Initial Stock | Reorder Point | Behavior |
|-------|---------------|---------------|----------|
| ON | Required | Optional | Stock tracked, auto-deducted |
| OFF | Hidden | Hidden | Stock not tracked |

### Stock Status Indicators

| Status | Condition | Color | Icon |
|--------|-----------|-------|------|
| Healthy | Stock > Reorder Point + 50% | Green | ✓ |
| Approaching | Stock between Reorder Point and +50% | Yellow | ⚠️ |
| Below Reorder | Stock ≤ Reorder Point | Orange | 📦 |
| Out of Stock | Stock = 0 | Red | ❌ |

### Expected Outcome
- Functional InventorySection component
- Track inventory toggle working
- Conditional display of stock fields
- Initial stock and reorder point placeholders
- Stock status indicator
- Integration with form validation

### Verification Checklist
- [ ] `InventorySection.tsx` file created
- [ ] Track inventory toggle renders and functions
- [ ] Info alert displays based on toggle state
- [ ] Initial stock field visible when tracking enabled
- [ ] Reorder point field visible when tracking enabled
- [ ] Fields hidden when tracking disabled
- [ ] Stock status card displays
- [ ] Integrated into ProductForm component
- [ ] Validation works correctly
- [ ] Smooth transitions on toggle

---

## Task 44: Create Initial Stock Input

### Overview
Create a specialized numeric input component for the initial stock quantity field. This component ensures users can only enter valid positive integers, provides visual feedback for stock levels, and integrates seamlessly with the inventory tracking system.

### Dependencies
- Task 43: Create Inventory Section

### Instructions

1. **Enhance initial stock field in InventorySection**
   - Locate the initial_stock FormField in InventorySection
   - Add numeric input validation
   - Configure input attributes for better UX

2. **Configure input attributes**
   - Set type="number"
   - Set min="0" to prevent negative values
   - Set step="1" for integer increments only
   - Add inputMode="numeric" for mobile keyboards
   - Set pattern="[0-9]*" for additional validation

3. **Add input validation**
   - Prevent decimal input (integers only)
   - Prevent negative values
   - Prevent non-numeric characters
   - Show validation error if invalid value entered

4. **Add increment/decrement buttons**
   - Create button group next to input
   - Add "+" button to increment by 1
   - Add "-" button to decrement by 1 (min 0)
   - Style buttons to match input height
   - Disable "-" button when value is 0

5. **Add quick value buttons**
   - Add preset buttons for common quantities
   - Buttons: +10, +50, +100
   - Clicking sets or adds to current value
   - Useful for bulk stock entry

6. **Add visual stock level indicator**
   - Show icon or badge based on quantity
   - 0 units: Empty box icon (gray)
   - 1-10 units: Low stock icon (yellow)
   - 11-50 units: Medium stock icon (blue)
   - 51+ units: High stock icon (green)

7. **Add helper text with calculation**
   - Display estimated inventory value
   - Calculate: initial_stock × cost_price
   - Format: "Inventory value: LKR 10,000.00"
   - Update in real-time as quantity changes

8. **Handle edge cases**
   - Empty field: Default to 0 on blur
   - Very large numbers: Warn if >10000
   - Copy/paste: Validate pasted content
   - Keyboard input: Allow arrow keys for increment/decrement

9. **Add accessibility features**
   - Proper aria-labels for buttons
   - Keyboard navigation support
   - Screen reader announcements for value changes
   - Focus management

10. **Add loading state**
    - Show spinner when calculating inventory value
    - Disable input during form submission
    - Apply disabled styling when isLoading is true

### Initial Stock Input Layout

```
┌─────────────────────────────────────────────┐
│ Initial Stock Quantity *                    │
│ ┌──────────────────────────┬─────┬─────┐   │
│ │ [100                  ] │  -  │  +  │   │
│ └──────────────────────────┴─────┴─────┘   │
│ [+10] [+50] [+100]                          │
│                                             │
│ 📦 Medium Stock Level                       │
│ Inventory value: LKR 10,000.00              │
│ Starting inventory quantity                 │
└─────────────────────────────────────────────┘
```

### Stock Level Visual Indicators

| Quantity | Icon | Color | Label |
|----------|------|-------|-------|
| 0 | 📭 | Gray | No Stock |
| 1-10 | ⚠️ | Yellow | Low Stock |
| 11-50 | 📦 | Blue | Medium Stock |
| 51-100 | 📦 | Green | Good Stock |
| 101+ | 📦 | Green | High Stock |

### Quick Add Buttons

| Button | Action | Example (Current: 10) |
|--------|--------|----------------------|
| +10 | Add 10 units | New value: 20 |
| +50 | Add 50 units | New value: 60 |
| +100 | Add 100 units | New value: 110 |

### Expected Outcome
- Enhanced numeric input for initial stock
- Increment/decrement buttons
- Quick add buttons for common quantities
- Visual stock level indicator
- Real-time inventory value calculation
- Proper validation and error handling

### Verification Checklist
- [ ] Initial stock field accepts only positive integers
- [ ] Increment (+) button works
- [ ] Decrement (-) button works and respects min 0
- [ ] Quick add buttons (+10, +50, +100) work
- [ ] Stock level indicator displays and updates
- [ ] Inventory value calculation works
- [ ] Validation prevents invalid input
- [ ] Accessibility features implemented
- [ ] Loading state handled correctly
- [ ] Component integrated in InventorySection

---

## Task 45: Create Reorder Point Input

### Overview
Create a specialized input component for the reorder point field that helps users set appropriate stock alert thresholds. This component provides intelligent suggestions based on initial stock, validates that reorder point is logical, and displays helpful visualizations for understanding stock alerts.

### Dependencies
- Task 43: Create Inventory Section
- Task 44: Create Initial Stock Input

### Instructions

1. **Enhance reorder point field in InventorySection**
   - Locate the reorder_point FormField in InventorySection
   - Add numeric input validation
   - Configure input attributes similar to initial stock

2. **Configure input attributes**
   - Set type="number"
   - Set min="0" to prevent negative values
   - Set step="1" for integer increments only
   - Add inputMode="numeric" for mobile keyboards
   - Set pattern="[0-9]*" for validation

3. **Add intelligent suggestions**
   - Watch initial_stock value from form
   - Suggest reorder point as 20% of initial stock
   - Display suggestion: "Suggested: 20 units (20% of initial stock)"
   - Add "Use Suggested" button to apply suggestion
   - Recalculate suggestion when initial_stock changes

4. **Add validation against initial stock**
   - Warn if reorder_point > initial_stock
   - Show warning message: "Reorder point should typically be less than initial stock"
   - Don't block submission, just warn
   - Color code warning (orange text)

5. **Create reorder point visualization**
   - Add simple progress bar or gauge
   - Show initial_stock as full bar
   - Show reorder_point as threshold marker on bar
   - Visual representation of stock levels
   - Color zones: Green (above reorder), Yellow (near), Red (below)

6. **Add preset percentage buttons**
   - Create buttons for common percentages
   - Buttons: 10%, 20%, 30%, 40% of initial stock
   - Clicking calculates and sets reorder point
   - Disable if initial_stock is 0 or empty

7. **Add days of inventory estimate**
   - Allow optional daily usage rate input
   - Calculate: initial_stock / daily_usage = days
   - Calculate: reorder_point / daily_usage = days until reorder
   - Display: "You have ~30 days of inventory, reorder at 6 days"
   - This is optional enhancement, can be future feature

8. **Add increment/decrement buttons**
   - Similar to initial stock input
   - Add "+" button to increment by 1
   - Add "-" button to decrement by 1 (min 0)
   - Style consistently with other numeric inputs

9. **Add contextual help**
   - Add tooltip or popover explaining reorder point
   - Text: "Set the stock level at which you want to be alerted to reorder"
   - Include best practice: "Typically 15-25% of initial stock"
   - Add example scenario

10. **Add relationship indicator**
    - Show relationship between initial stock and reorder point
    - Display as percentage: "Reorder at 20% of initial stock"
    - Update dynamically as values change
    - Help users understand their settings

### Reorder Point Input Layout

```
┌──────────────────────────────────────────────────┐
│ Reorder Point                                    │
│ ┌────────────────────────┬─────┬─────┐          │
│ │ [20                 ] │  -  │  +  │          │
│ └────────────────────────┴─────┴─────┘          │
│                                                  │
│ Percentage of Initial Stock:                    │
│ [10%] [20%] [30%] [40%]                          │
│                                                  │
│ 💡 Suggested: 20 units (20% of initial stock)   │
│    [Use Suggested]                               │
│                                                  │
│ ┌────── Stock Visualization ──────────────────┐ │
│ │  ████████████████████░░░░░░░░░░░░           │ │
│ │  ^                   ^                       │ │
│ │  0                   20 (Reorder)  100       │ │
│ │                                              │ │
│ │  ■ Healthy  ■ Reorder Zone  ■ Critical      │ │
│ └──────────────────────────────────────────────┘ │
│                                                  │
│ Reorder at 20% of initial stock                 │
│ Alert when stock falls below this level          │
└──────────────────────────────────────────────────┘
```

### Reorder Point Calculation Logic

| Initial Stock | Suggested Reorder (20%) | Range (15-30%) |
|---------------|-------------------------|----------------|
| 10 | 2 | 2-3 |
| 50 | 10 | 8-15 |
| 100 | 20 | 15-30 |
| 500 | 100 | 75-150 |
| 1000 | 200 | 150-300 |

### Stock Visualization Zones

| Zone | Range | Color | Status |
|------|-------|-------|--------|
| Healthy | Reorder Point to Initial Stock | Green | Good |
| Reorder Zone | 50% of Reorder to Reorder Point | Yellow | Alert |
| Critical | 0 to 50% of Reorder | Red | Urgent |

### Expected Outcome
- Enhanced numeric input for reorder point
- Intelligent suggestions based on initial stock
- Percentage preset buttons
- Visual stock threshold indicator
- Validation and warnings
- Clear relationship to initial stock

### Verification Checklist
- [ ] Reorder point field accepts only positive integers
- [ ] Increment/decrement buttons work
- [ ] Percentage preset buttons work (10%, 20%, 30%, 40%)
- [ ] Suggested value calculates correctly
- [ ] "Use Suggested" button applies suggestion
- [ ] Warning displays if reorder point > initial stock
- [ ] Stock visualization displays correctly
- [ ] Relationship indicator shows percentage
- [ ] Component updates when initial_stock changes
- [ ] Validation works correctly
- [ ] Component integrated in InventorySection

---

## Summary

This document covered the creation of the product form schema and the first three major sections (Basic Info, Pricing, and Inventory). Key accomplishments:

- **Task 35:** Created comprehensive Zod validation schema for all product data
- **Task 36:** Built ProductForm component with React Hook Form integration
- **Task 37:** Implemented BasicInfoSection with name, SKU, and description fields
- **Task 38:** Added SKU auto-generation from product name
- **Task 39:** Enhanced description editor with character count
- **Task 40:** Created PricingSection with margin and markup calculations
- **Task 41:** Built reusable PriceInput component with LKR formatting
- **Task 42:** Implemented TaxCategorySelect with Sri Lankan tax rates
- **Task 43:** Created InventorySection with conditional field display
- **Task 44:** Enhanced InitialStockInput with visual indicators
- **Task 45:** Built ReorderPointInput with intelligent suggestions

### Next Steps

Proceed to [02_Tasks-46-54_Categorization-Media-Submit.md](02_Tasks-46-54_Categorization-Media-Submit.md) to implement:
- Categorization section (categories and tags)
- Media section (image upload and preview)
- Form submission handler
- Complete create product page

### Visual Progress

```
ProductForm (Complete Structure)
│
├── ✅ Basic Info Section (Tasks 37-39)
│   ├── ✅ Product Name
│   ├── ✅ SKU with Auto-Generate
│   └── ✅ Description Editor
│
├── ✅ Pricing Section (Tasks 40-42)
│   ├── ✅ Cost Price (LKR)
│   ├── ✅ Selling Price (LKR)
│   └── ✅ Tax Category Select
│
├── ✅ Inventory Section (Tasks 43-45)
│   ├── ✅ Track Inventory Toggle
│   ├── ✅ Initial Stock Input
│   └── ✅ Reorder Point Input
│
├── 🔄 Categorization Section (Next Document)
│   ├── Category Multi-Select
│   └── Tags Input
│
├── 🔄 Media Section (Next Document)
│   ├── Image Upload Zone
│   └── Image Preview Grid
│
└── 🔄 Form Actions (Next Document)
    ├── Submit Handler
    └── Create Page
```

---

**Document Complete:** Tasks 35-45 ✓  
**Total Tasks:** 11 of 20 in Group C  
**Progress:** 55% Complete
