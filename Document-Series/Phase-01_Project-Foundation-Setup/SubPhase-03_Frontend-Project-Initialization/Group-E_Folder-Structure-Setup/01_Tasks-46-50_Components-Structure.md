# Tasks 46-50: Components Structure

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 03 - Frontend Project Initialization  
> **Group:** E - Folder Structure Setup  
> **Document:** 01 of 03  
> **Tasks Covered:** 46, 47, 48, 49, 50

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-D_Tailwind-CSS-Setup/03_Tasks-42-45_Global-Styles.md](../Group-D_Tailwind-CSS-Setup/03_Tasks-42-45_Global-Styles.md)
- **→ Next Document:** [02_Tasks-51-56_Lib-Hooks-Stores.md](02_Tasks-51-56_Lib-Hooks-Stores.md)

---

## Document Overview

This document covers creating the components directory structure with subdirectories for UI primitives, layout components, form elements, and common shared components.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 46 | Create components/ Directory | Simple |
| 47 | Create components/ui/ Directory | Simple |
| 48 | Create components/layout/ Directory | Simple |
| 49 | Create components/forms/ Directory | Simple |
| 50 | Create components/common/ Directory | Simple |

---

## Task 46: Create components/ Directory

### Overview
Create the root components directory following atomic design principles.

### Dependencies
- Task 14: Create App Layout

### Instructions

1. **Create components directory**
   - Create in src/ folder

2. **Add index.ts barrel export**
   - Export all component categories

3. **Document structure pattern**
   - Atomic design levels

### File Location

```
frontend/
└── src/
    └── components/
        └── index.ts
```

### Atomic Design Pattern

| Level | Directory | Purpose | Examples |
|-------|-----------|---------|----------|
| Atoms | ui/ | Primitives | Button, Input, Badge |
| Molecules | forms/ | Form combos | FormField, Select |
| Organisms | layout/ | Sections | Header, Sidebar |
| Templates | common/ | Shared | Logo, Avatar |

### Barrel Export Pattern

```typescript
// components/index.ts
export * from './ui'
export * from './layout'
export * from './forms'
export * from './common'
```

### Component File Pattern

Each component follows:
```
ComponentName/
├── ComponentName.tsx
├── ComponentName.test.tsx
├── ComponentName.stories.tsx
└── index.ts
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Folder | PascalCase | Button/ |
| File | PascalCase | Button.tsx |
| Export | Named | export { Button } |

### Expected Outcome
- components/ directory exists
- index.ts barrel export ready

### Verification Checklist
- [ ] Directory created at src/components/
- [ ] index.ts file created
- [ ] Structure documented

---

## Task 47: Create components/ui/ Directory

### Overview
Create the UI primitives directory for base-level components.

### Dependencies
- Task 46: Create components/ Directory

### Instructions

1. **Create ui directory**
   - Create in components/

2. **Add index.ts barrel**
   - Export all UI components

3. **Create placeholder components**
   - Button component stub

### File Location

```
frontend/
└── src/
    └── components/
        └── ui/
            └── index.ts
```

### UI Components Planned

| Component | Purpose | Priority |
|-----------|---------|----------|
| Button | Actions, links | High |
| Input | Text input | High |
| Card | Containers | High |
| Badge | Labels, status | Medium |
| Avatar | User images | Medium |
| Tooltip | Help text | Medium |
| Dialog | Modals | High |
| Dropdown | Menus | High |
| Tabs | Navigation | Medium |
| Table | Data display | High |

### Initial index.ts

```typescript
// components/ui/index.ts
// Export UI components as they are created

// export { Button } from './Button'
// export { Input } from './Input'
// export { Card } from './Card'
```

### Shadcn/UI Integration

Will integrate shadcn/ui components:
- CLI-based installation
- Fully customizable
- Tailwind-based

### Expected Outcome
- ui/ directory exists
- Ready for components

### Verification Checklist
- [ ] Directory created at components/ui/
- [ ] index.ts file created
- [ ] Comment placeholders

---

## Task 48: Create components/layout/ Directory

### Overview
Create the layout components directory for page structure elements.

### Dependencies
- Task 46: Create components/ Directory

### Instructions

1. **Create layout directory**
   - Create in components/

2. **Add index.ts barrel**
   - Export all layout components

3. **Plan layout components**
   - Header, Sidebar, Footer

### File Location

```
frontend/
└── src/
    └── components/
        └── layout/
            └── index.ts
```

### Layout Components Planned

| Component | Purpose | Platforms |
|-----------|---------|-----------|
| Header | Top navigation | All |
| Sidebar | Side navigation | ERP, Admin |
| Footer | Page footer | Webstore |
| Container | Content wrapper | All |
| PageHeader | Page titles | ERP |
| Breadcrumb | Navigation path | ERP, Admin |
| MainLayout | App shell | All |
| DashboardLayout | ERP layout | ERP |

### Initial index.ts

```typescript
// components/layout/index.ts
// Export layout components as they are created

