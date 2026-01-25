# Tasks 33-40: Form Components, Date Pickers, and Money Input

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 03 - Component Library Setup  
> **Group:** C - Form Components  
> **Document:** 01 of 02  
> **Tasks Covered:** 33, 34, 35, 36, 37, 38, 39, 40

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-41-48_Specialized-Inputs.md](02_Tasks-41-48_Specialized-Inputs.md)

---

## Document Overview

This document covers the implementation of core form components, date selection utilities, and specialized money input handling. These components form the foundation of data entry interfaces across the ERP system, providing consistent user experience and validation patterns.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 33 | Install Form Component | Low | 15 min |
| 34 | Create FormField Component | Medium | 30 min |
| 35 | Create FormSection Component | Medium | 25 min |
| 36 | Create FormActions Component | Low | 20 min |
| 37 | Install Calendar Component | Low | 15 min |
| 38 | Install DatePicker Component | Medium | 25 min |
| 39 | Create DateRangePicker Component | Medium | 35 min |
| 40 | Create MoneyInput Component | High | 45 min |

---

## Task 33: Install Form Component (Shadcn Form Wrapper)

### Overview
Install the Shadcn form component which provides React Hook Form integration with proper TypeScript typing, validation error handling, and accessible form controls. This wrapper component serves as the foundation for all form implementations across the ERP system.

### Dependencies
- React Hook Form must be installed in the project
- Zod validation library for schema validation
- Tailwind CSS configured for styling
- Shadcn CLI tool available

### Instructions

1. **Install form dependencies**
   - Run package manager command to add React Hook Form
   - Install Zod for validation schemas
   - Install Shadcn form component integration
   - Verify package.json updates

2. **Add form component via Shadcn CLI**
   - Execute Shadcn add command for form component
   - CLI will copy form primitives to components folder
   - Accept default configuration options
   - Review generated component files

3. **Verify form primitive structure**
   - Check components/ui/form.tsx exists
   - Confirm FormField, FormItem, FormLabel exports
   - Verify FormControl, FormDescription, FormMessage exports
   - Review TypeScript type definitions

4. **Configure form context provider**
   - Examine form provider setup
   - Understand context propagation pattern
   - Review error handling mechanism
   - Check accessibility attributes

5. **Test basic form integration**
   - Create simple test form component
   - Initialize React Hook Form with useForm hook
   - Wrap form with Form component
   - Verify form state management works

6. **Review validation integration**
   - Test Zod schema resolver
   - Verify error message display
   - Check field-level validation
   - Confirm submission handling

### Form Component Structure

```
Form Component Hierarchy
├── Form (Context Provider)
│   ├── FormField (Field Registration)
│   │   └── FormItem (Layout Container)
│   │       ├── FormLabel (Label Element)
│   │       ├── FormControl (Input Wrapper)
│   │       ├── FormDescription (Help Text)
│   │       └── FormMessage (Error Display)
```

### Form Context Flow

```
User Interaction → Field Input → Validation
                                     ↓
                              Error State Update
                                     ↓
                            Context Propagation
                                     ↓
                          FormMessage Display
```

### React Hook Form Integration Benefits

| Feature | Benefit | Impact |
|---------|---------|--------|
| Field Registration | Automatic value tracking | Reduced boilerplate |
| Validation | Real-time error feedback | Better UX |
| Type Safety | TypeScript inference | Fewer runtime errors |
| Performance | Minimal re-renders | Faster forms |
| Accessibility | Built-in ARIA attributes | WCAG compliance |

### Expected Outcome
- Form component installed and available
- React Hook Form integrated with Shadcn
- Validation system functional
- Type-safe form creation enabled
- Foundation for all form implementations

### Verification Checklist
- [ ] components/ui/form.tsx file exists
- [ ] React Hook Form package installed
- [ ] Zod validation library installed
- [ ] Form, FormField, FormItem components available
- [ ] FormLabel, FormControl components available
- [ ] FormDescription, FormMessage components available
- [ ] Test form renders without errors
- [ ] Validation errors display correctly

---

## Task 34: Create FormField Component (Label, Input, Error)

### Overview
Create a comprehensive FormField component that combines label, input control, help text, and error message into a single reusable unit. This component provides consistent field rendering across all forms with built-in validation feedback and accessibility features.

### Dependencies
- Task 33: Install Form Component
- Form primitives (FormItem, FormLabel, FormControl, FormMessage)
- Input component from Shadcn UI library
- TypeScript definitions for props

### Instructions

1. **Create FormField component file**
   - Navigate to components/common/forms directory
   - Create FormField.tsx file
   - Set up TypeScript interface for props
   - Import required form primitives

2. **Define component props interface**
   - Add label prop (required string)
   - Add placeholder prop (optional string)
   - Add description prop (optional string)
   - Add required prop (boolean flag)
   - Add disabled prop (boolean flag)
   - Add render prop for custom input control

3. **Implement label rendering**
   - Use FormLabel component
   - Display label text
   - Add required indicator (asterisk) when required=true
   - Apply consistent label styling
   - Ensure proper htmlFor association

4. **Implement input control wrapper**
   - Use FormControl component
   - Wrap input or custom control
   - Pass through disabled state
   - Handle focus management
   - Apply error state styling

5. **Add description text support**
   - Use FormDescription component
   - Display help text when provided
   - Style as muted secondary text
   - Position below input control
   - Maintain proper spacing

6. **Implement error message display**
   - Use FormMessage component
   - Automatically shows validation errors
   - Style with error color
   - Add error icon indicator
   - Ensure screen reader announcement

