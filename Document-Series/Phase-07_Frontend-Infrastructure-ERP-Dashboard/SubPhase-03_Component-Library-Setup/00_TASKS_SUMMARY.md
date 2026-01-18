# SubPhase 03: Component Library Setup - Tasks Summary

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase Index:** 03 of 14  
> **SubPhase Goal:** Set up Shadcn/UI component library with custom theming and create reusable ERP-specific components  
> **Total Tasks:** 92 | **Status:** Planning  
> **Estimated Duration:** 10-12 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-02_Tailwind-Design-System](../SubPhase-02_Tailwind-Design-System/)
- **→ Next SubPhase:** [SubPhase-04_API-Client-Layer](../SubPhase-04_API-Client-Layer/)

---

## SubPhase Overview

This sub-phase establishes the component library for LankaCommerce Cloud's frontend using Shadcn/UI as the foundation. It includes base UI components, form elements, data display components, feedback components, and ERP-specific composite components.

### Key Outcomes
- Shadcn/UI initialized and configured
- Base UI components installed and customized
- Form components with validation support
- Data table with sorting, filtering, pagination
- Modal, drawer, and dialog components
- Toast notification system
- Loading and empty state components
- ERP-specific composite components

### Technology Context
- **Component Library:** Shadcn/UI (Radix UI primitives)
- **Form Handling:** React Hook Form + Zod
- **Icons:** Lucide React
- **Animation:** Framer Motion (for advanced animations)
- **Utilities:** clsx, tailwind-merge for class management

### Component Categories
- **Primitives:** Button, Input, Select, Checkbox, Radio
- **Layout:** Card, Separator, Tabs, Accordion
- **Overlay:** Modal, Drawer, Dropdown, Popover, Tooltip
- **Data Display:** Table, Badge, Avatar, DataList
- **Feedback:** Toast, Alert, Progress, Skeleton
- **Composite:** DataTable, FormField, PageHeader, EmptyState

---

## Task Execution Order

```
TASK GROUP A: Shadcn/UI Installation & Configuration (Tasks 01-14)
        │
        ▼
TASK GROUP B: Primitive Components (Tasks 15-32)
        │
        ▼
TASK GROUP C: Form Components (Tasks 33-48)
        │
        ▼
TASK GROUP D: Layout & Overlay Components (Tasks 49-64)
        │
        ▼
TASK GROUP E: Data Display & Feedback Components (Tasks 65-80)
        │
        ▼
TASK GROUP F: Composite Components & Documentation (Tasks 81-92)
```

---

## Task Index

### Group A: Shadcn/UI Installation & Configuration (Tasks 01-14)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Install Shadcn/UI CLI** | Add shadcn-ui CLI as dev dependency | SubPhase-02 | 🔴 Not Created |
| 02 | **Initialize Shadcn/UI** | Run npx shadcn-ui@latest init with project config | Task 01 | 🔴 Not Created |
| 03 | **Configure components.json** | Set up style, tailwind config, aliases, RSC flag | Task 02 | 🔴 Not Created |
| 04 | **Create components/ui Directory** | Set up base UI components directory structure | Task 02 | 🔴 Not Created |
| 05 | **Install Utility Dependencies** | Add clsx, tailwind-merge, class-variance-authority | Task 02 | 🔴 Not Created |
| 06 | **Create cn Utility Function** | Set up lib/utils.ts with cn() class merge helper | Task 05 | 🔴 Not Created |
| 07 | **Install Lucide Icons** | Add lucide-react icon library | Task 02 | 🔴 Not Created |
| 08 | **Create Icon Component Wrapper** | Create reusable Icon component with size variants | Task 07 | 🔴 Not Created |
| 09 | **Install Radix UI Primitives** | Add core Radix UI packages as peer dependencies | Task 02 | 🔴 Not Created |
| 10 | **Configure Component Theming** | Extend Shadcn theme with LCC brand colors | Task 03 | 🔴 Not Created |
| 11 | **Install React Hook Form** | Add react-hook-form for form handling | Task 02 | 🔴 Not Created |
| 12 | **Install Zod** | Add zod for schema validation | Task 11 | 🔴 Not Created |
| 13 | **Install @hookform/resolvers** | Add Zod resolver for React Hook Form | Task 12 | 🔴 Not Created |
| 14 | **Verify Shadcn/UI Setup** | Test that component installation works | Task 03 | 🔴 Not Created |

---

