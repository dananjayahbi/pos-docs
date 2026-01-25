# Tasks 09-14: Radix UI, Forms, and Verification

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 03 - Component Library Setup  
> **Group:** A - Shadcn/UI Installation & Configuration  
> **Document:** 02 of 02  
> **Tasks Covered:** 09, 10, 11, 12, 13, 14

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-08_CLI-Setup-Utilities.md](01_Tasks-01-08_CLI-Setup-Utilities.md)

---

## Document Overview

This document covers the installation of Radix UI primitives, component theming configuration with LCC brand colors, form handling library setup with React Hook Form and Zod validation, and final verification of the complete Shadcn/UI setup.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 09 | Install Radix UI Primitives | Low | 10 min |
| 10 | Configure Component Theming | Medium | 20 min |
| 11 | Install React Hook Form | Low | 5 min |
| 12 | Install Zod | Low | 5 min |
| 13 | Install @hookform/resolvers | Low | 5 min |
| 14 | Verify Shadcn/UI Setup | Low | 15 min |

---

## Task 09: Install Radix UI Primitives

### Overview
Install Radix UI primitive packages that serve as the foundation for Shadcn/UI components. Radix provides unstyled, accessible component primitives that Shadcn/UI builds upon with Tailwind styling.

### Dependencies
- Task 02 (Project initialized)
- React 18+ installed
- TypeScript configured

### Instructions

1. **Identify required primitives**
   - Review which Radix packages are needed
   - Most will be installed with components
   - Some core primitives useful upfront

2. **Install core Radix packages**
   - Install @radix-ui/react-slot
   - Install @radix-ui/react-icons (optional)
   - Install other primitives as needed

3. **Verify Radix versions**
   - Check compatibility with React version
   - Ensure latest stable versions
   - Note version in package.json

4. **Understand primitive purpose**
   - Radix provides behavior and accessibility
   - Shadcn adds styling layer
   - Customization happens in components/ui/

5. **Review Radix documentation**
   - Understand component architecture
   - Review accessibility features
   - Note keyboard navigation support

### Installation Strategy

**Option 1: Install as needed**
- Install Radix primitives when installing Shadcn components
- CLI handles dependencies automatically
- Minimal initial installation

**Option 2: Install core primitives upfront**
- Install commonly used primitives proactively
- Reduces per-component installation time
- May install unused packages

### Recommended Approach
Let Shadcn CLI install Radix primitives automatically when adding components. This ensures correct versions and avoids unused packages.

### Core Radix Primitives

| Primitive | Purpose | Used By |
|-----------|---------|---------|
| @radix-ui/react-slot | Composable components | Button, many others |
| @radix-ui/react-dialog | Modal dialogs | Dialog, AlertDialog |
| @radix-ui/react-dropdown-menu | Dropdown menus | DropdownMenu |
| @radix-ui/react-select | Select inputs | Select |
| @radix-ui/react-popover | Popover overlays | Popover, Command |
| @radix-ui/react-tooltip | Tooltips | Tooltip |
| @radix-ui/react-tabs | Tab navigation | Tabs |
| @radix-ui/react-checkbox | Checkboxes | Checkbox |
| @radix-ui/react-radio-group | Radio buttons | RadioGroup |

### Radix Features

| Feature | Benefit |
|---------|---------|
| Unstyled | Full styling control |
| Accessible | ARIA attributes included |
| Composable | Build complex components |
| Keyboard navigation | Built-in support |
| Focus management | Automatic handling |
| Screen reader support | Semantic HTML |

### Installation Command (if manual)

```bash
# Core primitive used by many components
pnpm add @radix-ui/react-slot

# Install others as needed
pnpm add @radix-ui/react-dialog
pnpm add @radix-ui/react-dropdown-menu
```

### LCC Considerations

| Aspect | Consideration |
|--------|---------------|
| Accessibility | Critical for enterprise ERP |
| Keyboard nav | Power users rely on shortcuts |
| Screen readers | Compliance requirement |
| Mobile touch | Radix handles touch events |

### Expected Outcome
- Radix primitives available for components
- Accessibility features built-in
- Ready for Shadcn component installation
- Foundation for custom components

### Verification Checklist
- [ ] @radix-ui/react-slot installed (most important)
- [ ] Other primitives installed as needed
- [ ] Packages in package.json dependencies
- [ ] No installation conflicts
- [ ] Compatible with React version

---

## Task 10: Configure Component Theming