7. **Add field wrapper styling**
   - Apply consistent spacing between elements
   - Add proper margin bottom for field separation
   - Ensure responsive layout
   - Handle focus states visually
   - Support dark mode theming

8. **Implement accessibility attributes**
   - Ensure aria-label on input
   - Add aria-describedby for descriptions
   - Include aria-invalid for errors
   - Add aria-required for required fields
   - Test with screen reader

### FormField Visual Structure

```
╔══════════════════════════════════════════════════╗
║  Label Text *                                    ║  ← Label with required indicator
║  ┌────────────────────────────────────────────┐ ║
║  │ [Input Field or Custom Control]            │ ║  ← Input wrapper
║  └────────────────────────────────────────────┘ ║
║  ℹ Optional help text shown here                ║  ← Description (muted)
║  ⚠ Error message displayed here                 ║  ← Error (red, only when invalid)
╚══════════════════════════════════════════════════╝
```

### Field State Variations

#### Default State
```
╔══════════════════════════════════════════════════╗
║  Email Address *                                 ║
║  ┌────────────────────────────────────────────┐ ║
║  │ Enter your email address                   │ ║
║  └────────────────────────────────────────────┘ ║
║  ℹ We'll never share your email                 ║
╚══════════════════════════════════════════════════╝
```

#### Error State
```
╔══════════════════════════════════════════════════╗
║  Email Address *                                 ║
║  ┌────────────────────────────────────────────┐ ║
║  │ invalid-email                              │ ║ ← Red border
║  └────────────────────────────────────────────┘ ║
║  ⚠ Please enter a valid email address          ║ ← Error in red
╚══════════════════════════════════════════════════╝
```

#### Disabled State
```
╔══════════════════════════════════════════════════╗
║  Email Address *                                 ║
║  ┌────────────────────────────────────────────┐ ║
║  │ [Disabled - Cannot Edit]                   │ ║ ← Grayed out
║  └────────────────────────────────────────────┘ ║
╚══════════════════════════════════════════════════╝
```

### FormField Props Reference

| Prop | Type | Required | Default | Purpose |
|------|------|----------|---------|---------|
| label | string | Yes | - | Field label text |
| name | string | Yes | - | Form field name |
| placeholder | string | No | '' | Input placeholder |
| description | string | No | undefined | Help text |
| required | boolean | No | false | Show required indicator |
| disabled | boolean | No | false | Disable input |
| render | function | No | - | Custom input renderer |

### Expected Outcome
- Reusable FormField component created
- Consistent field rendering across forms
- Automatic validation error display
- Accessible form fields with ARIA attributes
- Support for custom input controls via render prop

### Verification Checklist
- [ ] FormField.tsx component created
- [ ] Props interface properly typed
- [ ] Label renders with required indicator
- [ ] Input control wrapper functional
- [ ] Description text displays when provided
- [ ] Error messages show validation errors
- [ ] Disabled state works correctly
- [ ] Accessibility attributes present
- [ ] Dark mode styling supported
- [ ] Component exports correctly

---

## Task 35: Create FormSection Component (Grouping)

### Overview
Create a FormSection component that groups related form fields together with an optional heading and description. This component improves form organization, especially in complex multi-section forms common in ERP systems like inventory entry or invoice creation.

### Dependencies
- Task 34: Create FormField Component
- Tailwind CSS for styling
- React for component implementation

### Instructions

1. **Create FormSection component file**
   - Navigate to components/common/forms directory
   - Create FormSection.tsx file
   - Set up TypeScript interface for props
   - Import React and type definitions

2. **Define component props interface**
   - Add title prop (optional string)
   - Add description prop (optional string)
   - Add children prop (ReactNode)
   - Add className prop (optional string)
   - Add collapsible prop (boolean)
   - Add defaultCollapsed prop (boolean)

3. **Implement section title rendering**
   - Render heading when title provided
   - Use appropriate heading level (h3 or h4)
   - Style with semibold font weight
   - Add consistent spacing below title
   - Support dark mode text colors

4. **Add section description**
   - Render description text when provided
   - Style as muted secondary text
   - Position below title, above fields
   - Use smaller font size
   - Maintain proper spacing

5. **Implement children content area**
   - Render children (form fields) in container
   - Apply vertical spacing between fields
   - Use grid or flex layout for structure
   - Support responsive column layouts
   - Handle empty state gracefully

6. **Add visual section separation**
   - Apply border or background color
   - Add padding around section content
   - Create subtle shadow or border
   - Ensure visual hierarchy clear
   - Support compact and spacious variants

7. **Implement collapsible behavior (optional)**
   - Add collapse/expand toggle button
   - Manage expanded state with useState
   - Animate content visibility
   - Show expand/collapse icon
   - Persist collapsed state if needed

8. **Add section wrapper styling**
   - Apply consistent border radius
   - Add appropriate padding (p-4 or p-6)
   - Set background color (bg-card)
   - Include border (border)
   - Support custom className override

### FormSection Visual Layout

```
╔════════════════════════════════════════════════════════╗
║  Personal Information                          [-]     ║  ← Section Title + Toggle
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║  Please provide your contact details below            ║  ← Section Description
║                                                        ║
║  ┌──────────────────────────────────────────────────┐ ║
║  │  First Name *                                    │ ║  ← Form Field 1
║  │  [________________]                              │ ║
║  └──────────────────────────────────────────────────┘ ║
║                                                        ║
║  ┌──────────────────────────────────────────────────┐ ║
║  │  Last Name *                                     │ ║  ← Form Field 2
║  │  [________________]                              │ ║
║  └──────────────────────────────────────────────────┘ ║
║                                                        ║
║  ┌──────────────────────────────────────────────────┐ ║
║  │  Email Address *                                 │ ║  ← Form Field 3
║  │  [________________]                              │ ║
║  └──────────────────────────────────────────────────┘ ║
╚════════════════════════════════════════════════════════╝
```

