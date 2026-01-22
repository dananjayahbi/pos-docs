# Tasks 51-56: Lib, Hooks, and Stores

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 03 - Frontend Project Initialization  
> **Group:** E - Folder Structure Setup  
> **Document:** 02 of 03  
> **Tasks Covered:** 51, 52, 53, 54, 55, 56

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-46-50_Components-Structure.md](01_Tasks-46-50_Components-Structure.md)
- **→ Next Document:** [03_Tasks-57-62_Services-Constants.md](03_Tasks-57-62_Services-Constants.md)

---

## Document Overview

This document covers creating the library utilities directory, custom hooks directory, and state management stores directory.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 51 | Create lib/ Directory | Simple |
| 52 | Create lib/utils.ts | Medium |
| 53 | Create lib/cn.ts | Simple |
| 54 | Create hooks/ Directory | Simple |
| 55 | Create hooks/index.ts | Simple |
| 56 | Create stores/ Directory | Simple |

---

## Task 51: Create lib/ Directory

### Overview
Create the library directory for utility functions and helpers.

### Dependencies
- Task 14: Create App Layout

### Instructions

1. **Create lib directory**
   - Create in src/ folder

2. **Add index.ts barrel**
   - Export all utilities

3. **Plan utility modules**
   - Utils, cn, formatters

### File Location

```
frontend/
└── src/
    └── lib/
        └── index.ts
```

### Lib Modules Planned

| Module | Purpose |
|--------|---------|
| utils.ts | General utilities |
| cn.ts | className helper |
| formatters.ts | Data formatting |
| validators.ts | Validation helpers |
| dates.ts | Date utilities |
| currency.ts | LKR formatting |
| storage.ts | localStorage wrapper |

### Initial index.ts

```typescript
// lib/index.ts
export * from './utils'
export * from './cn'
```

### Lib vs Utils Pattern

| lib/ | Purpose |
|------|---------|
| Pure functions | No side effects |
| Framework agnostic | No React deps |
| Tree-shakeable | Individual exports |

### Expected Outcome
- lib/ directory exists
- Barrel export ready

### Verification Checklist
- [ ] Directory created at src/lib/
- [ ] index.ts file created
- [ ] Export pattern established

---

## Task 52: Create lib/utils.ts

### Overview
Create the general utilities file with common helper functions.

### Dependencies
- Task 51: Create lib/ Directory

### Instructions

1. **Create utils.ts file**
   - Create in lib/

2. **Add common utilities**
   - Type guards
   - Array helpers
   - Object helpers

3. **Export named functions**
   - Individual exports

### File Location

```
frontend/
└── src/
    └── lib/
        └── utils.ts
```

### Utility Functions

| Function | Purpose |
|----------|---------|
| isDefined | Check not undefined |
| isString | Type guard |
| isNumber | Type guard |
| isEmpty | Check empty value |
| sleep | Async delay |
| debounce | Debounce function |
| throttle | Throttle function |
| clamp | Clamp number |
| range | Generate array |
| groupBy | Group array |
| omit | Omit object keys |
| pick | Pick object keys |

### Type Guards

```typescript
export const isDefined = <T>(value: T | undefined | null): value is T => {
  return value !== undefined && value !== null
}

export const isString = (value: unknown): value is string => {
  return typeof value === 'string'
}

export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value)
}
```

### Array Helpers

```typescript
export const isEmpty = <T>(arr: T[] | undefined | null): boolean => {
  return !arr || arr.length === 0
}

export const range = (start: number, end: number): number[] => {
  return Array.from({ length: end - start }, (_, i) => start + i)
}

export const groupBy = <T, K extends keyof never>(
  array: T[],
  keyFn: (item: T) => K
): Record<K, T[]> => {
  return array.reduce((acc, item) => {
    const key = keyFn(item)
    acc[key] = [...(acc[key] || []), item]
    return acc
  }, {} as Record<K, T[]>)
}
```

### Async Helpers

```typescript
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const debounce = <T extends (...args: never[]) => void>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}
```

### Object Helpers