### Overview
Configure component theming by customizing Tailwind CSS variables and Shadcn configuration to match LankaCommerce Cloud brand colors. This ensures consistent visual identity across all components.

### Dependencies
- Task 03 (components.json configured)
- Tailwind CSS configured (SubPhase-02)
- CSS variables in globals.css

### Instructions

1. **Review LCC brand colors**
   - Identify primary brand color
   - Determine secondary/accent colors
   - Note neutral color palette

2. **Open globals.css**
   - Navigate to app/globals.css
   - Locate CSS variable declarations
   - Find :root and .dark sections

3. **Update primary color**
   - Modify --primary HSL values
   - Set LCC brand primary color
   - Adjust --primary-foreground for contrast

4. **Configure secondary colors**
   - Update --secondary variables
   - Set complementary color
   - Ensure sufficient contrast

5. **Adjust accent colors**
   - Update --accent variables
   - Use for highlights and CTAs
   - Maintain visual hierarchy

6. **Configure destructive actions**
   - Set --destructive for delete/remove actions
   - Typically red or warning color
   - Clear visual distinction

7. **Set border and background**
   - Configure --border for outlines
   - Set --background for surfaces
   - Adjust --foreground for text

8. **Configure muted colors**
   - Set --muted for disabled states
   - Adjust --muted-foreground for subtle text
   - Maintain readability

9. **Update dark mode colors**
   - Repeat color configuration for .dark
   - Ensure dark mode color harmony
   - Test contrast in dark theme

10. **Test color application**
    - Install a test component
    - Verify colors apply correctly
    - Check hover and active states

### LCC Brand Colors (Example)

| Color | Purpose | HSL Value (Example) |
|-------|---------|---------------------|
| Primary | Brand main color | 220 70% 50% (Blue) |
| Secondary | Supporting color | 280 60% 50% (Purple) |
| Accent | Highlights, CTAs | 160 60% 45% (Teal) |
| Destructive | Delete, errors | 0 70% 50% (Red) |
| Muted | Disabled, subtle | 220 10% 90% (Light gray) |

### CSS Variable Structure

```
:root
    ├── --background        → Page background
    ├── --foreground        → Primary text
    ├── --primary           → Brand color
    ├── --primary-foreground → Text on primary
    ├── --secondary         → Secondary color
    ├── --secondary-foreground → Text on secondary
    ├── --accent            → Accent color
    ├── --accent-foreground → Text on accent
    ├── --destructive       → Error/delete color
    ├── --destructive-foreground → Text on destructive
    ├── --muted             → Muted backgrounds
    ├── --muted-foreground  → Muted text
    ├── --border            → Border color
    ├── --input             → Input border
    ├── --ring              → Focus ring
    └── --radius            → Border radius
```

### Color Relationships

```
Component States
    ├── Default: background + foreground
    ├── Primary: primary + primary-foreground
    ├── Secondary: secondary + secondary-foreground
    ├── Accent: accent + accent-foreground
    ├── Muted: muted + muted-foreground
    └── Destructive: destructive + destructive-foreground
```

### Contrast Requirements

| Combination | Min Ratio | Standard |
|-------------|-----------|----------|
| Normal text | 4.5:1 | WCAG AA |
| Large text | 3:1 | WCAG AA |
| UI components | 3:1 | WCAG AA |

### Border Radius Configuration

| Value | Size | Use Case |
|-------|------|----------|
| 0.5rem | Default | Most components |
| 0.25rem | Small | Compact elements |
| 0.75rem | Large | Cards, modals |
| 9999px | Full | Pills, badges |

### Theme Customization Points

| Aspect | Variable | Impact |
|--------|----------|--------|
| Button primary | --primary | Main action buttons |
| Links | --primary | Hyperlink color |
| Focus ring | --ring | Keyboard focus indicator |
| Borders | --border | Component outlines |
| Shadows | Tailwind config | Depth and elevation |

### Expected Outcome
- CSS variables updated with LCC colors
- Consistent brand identity in components
- Both light and dark modes configured
- Proper contrast ratios maintained

### Verification Checklist
- [ ] globals.css updated with LCC colors
- [ ] Primary color matches brand
- [ ] Contrast ratios meet WCAG standards
- [ ] Dark mode colors configured
- [ ] Border radius set appropriately
- [ ] Test component displays correct colors

---

## Task 11: Install React Hook Form

### Overview
Install React Hook Form, a performant form library that provides efficient form state management, validation, and submission handling. This will be the primary form handling solution for the ERP dashboard.