### Multi-Section Form Example

```
Invoice Creation Form
┌─────────────────────────────────────────────┐
│  Customer Information                       │ ← Section 1
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  [Customer Fields...]                       │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Invoice Details                            │ ← Section 2
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  [Invoice Fields...]                        │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Line Items                                 │ ← Section 3
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  [Item Table...]                            │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Payment Terms                              │ ← Section 4
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  [Payment Fields...]                        │
└─────────────────────────────────────────────┘
```

### Collapsible Section States

#### Expanded State
```
╔════════════════════════════════════════════╗
║  Advanced Settings              [-]        ║  ← Click to collapse
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║  Configure additional options              ║
║  [Form fields visible...]                  ║
╚════════════════════════════════════════════╝
```

#### Collapsed State
```
╔════════════════════════════════════════════╗
║  Advanced Settings              [+]        ║  ← Click to expand
╚════════════════════════════════════════════╝
```

### FormSection Props Reference

| Prop | Type | Required | Default | Purpose |
|------|------|----------|---------|---------|
| title | string | No | undefined | Section heading |
| description | string | No | undefined | Section description |
| children | ReactNode | Yes | - | Form fields content |
| className | string | No | '' | Custom CSS classes |
| collapsible | boolean | No | false | Enable collapse |
| defaultCollapsed | boolean | No | false | Initial collapsed state |

### Use Cases in ERP System

| Form Type | Sections | Purpose |
|-----------|----------|---------|
| Product Entry | General, Pricing, Inventory, Variants | Organize product data |
| Customer Form | Contact, Business, Billing, Shipping | Separate information types |
| Invoice | Customer, Items, Payment, Notes | Logical data grouping |
| Report Filters | Date Range, Categories, Status, Options | Filter organization |

### Expected Outcome
- FormSection component for grouping fields
- Optional section titles and descriptions
- Visual separation between sections
- Optional collapsible behavior
- Improved form organization and usability

### Verification Checklist
- [ ] FormSection.tsx component created
- [ ] Props interface defined
- [ ] Title renders when provided
- [ ] Description displays correctly
- [ ] Children render in container
- [ ] Visual styling applied (border, padding)
- [ ] Collapsible functionality works (if implemented)
- [ ] Dark mode styling supported
- [ ] Responsive layout functional
- [ ] Component exports correctly

---

## Task 36: Create FormActions Component (Submit/Cancel)

### Overview
Create a FormActions component that provides consistent action button placement and styling for form submission and cancellation. This component ensures uniform button layout across all forms, handles loading states, and manages proper spacing and alignment.

### Dependencies
- Task 33: Install Form Component
- Button component from Shadcn UI
- Loading spinner component
- React for state management

### Instructions

1. **Create FormActions component file**
   - Navigate to components/common/forms directory
   - Create FormActions.tsx file
   - Set up TypeScript interface for props
   - Import Button and loading components

2. **Define component props interface**
   - Add onSubmit prop (function)
   - Add onCancel prop (optional function)
   - Add submitLabel prop (string, default "Submit")
   - Add cancelLabel prop (string, default "Cancel")
   - Add isSubmitting prop (boolean)
   - Add disabled prop (boolean)
   - Add showCancel prop (boolean, default true)

3. **Implement submit button**
   - Render primary Button component
   - Use "default" or "primary" variant
   - Call onSubmit when clicked
   - Show loading spinner when isSubmitting
   - Disable during submission
   - Display custom label text

4. **Add loading state handling**
   - Replace button text with spinner during submit
   - Disable both buttons when submitting
   - Show "Submitting..." text with spinner
   - Prevent multiple submissions
   - Maintain button width to prevent layout shift

5. **Implement cancel button**
   - Render secondary Button component
   - Use "outline" or "ghost" variant
   - Call onCancel when clicked
   - Conditionally render based on showCancel
   - Position to left of submit button
   - Disable during submission

6. **Add button container layout**
   - Use flexbox for button alignment
   - Align buttons to right (justify-end)
   - Add gap spacing between buttons (gap-3)
   - Apply padding top for separation from form (pt-6)
   - Add border top for visual separation (optional)

7. **Implement responsive layout**
   - Stack buttons vertically on mobile
   - Horizontal layout on desktop
   - Full width buttons on mobile
   - Auto width buttons on desktop
   - Reverse order on mobile (cancel on top)

8. **Add keyboard interaction**
   - Submit on Enter key (form default)
   - Cancel on Escape key (optional)
   - Focus management after submission
   - Tab order correct (cancel → submit)

### FormActions Visual Layout

#### Desktop Layout
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  [Form Fields Above...]                                 │
│  ─────────────────────────────────────────────────────  │  ← Optional separator
│                                                         │
│                        [Cancel]  [Submit Form]          │  ← Right-aligned
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Mobile Layout
```
┌──────────────────────────┐
│                          │
│  [Form Fields Above...]  │
│  ──────────────────────  │
│                          │
│  ┌────────────────────┐  │
│  │     Cancel         │  │  ← Full width
│  └────────────────────┘  │
│                          │
│  ┌────────────────────┐  │
│  │   Submit Form      │  │  ← Full width
│  └────────────────────┘  │
│                          │
└──────────────────────────┘
```

### Loading State Display

#### Before Submission
```
│                        [Cancel]  [Submit Form]          │
```

#### During Submission
```
│                        [Cancel]  [⟳ Submitting...]      │
                        (disabled)  (disabled + spinner)
```