### Group B: Primitive Components (Tasks 15-32)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 15 | **Install Button Component** | Add Shadcn Button with variants (default, destructive, outline, secondary, ghost, link) | Task 14 | 🔴 Not Created |
| 16 | **Customize Button Variants** | Add loading state, icon-only, size variants | Task 15 | 🔴 Not Created |
| 17 | **Create Button Group Component** | Create ButtonGroup for grouped actions | Task 15 | 🔴 Not Created |
| 18 | **Install Input Component** | Add Shadcn Input with validation states | Task 14 | 🔴 Not Created |
| 19 | **Customize Input Variants** | Add icon prefix/suffix, clearable, size variants | Task 18 | 🔴 Not Created |
| 20 | **Install Textarea Component** | Add Shadcn Textarea with auto-resize option | Task 14 | 🔴 Not Created |
| 21 | **Install Select Component** | Add Shadcn Select with search and multi-select | Task 14 | 🔴 Not Created |
| 22 | **Customize Select Component** | Add async loading, create option support | Task 21 | 🔴 Not Created |
| 23 | **Install Checkbox Component** | Add Shadcn Checkbox with indeterminate state | Task 14 | 🔴 Not Created |
| 24 | **Install Radio Group Component** | Add Shadcn RadioGroup with card variant | Task 14 | 🔴 Not Created |
| 25 | **Install Switch Component** | Add Shadcn Switch toggle component | Task 14 | 🔴 Not Created |
| 26 | **Install Label Component** | Add Shadcn Label for form fields | Task 14 | 🔴 Not Created |
| 27 | **Install Badge Component** | Add Shadcn Badge with color variants | Task 14 | 🔴 Not Created |
| 28 | **Customize Badge Variants** | Add status colors (pending, confirmed, shipped, etc.) | Task 27 | 🔴 Not Created |
| 29 | **Install Avatar Component** | Add Shadcn Avatar with fallback initials | Task 14 | 🔴 Not Created |
| 30 | **Create Avatar Group Component** | Create AvatarGroup for stacked avatars | Task 29 | 🔴 Not Created |
| 31 | **Install Separator Component** | Add Shadcn Separator (horizontal/vertical) | Task 14 | 🔴 Not Created |
| 32 | **Install Slider Component** | Add Shadcn Slider for range inputs | Task 14 | 🔴 Not Created |

---

### Group C: Form Components (Tasks 33-48)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 33 | **Install Form Component** | Add Shadcn Form wrapper for React Hook Form | Task 13 | 🔴 Not Created |
| 34 | **Create FormField Component** | Create reusable FormField with label, input, error | Task 33 | 🔴 Not Created |
| 35 | **Create FormSection Component** | Create form section grouping with title | Task 33 | 🔴 Not Created |
| 36 | **Create FormActions Component** | Create form submit/cancel button group | Task 33 | 🔴 Not Created |
| 37 | **Install Calendar Component** | Add Shadcn Calendar for date picking | Task 14 | 🔴 Not Created |
| 38 | **Install DatePicker Component** | Add Shadcn DatePicker with input | Task 37 | 🔴 Not Created |
| 39 | **Create DateRangePicker Component** | Create date range picker for reports | Task 38 | 🔴 Not Created |
| 40 | **Create MoneyInput Component** | Create currency input with LKR formatting | Task 18 | 🔴 Not Created |
| 41 | **Create PhoneInput Component** | Create phone input with +94 country code | Task 18 | 🔴 Not Created |
| 42 | **Create SearchInput Component** | Create search input with debounce | Task 18 | 🔴 Not Created |
| 43 | **Create PasswordInput Component** | Create password input with show/hide toggle | Task 18 | 🔴 Not Created |
| 44 | **Create FileUpload Component** | Create file upload with drag-drop support | Task 14 | 🔴 Not Created |
| 45 | **Create ImageUpload Component** | Create image upload with preview and crop | Task 44 | 🔴 Not Created |
| 46 | **Create MultiSelect Component** | Create multi-select with tags display | Task 21 | 🔴 Not Created |
| 47 | **Create Combobox Component** | Create combobox with async search | Task 21 | 🔴 Not Created |
| 48 | **Create NumberInput Component** | Create number input with increment/decrement | Task 18 | 🔴 Not Created |

---