// export { Header } from './Header'
// export { Sidebar } from './Sidebar'
// export { Footer } from './Footer'
// export { Container } from './Container'
```

### Layout Patterns

| Pattern | Use Case |
|---------|----------|
| Dashboard | ERP admin with sidebar |
| Store | Webstore with header/footer |
| Minimal | Auth pages |
| POS | Fullscreen point of sale |

### Expected Outcome
- layout/ directory exists
- Ready for layout components

### Verification Checklist
- [ ] Directory created at components/layout/
- [ ] index.ts file created
- [ ] Components planned

---

## Task 49: Create components/forms/ Directory

### Overview
Create the forms directory for form-specific components.

### Dependencies
- Task 46: Create components/ Directory

### Instructions

1. **Create forms directory**
   - Create in components/

2. **Add index.ts barrel**
   - Export all form components

3. **Plan form components**
   - Field wrappers, inputs

### File Location

```
frontend/
└── src/
    └── components/
        └── forms/
            └── index.ts
```

### Form Components Planned

| Component | Purpose | Priority |
|-----------|---------|----------|
| FormField | Label + input + error | High |
| FormGroup | Group of fields | Medium |
| Select | Dropdown select | High |
| Checkbox | Checkbox input | High |
| Radio | Radio buttons | Medium |
| DatePicker | Date selection | High |
| TimePicker | Time selection | Medium |
| FileUpload | File uploads | Medium |
| SearchInput | Search with icon | High |
| PhoneInput | +94 phone format | High |
| CurrencyInput | LKR formatting | High |

### Sri Lanka-Specific

| Component | Feature |
|-----------|---------|
| PhoneInput | +94 XX XXX XXXX format |
| CurrencyInput | ₨ symbol, 2 decimals |
| NICInput | Sri Lankan ID format |

### Initial index.ts

```typescript
// components/forms/index.ts
// Export form components as they are created

// export { FormField } from './FormField'
// export { Select } from './Select'
// export { DatePicker } from './DatePicker'
```

### Form Library

Will integrate react-hook-form:
- Performance optimized
- TypeScript support
- Validation with zod

### Expected Outcome
- forms/ directory exists
- Ready for form components

### Verification Checklist
- [ ] Directory created at components/forms/
- [ ] index.ts file created
- [ ] SL-specific planned

---

## Task 50: Create components/common/ Directory

### Overview
Create the common directory for shared components used across features.

### Dependencies
- Task 46: Create components/ Directory

### Instructions

1. **Create common directory**
   - Create in components/

2. **Add index.ts barrel**
   - Export all common components

3. **Plan common components**
   - Logo, Avatar, Loaders

### File Location

```
frontend/
└── src/
    └── components/
        └── common/
            └── index.ts
```

### Common Components Planned

| Component | Purpose | Priority |
|-----------|---------|----------|
| Logo | App logo | High |
| Avatar | User profile image | High |
| LoadingSpinner | Loading state | High |
| EmptyState | No data display | Medium |
| ErrorBoundary | Error handling | High |
| Skeleton | Loading placeholder | Medium |
| ConfirmDialog | Confirmation modal | High |
| Toast | Notifications | High |
| ThemeToggle | Dark mode switch | Medium |
| LanguageSwitch | i18n toggle | Medium |

### Shared vs Feature

| Common | Feature-specific |
|--------|------------------|
| Logo | ProductCard |
| Avatar | InvoiceTable |
| Spinner | CartDrawer |
| Toast | CheckoutForm |

### Initial index.ts

```typescript
// components/common/index.ts
// Export common components as they are created

// export { Logo } from './Logo'
// export { Avatar } from './Avatar'
// export { LoadingSpinner } from './LoadingSpinner'
```

### Expected Outcome
- common/ directory exists
- Ready for shared components

### Verification Checklist
- [ ] Directory created at components/common/
- [ ] index.ts file created
- [ ] Components planned

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 46 | Create components/ Directory | Root components folder |
| 47 | Create components/ui/ Directory | UI primitives folder |
| 48 | Create components/layout/ Directory | Layout components folder |
| 49 | Create components/forms/ Directory | Form components folder |
| 50 | Create components/common/ Directory | Common components folder |

### Files Created

```
frontend/
└── src/
    └── components/
        ├── index.ts           # Root barrel
        ├── common/
        │   └── index.ts       # Common barrel
        ├── forms/
        │   └── index.ts       # Forms barrel
        ├── layout/
        │   └── index.ts       # Layout barrel
        └── ui/
            └── index.ts       # UI barrel
```

### Component Categories

| Category | Purpose | Count (Planned) |
|----------|---------|-----------------|
| ui/ | Primitives | 10+ |
| layout/ | Page structure | 8+ |
| forms/ | Form inputs | 11+ |
| common/ | Shared | 10+ |

### Next Steps
Proceed to [02_Tasks-51-56_Lib-Hooks-Stores.md](02_Tasks-51-56_Lib-Hooks-Stores.md) for library utilities and hooks.

---

## Notes for AI Agents

1. **Barrel Exports:** All directories have index.ts
2. **Atomic Design:** ui → forms → layout → common
3. **Shadcn/UI:** Will install components later
4. **Sri Lanka:** Phone, currency, NIC components
5. **Git:** Add .gitkeep to empty directories
6. **Commit:** After all Group E tasks complete