#### After Success
```
│                        [Cancel]  [✓ Submitted]          │
                                    (briefly, then redirect/reset)
```

### Button Variants by Action Type

| Action Type | Primary Button | Secondary Button |
|-------------|----------------|------------------|
| Create New | "Create" | "Cancel" |
| Edit Existing | "Save Changes" | "Cancel" |
| Delete | "Delete" (destructive) | "Cancel" |
| Search/Filter | "Apply Filters" | "Reset" |
| Multi-Step | "Next" / "Continue" | "Back" |

### FormActions Usage Examples

#### Simple Create Form
```
<FormActions
  submitLabel="Create Customer"
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  isSubmitting={isLoading}
/>
```

#### Edit Form Without Cancel
```
<FormActions
  submitLabel="Save Changes"
  onSubmit={handleSubmit}
  showCancel={false}
  isSubmitting={isLoading}
/>
```

#### Delete Confirmation
```
<FormActions
  submitLabel="Delete Product"
  cancelLabel="Keep Product"
  onSubmit={handleDelete}
  onCancel={handleCancel}
  isSubmitting={isDeleting}
  // Primary button styled as destructive
/>
```

### FormActions Props Reference

| Prop | Type | Required | Default | Purpose |
|------|------|----------|---------|---------|
| onSubmit | function | Yes | - | Submit handler |
| onCancel | function | No | undefined | Cancel handler |
| submitLabel | string | No | "Submit" | Primary button text |
| cancelLabel | string | No | "Cancel" | Secondary button text |
| isSubmitting | boolean | No | false | Loading state |
| disabled | boolean | No | false | Disable buttons |
| showCancel | boolean | No | true | Show cancel button |

### Expected Outcome
- Consistent action button layout
- Loading state handling during submission
- Responsive button arrangement
- Proper disable state management
- Keyboard interaction support

### Verification Checklist
- [ ] FormActions.tsx component created
- [ ] Props interface properly typed
- [ ] Submit button renders and functions
- [ ] Cancel button renders when showCancel=true
- [ ] Loading spinner shows during submission
- [ ] Buttons disabled during submission
- [ ] Responsive layout works (mobile/desktop)
- [ ] Button alignment correct (right on desktop)
- [ ] Custom labels display properly
- [ ] Component exports correctly

---

## Task 37: Install Calendar Component

### Overview
Install the Shadcn calendar component which provides a date selection interface built on top of react-day-picker. This component serves as the foundation for date pickers and date range selectors throughout the ERP system.

### Dependencies
- React Day Picker library
- date-fns for date manipulation
- Tailwind CSS for styling
- Shadcn CLI tool

### Instructions

1. **Install calendar dependencies**
   - Run package manager command to add react-day-picker
   - Install date-fns utility library
   - Verify version compatibility
   - Check package.json updates

2. **Add calendar component via Shadcn CLI**
   - Execute Shadcn add command for calendar
   - CLI will copy calendar component to components folder
   - Accept default configuration options
   - Review generated component files

3. **Verify calendar component structure**
   - Check components/ui/calendar.tsx exists
   - Confirm Calendar component exports
   - Review TypeScript type definitions
   - Examine default props configuration

4. **Review calendar styling**
   - Inspect Tailwind classes applied
   - Verify day picker CSS customization
   - Check dark mode theme support
   - Review hover and selected states

5. **Test calendar rendering**
   - Create test component with Calendar
   - Verify calendar displays current month
   - Test navigation controls (prev/next month)
   - Check date selection interaction

6. **Configure date-fns locale (optional)**
   - Import locale for internationalization
   - Configure for Sri Lankan context
   - Test date formatting
   - Verify regional calendar settings

7. **Review calendar customization options**
   - Examine mode prop (single, multiple, range)
   - Check disabled dates functionality
   - Review modifiers for special dates
   - Test footer and header customization

### Calendar Component Structure

```
Calendar Interface
┌─────────────────────────────────────────┐
│          ←  December 2025  →            │  ← Month navigation
├─────────────────────────────────────────┤
│  Su  Mo  Tu  We  Th  Fr  Sa            │  ← Week headers
├─────────────────────────────────────────┤
│   1   2   3   4   5   6   7            │
│   8   9  10  11  12  13  14            │  ← Date grid
│  15  16  17 [18] 19  20  21            │  ← [18] = selected
│  22  23  24  25  26  27  28            │
│  29  30  31                            │
└─────────────────────────────────────────┘
```

### Calendar Modes

#### Single Date Selection
```
┌─────────────────────────────────────────┐
│          ←  January 2026  →             │
├─────────────────────────────────────────┤
│  15  16  17 [18] 19  20  21            │
│  22  23  24 [25] 26  27  28            │  ← User selects one date
└─────────────────────────────────────────┘
```

#### Multiple Date Selection
```
┌─────────────────────────────────────────┐
│          ←  January 2026  →             │
├─────────────────────────────────────────┤
│  15 [16] 17 [18] 19  20  21            │
│  22  23 [24][25] 26  27  28            │  ← Multiple dates selected
└─────────────────────────────────────────┘
```

#### Range Selection
```
┌─────────────────────────────────────────┐
│          ←  January 2026  →             │
├─────────────────────────────────────────┤
│  15 [16][17][18][19][20] 21            │  ← Range: Jan 16-20
│  22  23  24  25  26  27  28            │
└─────────────────────────────────────────┘
```

### Calendar Features