### Group D: Layout & Overlay Components (Tasks 49-64)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 49 | **Install Card Component** | Add Shadcn Card with header, content, footer slots | Task 14 | 🔴 Not Created |
| 50 | **Create StatCard Component** | Create stat card for dashboard KPIs | Task 49 | 🔴 Not Created |
| 51 | **Install Tabs Component** | Add Shadcn Tabs with variants | Task 14 | 🔴 Not Created |
| 52 | **Customize Tabs Variants** | Add underline, pills, enclosed variants | Task 51 | 🔴 Not Created |
| 53 | **Install Accordion Component** | Add Shadcn Accordion for collapsible sections | Task 14 | 🔴 Not Created |
| 54 | **Install Dialog Component** | Add Shadcn Dialog (modal) component | Task 14 | 🔴 Not Created |
| 55 | **Create ConfirmDialog Component** | Create confirmation dialog for destructive actions | Task 54 | 🔴 Not Created |
| 56 | **Create FormDialog Component** | Create dialog wrapper for form modals | Task 54 | 🔴 Not Created |
| 57 | **Install Sheet Component** | Add Shadcn Sheet (drawer) component | Task 14 | 🔴 Not Created |
| 58 | **Create SidePanel Component** | Create right-side panel for detail views | Task 57 | 🔴 Not Created |
| 59 | **Install Dropdown Menu Component** | Add Shadcn DropdownMenu with sub-menus | Task 14 | 🔴 Not Created |
| 60 | **Install Context Menu Component** | Add Shadcn ContextMenu for right-click | Task 14 | 🔴 Not Created |
| 61 | **Install Popover Component** | Add Shadcn Popover for floating content | Task 14 | 🔴 Not Created |
| 62 | **Install Tooltip Component** | Add Shadcn Tooltip for hover hints | Task 14 | 🔴 Not Created |
| 63 | **Install Command Component** | Add Shadcn Command for command palette | Task 14 | 🔴 Not Created |
| 64 | **Create CommandPalette Component** | Create global command palette with keyboard shortcut | Task 63 | 🔴 Not Created |

---

### Group E: Data Display & Feedback Components (Tasks 65-80)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 65 | **Install Table Component** | Add Shadcn Table with header, body, footer | Task 14 | 🔴 Not Created |
| 66 | **Create DataTable Component** | Create data table with sorting, filtering, pagination | Task 65 | 🔴 Not Created |
| 67 | **Create TablePagination Component** | Create pagination controls for data tables | Task 66 | 🔴 Not Created |
| 68 | **Create TableToolbar Component** | Create toolbar with search, filters, bulk actions | Task 66 | 🔴 Not Created |
| 69 | **Create TableColumnToggle Component** | Create column visibility toggle | Task 66 | 🔴 Not Created |
| 70 | **Install Skeleton Component** | Add Shadcn Skeleton for loading states | Task 14 | 🔴 Not Created |
| 71 | **Create TableSkeleton Component** | Create skeleton for table loading state | Task 70 | 🔴 Not Created |
| 72 | **Create CardSkeleton Component** | Create skeleton for card loading state | Task 70 | 🔴 Not Created |
| 73 | **Install Alert Component** | Add Shadcn Alert with variants | Task 14 | 🔴 Not Created |
| 74 | **Install Progress Component** | Add Shadcn Progress bar | Task 14 | 🔴 Not Created |
| 75 | **Install Toast Component** | Add Shadcn Toast notification system | Task 14 | 🔴 Not Created |
| 76 | **Create Toaster Provider** | Set up toast provider in root layout | Task 75 | 🔴 Not Created |
| 77 | **Create useToast Hook** | Create typed toast hook for notifications | Task 75 | 🔴 Not Created |
| 78 | **Create EmptyState Component** | Create empty state with icon, title, description, action | Task 49 | 🔴 Not Created |
| 79 | **Create ErrorState Component** | Create error state for failed data fetches | Task 78 | 🔴 Not Created |
| 80 | **Create LoadingState Component** | Create full-page loading state | Task 70 | 🔴 Not Created |

---

