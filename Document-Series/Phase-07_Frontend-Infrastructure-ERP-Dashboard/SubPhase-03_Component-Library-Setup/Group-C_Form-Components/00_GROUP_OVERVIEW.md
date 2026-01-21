# Group C: Form Components

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 03 - Component Library Setup  
> **Group:** C of F  
> **Tasks Covered:** 33-48  
> **Group Goal:** Create form components with React Hook Form integration and specialized inputs

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Primitive-Components](../Group-B_Primitive-Components/)
- **→ Next Group:** [Group-D_Layout-Overlay-Components](../Group-D_Layout-Overlay-Components/)

---

## Group Overview

This group creates comprehensive form components with React Hook Form integration. Installs the Shadcn Form wrapper and creates FormField, FormSection, and FormActions components for consistent form layouts. Adds Calendar and DatePicker components with a DateRangePicker for report filtering. Creates specialized inputs for Sri Lankan context: MoneyInput (LKR formatting), PhoneInput (+94 prefix), and others like SearchInput, PasswordInput, FileUpload, ImageUpload, MultiSelect, Combobox, and NumberInput.

### Key Outcomes

- Form component wrapper installed
- FormField with label, input, error
- FormSection for grouping
- FormActions for submit/cancel
- Calendar component
- DatePicker with input
- DateRangePicker for reports
- MoneyInput with LKR formatting
- PhoneInput with +94 country code
- SearchInput with debounce
- PasswordInput with show/hide
- FileUpload with drag-drop
- ImageUpload with preview and crop
- MultiSelect with tags
- Combobox with async search
- NumberInput with increment/decrement

### Technology Context

- **Form State:** React Hook Form
- **Validation:** Zod schemas
- **Date Handling:** date-fns
- **File Uploads:** Native File API
- **Currency:** Intl.NumberFormat (LKR)

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-33-40_Form-Date-Money.md` | Create Form components, date pickers, and money input | 33-40 |
| 02 | `02_Tasks-41-48_Specialized-Inputs.md` | Create specialized inputs (phone, search, file, etc.) | 41-48 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 33 | Install Form Component | Medium | Task 13 |
| 34 | Create FormField Component | Medium | Task 33 |
| 35 | Create FormSection Component | Low | Task 33 |
| 36 | Create FormActions Component | Low | Task 33 |
| 37 | Install Calendar Component | Low | Task 14 |
| 38 | Install DatePicker Component | Low | Task 37 |
| 39 | Create DateRangePicker Component | Medium | Task 38 |
| 40 | Create MoneyInput Component | Medium | Task 18 |
| 41 | Create PhoneInput Component | Low | Task 18 |
| 42 | Create SearchInput Component | Low | Task 18 |
| 43 | Create PasswordInput Component | Low | Task 18 |
| 44 | Create FileUpload Component | Medium | Task 14 |
| 45 | Create ImageUpload Component | Medium | Task 44 |
| 46 | Create MultiSelect Component | Medium | Task 21 |
| 47 | Create Combobox Component | Medium | Task 21 |
| 48 | Create NumberInput Component | Low | Task 18 |

---

## Execution Order

```
Task 33: Install Form Component
    │
    ├──────────────────────┬──────────────────────┐
    ▼                      ▼                      ▼
Task 34               Task 35               Task 36
(FormField)           (FormSection)         (FormActions)
    │                      │                      │
    └──────────────────────┴──────────────────────┘
                           │
                           ▼
                      Task 37: Calendar
                           │
                           ▼
                      Task 38: DatePicker
                           │
                           ▼
                      Task 39: DateRangePicker
                           │
                           ▼
                      Task 40: MoneyInput
                           │
                           ├──────────────────────┬───────────┐
                           ▼                      ▼           ▼
                      Tasks 41-43            Tasks 44-45  Tasks 46-48
                      (phone, search, pass)  (file, image)(multi, combo, number)
```

---

## Expected Deliverables

```
frontend/components/ui/
├── calendar.tsx
├── form.tsx
└── ...

frontend/components/composite/
├── form-field.tsx
├── form-section.tsx
├── form-actions.tsx
├── date-picker.tsx
├── date-range-picker.tsx
├── money-input.tsx
├── phone-input.tsx
├── search-input.tsx
├── password-input.tsx
├── file-upload.tsx
├── image-upload.tsx
├── multi-select.tsx
├── combobox.tsx
└── number-input.tsx
```

---

## Notes for AI Agents

### FormField Props
- name: Field name (register key)
- label: Field label text
- description: Helper text
- error: Error message
- required: Required indicator
- children: Input component

### FormSection Props
- title: Section heading
- description: Section description
- children: FormField components
- collapsible: Optional collapse

### FormActions Props
- submitText: Submit button label
- cancelText: Cancel button label
- onCancel: Cancel handler
- isSubmitting: Loading state
- isDisabled: Disable state

### DateRangePicker Props
- from: Start date
- to: End date
- onSelect: Selection handler
- presets: Quick select options

### MoneyInput Features
- LKR currency format
- Thousand separators
- 2 decimal places
- Right-aligned
- Prefix "Rs."

### PhoneInput Features
- +94 prefix
- Mobile format validation
- Auto-hyphen insertion
- Max 10 digits

### FileUpload Features
- Drag and drop zone
- File type validation
- Size limit
- Progress indicator
- Multiple files support

### ImageUpload Features
- Drag and drop
- Preview thumbnail
- Crop functionality
- Aspect ratio lock
- Size optimization