| Feature | Description | Use Case |
|---------|-------------|----------|
| Navigation | Month/year selection | Browse dates |
| Selection Modes | Single, multiple, range | Different picker types |
| Disabled Dates | Prevent selection | Past dates, holidays |
| Modifiers | Highlight special dates | Holidays, deadlines |
| Footer | Custom content area | "Today" button |
| Min/Max Dates | Restrict date range | Business rules |

### Date-fns Utility Functions

| Function | Purpose | Example |
|----------|---------|---------|
| format() | Display dates | "Jan 25, 2026" |
| parse() | Parse date strings | "2026-01-25" → Date |
| addDays() | Date arithmetic | date + 7 days |
| isBefore() | Date comparison | Check if past |
| startOfMonth() | Month boundaries | First day of month |
| endOfMonth() | Month boundaries | Last day of month |

### Expected Outcome
- Calendar component installed and functional
- Single date selection capability
- Month/year navigation working
- Foundation for date picker components
- Date-fns utilities available

### Verification Checklist
- [ ] react-day-picker package installed
- [ ] date-fns package installed
- [ ] components/ui/calendar.tsx exists
- [ ] Calendar component renders
- [ ] Month navigation works (prev/next)
- [ ] Date selection functional
- [ ] Dark mode styling applied
- [ ] TypeScript types available

---

## Task 38: Install DatePicker Component

### Overview
Install the Shadcn DatePicker component which combines the Calendar component with a popover and input field, creating a complete date selection interface. This component provides user-friendly date entry with both manual input and calendar picker options.

### Dependencies
- Task 37: Install Calendar Component
- Popover component from Shadcn
- Button component for trigger
- Input component for manual entry
- Calendar icon from Lucide React

### Instructions

1. **Install DatePicker dependencies**
   - Verify Popover component available
   - Ensure Button component installed
   - Confirm Input component exists
   - Install Lucide React for calendar icon

2. **Add DatePicker component via Shadcn CLI**
   - Execute Shadcn add command for date picker
   - CLI may install as part of form templates
   - Review generated component structure
   - Check integration with Calendar component

3. **Verify DatePicker component structure**
   - Check components/ui/date-picker.tsx exists
   - Confirm DatePicker component exports
   - Review Popover integration
   - Examine input field configuration

4. **Review trigger button implementation**
   - Inspect button that opens calendar
   - Verify calendar icon display
   - Check selected date display format
   - Review placeholder text styling

5. **Test popover positioning**
   - Open DatePicker popover
   - Verify calendar appears below input
   - Test positioning edge cases (bottom of screen)
   - Check popover dismissal behavior

6. **Configure date format display**
   - Review date-fns format function usage
   - Configure display format (e.g., "MMM dd, yyyy")
   - Test format with selected date
   - Verify locale-specific formatting

7. **Test manual date input**
   - Type date directly in input field
   - Verify date parsing
   - Test invalid date handling
   - Check format validation

8. **Add clear date functionality**
   - Implement clear/reset button (optional)
   - Allow deselecting date
   - Show empty state properly
   - Test with required fields

### DatePicker Visual Structure

#### Closed State (No Date Selected)
```
┌─────────────────────────────────────┐
│  Pick a date            📅         │  ← Click to open
└─────────────────────────────────────┘
```

#### Closed State (Date Selected)
```
┌─────────────────────────────────────┐
│  Jan 25, 2026           📅         │  ← Shows selected date
└─────────────────────────────────────┘
```

#### Open State (Popover Displayed)
```
┌─────────────────────────────────────┐
│  Jan 25, 2026           📅         │
└─────────────────────────────────────┘
        ↓ Popover appears below
┌─────────────────────────────────────┐
│    ←  January 2026  →               │
├─────────────────────────────────────┤
│ Su Mo Tu We Th Fr Sa                │
│              1  2  3                │
│  4  5  6  7  8  9 10                │
│ 11 12 13 14 15 16 17                │
│ 18 19 20 21 22 23 24                │
│[25]26 27 28 29 30 31                │  ← Selected date
├─────────────────────────────────────┤
│              [Today]                │  ← Footer actions
└─────────────────────────────────────┘
```

### DatePicker Component Flow

```
User Action Flow
┌─────────────────────────────────────────────┐
│  1. User clicks input/button               │
│           ↓                                 │
│  2. Popover opens with calendar            │
│           ↓                                 │
│  3. User selects date from calendar        │
│     OR types date manually                 │
│           ↓                                 │
│  4. Date value updates                     │
│           ↓                                 │
│  5. Popover closes                         │
│           ↓                                 │
│  6. Formatted date displays in input       │
└─────────────────────────────────────────────┘
```

### DatePicker Integration with FormField