### Dependencies
- Task 02 (Project initialized)
- React 18+ installed

### Instructions

1. **Navigate to frontend directory**
   - Open terminal in project root
   - Change to frontend directory
   - Verify package.json exists

2. **Install react-hook-form**
   - Run pnpm add command
   - Install as production dependency
   - Package provides form hooks

3. **Verify installation**
   - Check package.json dependencies
   - Confirm react-hook-form listed
   - Note installed version (should be 7.x)

4. **Review core hooks**
   - useForm: Main form hook
   - useFormContext: Shared form state
   - useController: Controlled inputs
   - useWatch: Watch field values

5. **Understand form patterns**
   - Uncontrolled vs controlled
   - Validation strategies
   - Submission handling

### Installation Command

```bash
pnpm add react-hook-form
```

### React Hook Form Benefits

| Benefit | Description |
|---------|-------------|
| Performance | Minimal re-renders |
| Small bundle | ~30KB gzipped |
| Easy validation | Built-in + schema validation |
| TypeScript support | Full type safety |
| DevTools | Chrome extension available |
| Flexible | Controlled and uncontrolled |

### Core Hooks

| Hook | Purpose | Use Case |
|------|---------|----------|
| useForm | Form initialization | Every form |
| register | Register input | Uncontrolled inputs |
| handleSubmit | Form submission | Submit handler |
| watch | Watch field values | Dependent fields |
| formState | Form state access | Errors, validation |
| control | Controlled components | Custom inputs |

### Form Workflow

```
Form Component
    ├── useForm() initialization
    ├── Register inputs
    ├── Define validation
    ├── Handle submission
    ├── Display errors
    └── Reset on success
```

### LCC Form Requirements

| Requirement | RHF Solution |
|-------------|--------------|
| Large forms | Optimized re-renders |
| Field dependencies | watch(), useWatch() |
| Dynamic fields | useFieldArray() |
| Validation | Zod integration |
| Type safety | TypeScript support |

### Expected Outcome
- react-hook-form package installed
- Available for use in form components
- Foundation for form handling
- Ready for Zod integration

### Verification Checklist
- [ ] react-hook-form in package.json
- [ ] Installation completed successfully
- [ ] Version 7.x or higher
- [ ] Package imports without errors
- [ ] TypeScript types available

---

## Task 12: Install Zod

### Overview
Install Zod, a TypeScript-first schema validation library that provides runtime type checking and validation. Zod will be used to define form schemas and validate user input.

### Dependencies
- Task 11 (React Hook Form installed)
- TypeScript configured

### Instructions

1. **Navigate to frontend directory**
   - Open terminal in frontend directory
   - Ensure package.json exists
   - Ready to install package

2. **Install zod package**
   - Run pnpm add command
   - Install as production dependency
   - Provides schema validation

3. **Verify installation**
   - Check package.json dependencies
   - Confirm zod is listed
   - Note installed version (should be 3.x)

4. **Review Zod features**
   - Schema definition syntax
   - Built-in validators
   - Custom validation
   - Type inference

5. **Understand validation flow**
   - Define schema with Zod
   - Integrate with React Hook Form
   - Validate on submit/change
   - Display validation errors

### Installation Command

```bash
pnpm add zod
```

### Zod Features

| Feature | Description |
|---------|-------------|
| TypeScript-first | Infers static types |
| Composable | Build complex schemas |
| Async validation | Server-side checks |
| Custom messages | User-friendly errors |
| Transformations | Parse and coerce |
| Optional/nullable | Flexible validation |

### Common Validators

| Validator | Purpose | Example |
|-----------|---------|---------|
| z.string() | String validation | Email, name |
| z.number() | Number validation | Price, quantity |
| z.boolean() | Boolean check | Checkbox |
| z.date() | Date validation | Date picker |
| z.enum() | Enumerated values | Status, type |
| z.array() | Array validation | Tags, items |
| z.object() | Object validation | Nested forms |

### Validation Chain Example

```
Schema Definition
    ├── Define field types
    ├── Add constraints (min, max, regex)
    ├── Add custom validation
    ├── Define error messages
    └── Export schema type
```

### LCC Validation Needs

| Use Case | Zod Solution |
|----------|--------------|
| Email validation | z.string().email() |
| Phone format | z.string().regex() |
| Price validation | z.number().positive() |
| Required fields | z.string().min(1) |
| Custom rules | z.string().refine() |
| Nested objects | z.object() |

### Schema Composition