### Group F: Composite Components & Documentation (Tasks 81-92)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 81 | **Create PageHeader Component** | Create page header with title, breadcrumb, actions | Task 49 | 🔴 Not Created |
| 82 | **Create PageContainer Component** | Create consistent page layout container | Task 81 | 🔴 Not Created |
| 83 | **Create Breadcrumb Component** | Create breadcrumb navigation component | Task 14 | 🔴 Not Created |
| 84 | **Create DescriptionList Component** | Create key-value display for detail views | Task 14 | 🔴 Not Created |
| 85 | **Create Timeline Component** | Create timeline for activity/history display | Task 14 | 🔴 Not Created |
| 86 | **Create StatusIndicator Component** | Create status dot/badge for record states | Task 27 | 🔴 Not Created |
| 87 | **Create CopyButton Component** | Create button to copy text to clipboard | Task 15 | 🔴 Not Created |
| 88 | **Create ExportButton Component** | Create button with export format options | Task 59 | 🔴 Not Created |
| 89 | **Create Component Index File** | Create index.ts exporting all components | Task 88 | 🔴 Not Created |
| 90 | **Create Component Storybook Setup** | Set up Storybook for component documentation | Task 89 | 🔴 Not Created |
| 91 | **Create Component Usage Documentation** | Document each component's props and usage | Task 90 | 🔴 Not Created |
| 92 | **Final Verification & Testing** | Test all components, verify theme consistency | Task 91 | 🔴 Not Created |

---

## Expected Final Structure

```
frontend/
├── components/
│   ├── ui/
│   │   ├── accordion.tsx
│   │   ├── alert.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── calendar.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── command.tsx
│   │   ├── context-menu.tsx
│   │   ├── data-table.tsx
│   │   ├── date-picker.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── popover.tsx
│   │   ├── progress.tsx
│   │   ├── radio-group.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── skeleton.tsx
│   │   ├── slider.tsx
│   │   ├── switch.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   ├── toast.tsx
│   │   ├── toaster.tsx
│   │   ├── tooltip.tsx
│   │   └── index.ts
│   └── composite/
│       ├── avatar-group.tsx
│       ├── breadcrumb.tsx
│       ├── button-group.tsx
│       ├── combobox.tsx
│       ├── command-palette.tsx
│       ├── confirm-dialog.tsx
│       ├── copy-button.tsx
│       ├── data-table/
│       │   ├── data-table.tsx
│       │   ├── pagination.tsx
│       │   ├── toolbar.tsx
│       │   └── column-toggle.tsx
│       ├── date-range-picker.tsx
│       ├── description-list.tsx
│       ├── empty-state.tsx
│       ├── error-state.tsx
│       ├── export-button.tsx
│       ├── file-upload.tsx
│       ├── form-dialog.tsx
│       ├── form-field.tsx
│       ├── form-section.tsx
│       ├── image-upload.tsx
│       ├── loading-state.tsx
│       ├── money-input.tsx
│       ├── multi-select.tsx
│       ├── number-input.tsx
│       ├── page-container.tsx
│       ├── page-header.tsx
│       ├── password-input.tsx
│       ├── phone-input.tsx
│       ├── search-input.tsx
│       ├── side-panel.tsx
│       ├── stat-card.tsx
│       ├── status-indicator.tsx
│       ├── timeline.tsx
│       └── index.ts
├── hooks/
│   └── use-toast.ts
├── lib/
│   └── utils.ts
└── components.json
```

---

## Component Variant Summary

### Button Variants
- **default:** Primary blue button
- **destructive:** Red for delete actions
- **outline:** Bordered button
- **secondary:** Gray secondary action
- **ghost:** No background
- **link:** Text link style
- **Sizes:** sm, default, lg, icon

### Badge Variants
- **default:** Gray neutral
- **primary:** Blue primary
- **success:** Green for positive status
- **warning:** Amber for caution
- **destructive:** Red for errors
- **outline:** Bordered style

### Status Colors (Custom)
- **draft:** Gray
- **pending:** Yellow
- **confirmed:** Blue
- **processing:** Purple
- **shipped:** Cyan
- **delivered:** Green
- **cancelled:** Red
- **refunded:** Orange

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 92 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 92 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Notes for AI Agents

1. **Execution Order:** Tasks must be executed in numerical order within each group
2. **Shadcn Installation:** Use npx shadcn-ui@latest add [component] to install individual components
3. **Customization:** After installing, customize components in components/ui/ directory
4. **Composite Components:** Build composite components by combining Shadcn primitives
5. **Form Integration:** All form components should integrate with React Hook Form
6. **Validation:** Use Zod schemas for form validation
7. **Accessibility:** Maintain Radix UI's built-in accessibility features
8. **Theming:** Use CSS variables for theming to support dark mode
9. **Dependencies:** This sub-phase depends on SubPhase-02 (Tailwind & Design System) completion
10. **No Code Snippets in Tasks:** Individual task documents should focus on descriptions, not implementation code
11. **Sri Lanka Context:** MoneyInput should default to LKR, PhoneInput to +94 prefix
12. **Testing:** Each component should be tested in isolation before integration