```
<FormField
  name="invoiceDate"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Invoice Date</FormLabel>
      <FormControl>
        <DatePicker
          value={field.value}
          onChange={field.onChange}
          placeholder="Select invoice date"
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Date Format Options

| Format String | Example Output | Use Case |
|--------------|----------------|----------|
| "MMM dd, yyyy" | "Jan 25, 2026" | User-friendly display |
| "yyyy-MM-dd" | "2026-01-25" | ISO format, backend |
| "dd/MM/yyyy" | "25/01/2026" | Sri Lankan format |
| "MMMM do, yyyy" | "January 25th, 2026" | Formal documents |
| "EEE, MMM dd" | "Sat, Jan 25" | Compact display |

### DatePicker Props Reference

| Prop | Type | Purpose |
|------|------|---------|
| value | Date | undefined | Selected date |
| onChange | (date: Date | undefined) => void | Date change handler |
| placeholder | string | Input placeholder text |
| disabled | boolean | Disable interaction |
| disabledDates | function | Disable specific dates |
| minDate | Date | Minimum selectable date |
| maxDate | Date | Maximum selectable date |

### Expected Outcome
- DatePicker component installed and working
- Calendar popover opens on trigger click
- Date selection updates input field
- Formatted date display
- Manual date entry supported

### Verification Checklist
- [ ] components/ui/date-picker.tsx exists
- [ ] DatePicker component renders
- [ ] Trigger button displays correctly
- [ ] Popover opens with calendar
- [ ] Date selection updates value
- [ ] Selected date displays formatted
- [ ] Popover closes after selection
- [ ] Manual input works (if supported)
- [ ] Clear functionality present (if implemented)
- [ ] Integration with FormField works

---

## Task 39: Create DateRangePicker Component (Report Filtering)

### Overview
Create a DateRangePicker component that allows users to select a start and end date range. This component is essential for report filtering, transaction history views, and any feature requiring date range specification in the ERP system.

### Dependencies
- Task 37: Install Calendar Component
- Task 38: Install DatePicker Component
- Popover component
- Calendar component with range mode
- date-fns for date calculations

### Instructions

1. **Create DateRangePicker component file**
   - Navigate to components/common/forms directory
   - Create DateRangePicker.tsx file
   - Set up TypeScript interface for props
   - Import Calendar, Popover, Button components

2. **Define date range type interface**
   - Create DateRange interface with from and to properties
   - Both properties are Date or undefined
   - Export interface for external use
   - Add utility type for validation

3. **Define component props interface**
   - Add value prop (DateRange type)
   - Add onChange prop (DateRange parameter)
   - Add placeholder prop (string)
   - Add disabled prop (boolean)
   - Add minDate and maxDate props
   - Add presets prop (array of preset ranges)

4. **Implement trigger button**
   - Show calendar icon
   - Display selected range formatted
   - Show placeholder when no selection
   - Style with outline variant
   - Make full width or fixed width

5. **Configure Calendar for range mode**
   - Set mode to "range"
   - Pass selected range to Calendar
   - Handle range selection onChange
   - Support partial range selection
   - Highlight range dates visually

6. **Implement date range formatting**
   - Format start and end dates
   - Display as "Jan 15 - Jan 20, 2026"
   - Handle same month optimization
   - Handle same year optimization
   - Show single date if range incomplete

7. **Add preset date ranges**
   - Create preset shortcuts (Today, Yesterday, Last 7 days, etc.)
   - Display presets in popover sidebar
   - Apply preset on click
   - Support custom preset definitions
   - Highlight active preset

8. **Implement range validation**
   - Ensure end date after start date
   - Validate against min/max dates
   - Handle invalid ranges
   - Show validation errors
   - Prevent invalid selections

9. **Add clear functionality**
   - Include clear/reset button
   - Clear both start and end dates
   - Reset to undefined range
   - Update parent component
   - Close popover after clear

10. **Implement popover layout**
    - Show presets on left side
    - Display calendar on right side
    - Add footer with apply/cancel buttons
    - Responsive layout for mobile
    - Proper spacing and alignment

### DateRangePicker Visual Structure

#### Closed State (No Range Selected)
```
┌─────────────────────────────────────────────┐
│  📅  Select date range...                  │  ← Placeholder
└─────────────────────────────────────────────┘
```

#### Closed State (Range Selected)
```
┌─────────────────────────────────────────────┐
│  📅  Jan 15 - Jan 20, 2026                 │  ← Selected range
└─────────────────────────────────────────────┘
```

#### Open State (Popover with Presets)
```
┌─────────────────────────────────────────────┐
│  📅  Jan 15 - Jan 20, 2026                 │
└─────────────────────────────────────────────┘
        ↓ Popover opens below