```typescript
export const omit = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj }
  keys.forEach(key => delete result[key])
  return result
}

export const pick = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>
  keys.forEach(key => {
    if (key in obj) result[key] = obj[key]
  })
  return result
}
```

### Expected Outcome
- utils.ts with common helpers
- Type-safe functions

### Verification Checklist
- [ ] File created at lib/utils.ts
- [ ] Type guards added
- [ ] Array helpers added
- [ ] Object helpers added

---

## Task 53: Create lib/cn.ts

### Overview
Create the className utility combining clsx and tailwind-merge.

### Dependencies
- Task 51: Create lib/ Directory

### Instructions

1. **Create cn.ts file**
   - Create in lib/

2. **Import clsx and tailwind-merge**
   - Combine both utilities

3. **Export cn function**
   - Single named export

### File Location

```
frontend/
└── src/
    └── lib/
        └── cn.ts
```

### cn Function Pattern

Standard pattern for Tailwind projects:

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Why Both Libraries

| Library | Purpose |
|---------|---------|
| clsx | Conditional classes |
| tailwind-merge | Resolve conflicts |

### Usage Examples

| Input | Output |
|-------|--------|
| `cn('p-2', 'p-4')` | 'p-4' |
| `cn('text-red-500', condition && 'text-blue-500')` | Based on condition |
| `cn('btn', className)` | Merged result |

### Component Pattern

```typescript
import { cn } from '@/lib/cn'

interface ButtonProps {
  className?: string
  variant?: 'primary' | 'secondary'
}

export function Button({ className, variant = 'primary' }: ButtonProps) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded',
        variant === 'primary' && 'bg-primary text-white',
        variant === 'secondary' && 'bg-gray-100 text-gray-900',
        className
      )}
    />
  )
}
```

### Required Packages

Add to package.json:
- clsx
- tailwind-merge

### Expected Outcome
- cn.ts utility created
- Ready for component styling

### Verification Checklist
- [ ] File created at lib/cn.ts
- [ ] clsx imported
- [ ] tailwind-merge imported
- [ ] cn function exported

---

## Task 54: Create hooks/ Directory

### Overview
Create the custom hooks directory for reusable React hooks.

### Dependencies
- Task 14: Create App Layout

### Instructions

1. **Create hooks directory**
   - Create in src/

2. **Add index.ts barrel**
   - Export all hooks

3. **Plan custom hooks**
   - Data fetching, state, effects

### File Location

```
frontend/
└── src/
    └── hooks/
        └── index.ts
```

### Custom Hooks Planned

| Hook | Purpose | Priority |
|------|---------|----------|
| useDebounce | Debounced value | High |
| useLocalStorage | Persist state | High |
| useMediaQuery | Responsive | High |
| useClickOutside | Dropdown close | High |
| useAsync | Async state | High |
| useCopyToClipboard | Copy text | Medium |
| useToggle | Boolean toggle | Low |
| usePrevious | Previous value | Low |
| useIsMounted | Mount check | Medium |
| useIsClient | SSR check | High |

### Hook File Pattern

```
hooks/
├── index.ts
├── useDebounce.ts
├── useLocalStorage.ts
└── useMediaQuery.ts
```

### Initial index.ts

```typescript
// hooks/index.ts
// Export hooks as they are created

// export { useDebounce } from './useDebounce'
// export { useLocalStorage } from './useLocalStorage'
// export { useMediaQuery } from './useMediaQuery'
```

### Hook Naming Convention

| Pattern | Example |
|---------|---------|
| use + Verb/Noun | useDebounce |
| Camel case | useLocalStorage |
| Descriptive | useClickOutside |

### Expected Outcome
- hooks/ directory exists
- Barrel export ready

### Verification Checklist
- [ ] Directory created at src/hooks/
- [ ] index.ts file created
- [ ] Hooks planned

---

## Task 55: Create hooks/index.ts

### Overview
Create the barrel export file for the hooks directory.

### Dependencies
- Task 54: Create hooks/ Directory

### Instructions

1. **Create index.ts file**
   - Create in hooks/

2. **Add export comments**
   - Placeholder for future hooks

3. **Document usage pattern**
   - Import from @/hooks

### File Location