```
Base Schema
    ├── Common fields
    ├── Extend for variants
    ├── Reuse across forms
    └── Type inference
```

### Expected Outcome
- Zod package installed
- Schema validation available
- Type inference working
- Ready for resolver integration

### Verification Checklist
- [ ] zod in package.json
- [ ] Installation completed successfully
- [ ] Version 3.x or higher
- [ ] Package imports without errors
- [ ] TypeScript integration works

---

## Task 13: Install @hookform/resolvers

### Overview
Install @hookform/resolvers package that provides integration between React Hook Form and validation libraries like Zod. This enables seamless schema-based validation in forms.

### Dependencies
- Task 11 (React Hook Form installed)
- Task 12 (Zod installed)

### Instructions

1. **Navigate to frontend directory**
   - Open terminal in frontend directory
   - Verify both RHF and Zod installed
   - Ready for resolver package

2. **Install @hookform/resolvers**
   - Run pnpm add command
   - Install as production dependency
   - Provides validation integration

3. **Verify installation**
   - Check package.json dependencies
   - Confirm @hookform/resolvers listed
   - Note installed version

4. **Import zodResolver**
   - Import { zodResolver } from package
   - Use in useForm hook
   - Connect Zod schema to form

5. **Test integration**
   - Create simple test form
   - Define Zod schema
   - Apply zodResolver
   - Verify validation works

### Installation Command

```bash
pnpm add @hookform/resolvers
```

### Resolver Purpose

| Aspect | Purpose |
|--------|---------|
| Bridge | Connects RHF to validation libraries |
| zodResolver | Zod-specific integration |
| Validation | Applies schema on submit/change |
| Error mapping | Converts Zod errors to RHF format |
| Type safety | Maintains TypeScript types |

### Available Resolvers

| Resolver | Library | Use Case |
|----------|---------|----------|
| zodResolver | Zod | TypeScript-first schemas |
| yupResolver | Yup | Legacy projects |
| joiResolver | Joi | Node.js schemas |
| ajvResolver | AJV | JSON Schema |

### Integration Pattern

```
Form Setup
    ├── Define Zod schema
    ├── Import zodResolver
    ├── Pass to useForm({ resolver })
    ├── Register inputs
    └── Errors auto-populated
```

### Usage Flow

```
1. Define Schema
   const schema = z.object({ ... })

2. Create Form
   const form = useForm({
     resolver: zodResolver(schema)
   })

3. Validation Happens
   - On submit (default)
   - On change (if configured)
   - On blur (if configured)

4. Errors Available
   form.formState.errors
```

### LCC Form Integration

| Component | Integration |
|-----------|-------------|
| LoginForm | Zod + zodResolver |
| ProductForm | Zod + zodResolver |
| CustomerForm | Zod + zodResolver |
| OrderForm | Zod + zodResolver |

### Validation Modes

| Mode | When Validates | Use Case |
|------|----------------|----------|
| onSubmit | On form submit | Default, least intrusive |
| onBlur | When field loses focus | Immediate feedback |
| onChange | On every keystroke | Real-time validation |
| all | Both blur and submit | Comprehensive checking |

### Expected Outcome
- @hookform/resolvers package installed
- zodResolver available for import
- Forms can use Zod schemas
- Validation integrated seamlessly

### Verification Checklist
- [ ] @hookform/resolvers in package.json
- [ ] Installation completed successfully
- [ ] zodResolver imports correctly
- [ ] Compatible with RHF and Zod versions
- [ ] Test integration works

---

## Task 14: Verify Shadcn/UI Setup

### Overview
Perform comprehensive verification of the entire Shadcn/UI setup by installing a test component, creating a test page, and confirming all integrations work correctly. This ensures the foundation is solid before building custom components.

### Dependencies
- All previous tasks (01-13) completed
- Project can run in development mode

### Instructions

1. **Install test component**
   - Choose Button component for testing
   - Run shadcn add command
   - Verify component installation

2. **Review installed files**
   - Check components/ui/button.tsx exists
   - Review component code structure
   - Note usage of cn(), cva, Radix

3. **Create test page**
   - Create app/test/page.tsx
   - Import Button component
   - Add multiple button variants

4. **Test button variants**
   - Render default button
   - Test variant prop (primary, secondary, outline)
   - Test size prop (sm, md, lg)
   - Test disabled state

5. **Test custom styling**
   - Add className prop to button
   - Verify cn() merges classes correctly
   - Confirm Tailwind classes apply