┌───────────────┬─────────────────────────────┐
│ Presets       │    ←  January 2026  →       │
│               │                              │
│ ○ Today       │ Su Mo Tu We Th Fr Sa        │
│ ○ Yesterday   │              1  2  3        │
│ ● Last 7 Days │  4  5  6  7  8  9 10        │
│ ○ Last 30 Days│ 11 12 13 14[15][16][17]     │
│ ○ This Month  │[18][19][20]21 22 23 24      │  ← Highlighted range
│ ○ Last Month  │ 25 26 27 28 29 30 31        │
│ ○ This Year   │                              │
│               ├──────────────────────────────┤
│               │        [Clear] [Apply]       │
└───────────────┴─────────────────────────────┘
```

### Preset Date Ranges

| Preset Name | Date Range | Common Usage |
|------------|------------|--------------|
| Today | Today - Today | Daily reports |
| Yesterday | Yesterday - Yesterday | Previous day review |
| Last 7 Days | 7 days ago - Today | Weekly overview |
| Last 30 Days | 30 days ago - Today | Monthly view |
| This Month | Month start - Today | Current month MTD |
| Last Month | Last month start - end | Previous month complete |
| This Quarter | Quarter start - Today | Quarterly reports |
| This Year | Year start - Today | YTD reports |
| Custom | User selection | Specific periods |

### Date Range Display Formats

#### Full Format (Different Months)
```
Dec 25, 2025 - Jan 5, 2026
```

#### Optimized Format (Same Month)
```
Jan 15 - 20, 2026
```

#### Single Date (Incomplete Range)
```
Jan 15, 2026 - ...
```

#### Same Date (Single Day)
```
Jan 25, 2026
```

### DateRangePicker Usage in Reports

#### Sales Report Filter
```
╔════════════════════════════════════════════════╗
║  Sales Report                                  ║
║  ────────────────────────────────────────────  ║
║                                                ║
║  Date Range:                                   ║
║  ┌──────────────────────────────────────────┐ ║
║  │ 📅 Jan 1 - Jan 31, 2026                  │ ║
║  └──────────────────────────────────────────┘ ║
║                                                ║
║  [Generate Report]                             ║
╚════════════════════════════════════════════════╝
```

#### Transaction History Filter
```
╔════════════════════════════════════════════════╗
║  Transaction History                           ║
║  ────────────────────────────────────────────  ║
║                                                ║
║  Filter by Date:                               ║
║  ┌──────────────────────────────────────────┐ ║
║  │ 📅 Last 7 Days                           │ ║
║  └──────────────────────────────────────────┘ ║
║                                                ║
║  [Apply Filter]                                ║
╚════════════════════════════════════════════════╝
```

### DateRangePicker Props Reference

| Prop | Type | Required | Default | Purpose |
|------|------|----------|---------|---------|
| value | DateRange | No | undefined | Selected range |
| onChange | function | Yes | - | Range change handler |
| placeholder | string | No | "Select date range" | Input placeholder |
| disabled | boolean | No | false | Disable picker |
| minDate | Date | No | undefined | Minimum date |
| maxDate | Date | No | undefined | Maximum date |
| presets | Preset[] | No | default presets | Preset ranges |
| showPresets | boolean | No | true | Show preset sidebar |

### Expected Outcome
- DateRangePicker component for range selection
- Preset shortcuts for common ranges
- Calendar range selection interface
- Formatted range display
- Validation and error handling

### Verification Checklist
- [ ] DateRangePicker.tsx component created
- [ ] DateRange interface defined
- [ ] Trigger button shows selected range
- [ ] Popover opens with calendar
- [ ] Range mode calendar functional
- [ ] Start and end dates selectable
- [ ] Preset buttons work correctly
- [ ] Range formatting displays properly
- [ ] Clear functionality works
- [ ] Validation prevents invalid ranges
- [ ] Component exports correctly

---

## Task 40: Create MoneyInput Component (LKR Formatting)

### Overview
Create a specialized MoneyInput component for handling Sri Lankan Rupee (LKR) currency input with automatic formatting, thousand separators, decimal precision, and Rs. prefix display. This component ensures consistent money entry across the ERP system for invoices, payments, pricing, and financial reports.

### Dependencies
- Task 34: Create FormField Component
- Input component from Shadcn
- React for state management
- Number formatting utilities

### Instructions

1. **Create MoneyInput component file**
   - Navigate to components/common/forms directory
   - Create MoneyInput.tsx file
   - Set up TypeScript interface for props
   - Import Input component and React hooks

2. **Define component props interface**
   - Add value prop (number or string)
   - Add onChange prop (number parameter)
   - Add placeholder prop (string)
   - Add disabled prop (boolean)
   - Add min and max props (number)
   - Add allowNegative prop (boolean, default false)
   - Add className prop (string)

3. **Implement display value state**
   - Use useState for formatted display string
   - Separate from actual numeric value
   - Update on value prop change
   - Handle formatting on blur

4. **Create number formatting function**
   - Format number with thousand separators (commas)
   - Ensure 2 decimal places
   - Add Rs. prefix for display
   - Handle edge cases (undefined, null, zero)
   - Support negative numbers if allowed

5. **Implement input parsing function**
   - Remove non-numeric characters (except decimal and minus)
   - Parse string to number
   - Validate numeric input
   - Handle multiple decimals
   - Prevent invalid characters

6. **Handle onChange event**
   - Parse input value on change
   - Allow raw numeric entry
   - Don't format while typing
   - Call parent onChange with number
   - Maintain cursor position

7. **Handle onBlur event**
   - Format display value on blur
   - Apply thousand separators
   - Round to 2 decimals
   - Add Rs. prefix
   - Validate against min/max

8. **Handle onFocus event**
   - Remove formatting for editing
   - Remove Rs. prefix
   - Remove thousand separators
   - Keep raw number
   - Select all text (optional)

9. **Implement validation**
   - Validate min/max bounds
   - Check negative number allowance
   - Validate decimal places
   - Show validation errors
   - Prevent invalid submission

10. **Add visual currency indicator**
    - Show "Rs." prefix in input (non-editable)
    - Use input addon or prefix element
    - Style prefix differently (muted)
    - Position prefix on left
    - Ensure prefix doesn't interfere with editing

11. **Style for numeric input**
    - Right-align text for better readability
    - Use monospace font for numbers (optional)
    - Larger font size for amounts
    - Clear visual hierarchy
    - Support dark mode

### MoneyInput Visual States

#### Default State (No Value)
```
┌─────────────────────────────────────┐
│  Rs.  0.00                         │  ← Placeholder
└─────────────────────────────────────┘
```

#### Display State (Formatted Value)
```
┌─────────────────────────────────────┐
│  Rs.  125,000.00                   │  ← Formatted with separators
└─────────────────────────────────────┘
```

#### Focused State (Raw Value for Editing)
```
┌─────────────────────────────────────┐
│  125000.00                         │  ← No formatting, cursor active
└─────────────────────────────────────┘
```

#### Error State (Validation Error)
```
┌─────────────────────────────────────┐
│  Rs.  -500.00                      │  ← Red border if negative not allowed
└─────────────────────────────────────┘
  ⚠ Amount must be positive