```
frontend/
└── src/
    └── hooks/
        └── index.ts
```

### Barrel Export Content

```typescript
// hooks/index.ts
// Custom React hooks for the application
// Export hooks as they are created

// Data hooks
// export { useDebounce } from './useDebounce'
// export { useAsync } from './useAsync'

// State hooks
// export { useLocalStorage } from './useLocalStorage'
// export { useToggle } from './useToggle'

// UI hooks
// export { useMediaQuery } from './useMediaQuery'
// export { useClickOutside } from './useClickOutside'

// SSR hooks
// export { useIsClient } from './useIsClient'
// export { useIsMounted } from './useIsMounted'
```

### Import Pattern

```typescript
// Import individual hooks
import { useDebounce, useLocalStorage } from '@/hooks'

// Or import from barrel
import * as hooks from '@/hooks'
```

### Expected Outcome
- Barrel export ready
- Import path established

### Verification Checklist
- [ ] File created at hooks/index.ts
- [ ] Categories documented
- [ ] Export pattern established

---

## Task 56: Create stores/ Directory

### Overview
Create the stores directory for Zustand state management.

### Dependencies
- Task 14: Create App Layout

### Instructions

1. **Create stores directory**
   - Create in src/

2. **Add index.ts barrel**
   - Export all stores

3. **Plan store modules**
   - Auth, UI, Cart, etc.

### File Location

```
frontend/
└── src/
    └── stores/
        └── index.ts
```

### Stores Planned

| Store | Purpose | Platform |
|-------|---------|----------|
| useAuthStore | Authentication | All |
| useUIStore | UI state | All |
| useCartStore | Shopping cart | Webstore, POS |
| useNotificationStore | Toasts | All |
| useThemeStore | Theme/dark mode | All |
| usePOSStore | POS session | POS |
| useFilterStore | List filters | ERP |

### Zustand Pattern

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  sidebarOpen: boolean
  toggleSidebar: () => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}))
```

### Store File Pattern

```
stores/
├── index.ts
├── useAuthStore.ts
├── useUIStore.ts
└── useCartStore.ts
```

### Initial index.ts

```typescript
// stores/index.ts
// Zustand state stores
// Export stores as they are created

// export { useAuthStore } from './useAuthStore'
// export { useUIStore } from './useUIStore'
// export { useCartStore } from './useCartStore'
```

### Why Zustand

| Feature | Benefit |
|---------|---------|
| Minimal API | Simple to learn |
| No providers | No context wrapper |
| Middleware | Persist, devtools |
| TypeScript | First-class support |

### Expected Outcome
- stores/ directory exists
- Ready for Zustand stores

### Verification Checklist
- [ ] Directory created at src/stores/
- [ ] index.ts file created
- [ ] Store modules planned

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 51 | Create lib/ Directory | Library folder |
| 52 | Create lib/utils.ts | Utility functions |
| 53 | Create lib/cn.ts | className helper |
| 54 | Create hooks/ Directory | Hooks folder |
| 55 | Create hooks/index.ts | Hooks barrel |
| 56 | Create stores/ Directory | State stores folder |

### Files Created

```
frontend/
└── src/
    ├── hooks/
    │   └── index.ts       # Hooks barrel
    ├── lib/
    │   ├── index.ts       # Lib barrel
    │   ├── utils.ts       # Utilities
    │   └── cn.ts          # className
    └── stores/
        └── index.ts       # Stores barrel
```

### Dependencies Required

| Package | Version | Purpose |
|---------|---------|---------|
| clsx | ^2.x | Conditional classes |
| tailwind-merge | ^2.x | Merge Tailwind |
| zustand | ^4.x | State management |

### Next Steps
Proceed to [03_Tasks-57-62_Services-Constants.md](03_Tasks-57-62_Services-Constants.md) for services and constants.

---

## Notes for AI Agents

1. **cn pattern:** Standard in Tailwind projects
2. **Zustand:** No providers needed
3. **Barrel exports:** Clean import paths
4. **Utils:** Pure, tree-shakeable functions
5. **Hooks:** Follow use- naming convention
6. **Git:** Commit after Group E complete