6. **Verify icon integration**
   - Import Icon component
   - Add icons to buttons
   - Test icon sizes and positioning

7. **Test form integration**
   - Create simple form with useForm
   - Add Button with type="submit"
   - Define Zod schema
   - Test form submission and validation

8. **Verify theming**
   - Check button uses theme colors
   - Test in light and dark modes
   - Confirm LCC colors apply

9. **Run development server**
   - Start dev server with pnpm dev
   - Navigate to /test page
   - Verify no console errors

10. **Test responsiveness**
    - View page in different screen sizes
    - Check mobile rendering
    - Verify touch interactions

11. **Check accessibility**
    - Test keyboard navigation
    - Verify focus indicators
    - Check ARIA attributes

12. **Clean up test files**
    - Remove test page if desired
    - Keep Button component installed
    - Document successful setup

### Installation Command for Test Component

```bash
pnpx shadcn-ui@latest add button
```

### Test Page Structure

```
app/test/page.tsx
    ├── Import Button from @/components/ui/button
    ├── Import Icon from @/components/ui/icon
    ├── Define test form with useForm
    ├── Render button variants
    ├── Test form submission
    └── Display validation errors
```

### Test Checklist

| Test | Expected Result | Status |
|------|-----------------|--------|
| Button renders | Visible on page | □ |
| Variants work | Different styles | □ |
| Sizes apply | Correct dimensions | □ |
| Icons display | Icons visible | □ |
| Form submits | Handler fires | □ |
| Validation works | Errors display | □ |
| Theme applies | LCC colors used | □ |
| Responsive | Works on mobile | □ |
| Accessible | Keyboard navigable | □ |

### Verification Points

```
Setup Verification
    ├── Component Installation
    │   ├── CLI adds component successfully
    │   ├── File created in components/ui/
    │   └── Dependencies auto-installed
    ├── Styling Integration
    │   ├── Tailwind classes apply
    │   ├── Theme colors used
    │   └── cn() merges classes
    ├── Icon Integration
    │   ├── Lucide icons render
    │   ├── Icon wrapper works
    │   └── Sizes apply correctly
    ├── Form Integration
    │   ├── useForm hook works
    │   ├── Zod validation runs
    │   └── Errors display properly
    └── Overall Quality
        ├── TypeScript compiles
        ├── No console errors
        └── Performance good
```

### Common Issues and Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Component not found | Path alias issue | Check tsconfig.json paths |
| Style not applying | CSS import missing | Import globals.css in layout |
| Validation not working | Resolver not passed | Add zodResolver to useForm |
| Icons not showing | Import path wrong | Use @/components/ui/icon |
| Type errors | Versions mismatch | Align package versions |

### Expected Outcome
- Test component installed successfully
- All variants render correctly
- Form validation works
- Icons integrate seamlessly
- Theme colors apply
- No errors in console
- Setup verified and ready for production

### Verification Checklist
- [ ] Button component installed via CLI
- [ ] Test page created and accessible
- [ ] All button variants render correctly
- [ ] Custom className prop works
- [ ] Icon component integrates successfully
- [ ] Form with validation works
- [ ] Theme colors visible on components
- [ ] Dark mode theme applies correctly
- [ ] Responsive on mobile devices
- [ ] Keyboard navigation works
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Development server runs smoothly

---

## Summary

This document covered Radix UI primitives installation, component theming configuration with LCC brand colors, form handling setup with React Hook Form and Zod validation, and comprehensive setup verification. The Shadcn/UI foundation is now complete and ready for component installation.

### Completed Tasks
✓ Task 09: Radix UI primitives installed  
✓ Task 10: Component theming configured with LCC colors  
✓ Task 11: React Hook Form installed  
✓ Task 12: Zod validation library installed  
✓ Task 13: @hookform/resolvers installed  
✓ Task 14: Complete setup verified with test component

### Key Deliverables
- Radix UI primitives available
- Theme configured with LCC brand colors
- Form handling stack complete (RHF + Zod + resolvers)
- Test component verified working
- Foundation ready for primitive components

### Integration Complete
The Shadcn/UI setup is now complete with:
- Component library infrastructure
- Utility functions and helpers
- Icon system with Lucide React
- Radix UI primitives for accessibility
- Theme customization with LCC colors
- Form handling with validation
- Verified working setup

### Next Steps
Proceed to Group-B_Primitive-Components to install and configure basic UI components including Button, Input, Checkbox, Radio Group, Switch, Textarea, Label, Badge, Avatar, and Skeleton components.