```

### MoneyInput Formatting Examples

| Input Value | Display Format | Notes |
|-------------|----------------|-------|
| 0 | Rs. 0.00 | Always 2 decimals |
| 150 | Rs. 150.00 | Adds decimals |
| 1500 | Rs. 1,500.00 | Thousand separator |
| 15000 | Rs. 15,000.00 | Single separator |
| 150000 | Rs. 150,000.00 | Multiple separators |
| 1500000 | Rs. 1,500,000.00 | Lakhs formatting |
| 15000000 | Rs. 15,000,000.00 | Crore formatting |
| 1500.5 | Rs. 1,500.50 | Preserves decimals |
| 1500.567 | Rs. 1,500.57 | Rounds to 2 decimals |

### Sri Lankan Numbering System

#### Lakhs and Crores Context
```
Rs. 1,50,000.00     ← 1.5 Lakhs (but we use international format)
Rs. 1,50,00,000.00  ← 1.5 Crores (but we use international format)
```

**Note:** This component uses international thousand separator format (every 3 digits) rather than the Indian/Sri Lankan lakhs system for consistency with modern software standards.

### MoneyInput Usage Examples

#### Product Price Field
```
<FormField
  name="price"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Unit Price</FormLabel>
      <FormControl>
        <MoneyInput
          value={field.value}
          onChange={field.onChange}
          placeholder="Enter price"
          min={0}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

#### Payment Amount (Allows Any Value)
```
<MoneyInput
  value={paymentAmount}
  onChange={setPaymentAmount}
  placeholder="Enter payment amount"
/>
```

#### Refund Amount (Max Validation)
```
<MoneyInput
  value={refundAmount}
  onChange={setRefundAmount}
  max={originalAmount}
  placeholder="Enter refund amount"
/>
```

### Number Formatting Function Logic

#### Format Number with Separators
```
Input: 1500000.75
Steps:
1. Convert to 2 decimals: "1500000.75"
2. Add thousand separators: "1,500,000.75"
3. Add prefix: "Rs. 1,500,000.75"
Output: "Rs. 1,500,000.75"
```

#### Parse Input to Number
```
Input: "Rs. 1,500,000.75"
Steps:
1. Remove prefix: "1,500,000.75"
2. Remove separators: "1500000.75"
3. Parse to number: 1500000.75
Output: 1500000.75
```

### MoneyInput Props Reference

| Prop | Type | Required | Default | Purpose |
|------|------|----------|---------|---------|
| value | number | No | undefined | Current value |
| onChange | function | Yes | - | Value change handler |
| placeholder | string | No | "0.00" | Input placeholder |
| disabled | boolean | No | false | Disable input |
| min | number | No | undefined | Minimum value |
| max | number | No | undefined | Maximum value |
| allowNegative | boolean | No | false | Allow negative amounts |
| className | string | No | '' | Custom classes |

### Validation Rules

| Rule | Check | Error Message |
|------|-------|---------------|
| Required | value !== undefined | "Amount is required" |
| Minimum | value >= min | "Amount must be at least Rs. {min}" |
| Maximum | value <= max | "Amount cannot exceed Rs. {max}" |
| Positive | value >= 0 (if !allowNegative) | "Amount must be positive" |
| Valid Number | !isNaN(value) | "Please enter a valid amount" |

### Expected Outcome
- MoneyInput component for LKR currency
- Automatic thousand separator formatting
- Fixed 2 decimal places
- Rs. prefix display
- Min/max validation support
- User-friendly editing experience

### Verification Checklist
- [ ] MoneyInput.tsx component created
- [ ] Props interface properly typed
- [ ] Number formatting function works
- [ ] Thousand separators display correctly
- [ ] Two decimal places enforced
- [ ] Rs. prefix shows in display mode
- [ ] Raw number entry on focus
- [ ] Formatted display on blur
- [ ] Min/max validation functional
- [ ] Negative number handling correct
- [ ] Parse and format functions accurate
- [ ] Component exports correctly

---

## Summary

This document established comprehensive form infrastructure for the ERP system:

### Completed Components
- ✅ Form Component (Shadcn wrapper with React Hook Form)
- ✅ FormField Component (label, input, error, description)
- ✅ FormSection Component (field grouping with titles)
- ✅ FormActions Component (submit/cancel buttons)
- ✅ Calendar Component (date selection interface)
- ✅ DatePicker Component (single date selection)
- ✅ DateRangePicker Component (range selection with presets)
- ✅ MoneyInput Component (LKR formatting with Rs. prefix)

### Key Achievements
1. **Form Foundation** - React Hook Form integration with validation
2. **Consistent Fields** - Reusable FormField with error handling
3. **Organization** - FormSection for complex multi-part forms
4. **Actions** - Standardized submit/cancel button layout
5. **Date Selection** - Calendar, DatePicker, and DateRangePicker components
6. **Currency Input** - LKR-specific formatting with thousand separators

### Form Component Hierarchy
```
Form (Context Provider)
├── FormSection (Grouping)
│   ├── FormField (Label + Input + Error)
│   │   ├── Input
│   │   ├── DatePicker
│   │   ├── DateRangePicker
│   │   └── MoneyInput
│   └── FormField (...)
└── FormActions (Submit/Cancel)
```

### Use Cases Enabled
| Feature | Components Used | Example |
|---------|----------------|---------|
| Product Entry | FormSection, FormField, MoneyInput | Add/edit products |
| Invoice Creation | FormSection, DatePicker, MoneyInput | Create invoices |
| Report Filters | DateRangePicker, FormActions | Generate reports |
| Customer Forms | FormSection, FormField | Customer management |
| Payment Entry | MoneyInput, DatePicker | Record payments |

### Next Steps
Proceed to [02_Tasks-41-48_Specialized-Inputs.md](02_Tasks-41-48_Specialized-Inputs.md) to implement specialized input components including autocomplete, multi-select, number input with units, percentage input, barcode scanner, image uploader, signature pad, and Rich Text Editor.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 8  
**Total Lines:** ~945
