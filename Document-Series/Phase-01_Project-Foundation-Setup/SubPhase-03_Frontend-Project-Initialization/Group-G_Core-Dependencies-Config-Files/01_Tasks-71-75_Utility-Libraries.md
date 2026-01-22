# Tasks 71-75: Utility Libraries

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 03 - Frontend Project Initialization  
> **Group:** G - Core Dependencies & Config Files  
> **Document:** 01 of 03  
> **Tasks Covered:** 71, 72, 73, 74, 75

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-F_Path-Aliases-Module-Resolution/02_Tasks-67-70_Extended-Aliases.md](../Group-F_Path-Aliases-Module-Resolution/02_Tasks-67-70_Extended-Aliases.md)
- **→ Next Document:** [02_Tasks-76-79_Config-Files.md](02_Tasks-76-79_Config-Files.md)

---

## Document Overview

This document covers installing essential utility libraries for class management, component variants, icons, and theming.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 71 | Install clsx | Simple |
| 72 | Install tailwind-merge | Simple |
| 73 | Install class-variance-authority | Simple |
| 74 | Install lucide-react | Simple |
| 75 | Install next-themes | Simple |

---

## Task 71: Install clsx

### Overview
Install clsx for conditional class name construction.

### Dependencies
- Task 05: Create package.json

### Instructions

1. **Install clsx**
   - Add as production dependency

2. **Verify installation**
   - Check package.json

3. **Understand usage**
   - Conditional classes

### Installation Command

```bash
pnpm add clsx
```

### Package Details

| Package | Version | Size |
|---------|---------|------|
| clsx | ^2.x | ~1KB |

### What clsx Does

Combines class names conditionally:

| Input | Output |
|-------|--------|
| `clsx('foo', 'bar')` | 'foo bar' |
| `clsx('foo', false && 'bar')` | 'foo' |
| `clsx({ foo: true, bar: false })` | 'foo' |

### Usage Pattern

```typescript
import clsx from 'clsx'

const className = clsx(
  'base-class',
  isActive && 'active',
  size === 'large' && 'text-lg',
  { 'opacity-50': disabled }
)
```

### Why clsx Over classnames

| Feature | clsx | classnames |
|---------|------|------------|
| Size | Smaller | Larger |
| Speed | Faster | Slower |
| API | Same | Same |

### Expected Outcome
- clsx installed
- Ready for use

### Verification Checklist
- [ ] pnpm add clsx completed
- [ ] clsx in package.json dependencies
- [ ] No errors

---

## Task 72: Install tailwind-merge

### Overview
Install tailwind-merge to intelligently merge Tailwind CSS classes without conflicts.

### Dependencies
- Task 31: Install Tailwind CSS

### Instructions

1. **Install tailwind-merge**
   - Add as production dependency

2. **Verify installation**
   - Check package.json

3. **Understand merging**
   - Conflict resolution

### Installation Command

```bash
pnpm add tailwind-merge
```

### Package Details

| Package | Version | Size |
|---------|---------|------|
| tailwind-merge | ^2.x | ~15KB |

### What tailwind-merge Does

Resolves conflicting Tailwind classes:

| Input | Output |
|-------|--------|
| `twMerge('p-2 p-4')` | 'p-4' |
| `twMerge('text-red-500 text-blue-500')` | 'text-blue-500' |
| `twMerge('px-2 py-4 p-6')` | 'p-6' |

### Conflict Categories

| Category | Example |
|----------|---------|
| Spacing | p-2, p-4 |
| Colors | text-red, text-blue |
| Sizing | w-full, w-auto |
| Display | flex, block |

### Combined with clsx

```typescript
import { twMerge } from 'tailwind-merge'
import clsx from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Expected Outcome
- tailwind-merge installed
- Ready for cn utility

### Verification Checklist
- [ ] pnpm add tailwind-merge completed
- [ ] tailwind-merge in dependencies
- [ ] No errors

---

## Task 73: Install class-variance-authority

### Overview
Install cva for building type-safe variant-based component APIs.

### Dependencies
- Task 31: Install Tailwind CSS

### Instructions

1. **Install cva**
   - Add as production dependency

2. **Verify installation**
   - Check package.json

3. **Understand variants**
   - API pattern

### Installation Command

```bash
pnpm add class-variance-authority
```

### Package Details

| Package | Version | Size |
|---------|---------|------|
| class-variance-authority | ^0.7.x | ~5KB |

### What cva Does

Creates variant-based class APIs:

```typescript
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary/90',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
        outline: 'border border-gray-300 hover:bg-gray-100',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
```

### Component Pattern

```typescript
interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariants {}

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
```

### Expected Outcome
- cva installed
- Ready for variants

### Verification Checklist
- [ ] pnpm add class-variance-authority completed
- [ ] class-variance-authority in dependencies
- [ ] No errors

---

## Task 74: Install lucide-react

### Overview
Install Lucide React icons for consistent iconography across the application.

### Dependencies
- Task 10: Install React

### Instructions

1. **Install lucide-react**
   - Add as production dependency

2. **Verify installation**
   - Check package.json

3. **Understand usage**
   - Icon import pattern

### Installation Command

```bash
pnpm add lucide-react
```

### Package Details

| Package | Version | Icons |
|---------|---------|-------|
| lucide-react | ^0.x | 1000+ |

### Why Lucide

| Feature | Benefit |
|---------|---------|
| Tree-shakeable | Only imports used icons |
| Consistent | Unified design language |
| Customizable | Size, color, stroke |
| TypeScript | Full types support |

### Usage Pattern

```typescript
import { Search, Menu, ShoppingCart, User, Settings } from 'lucide-react'

function Header() {
  return (
    <nav>
      <Menu className="h-6 w-6" />
      <Search className="h-5 w-5 text-gray-500" />
      <ShoppingCart className="h-6 w-6" />
      <User className="h-6 w-6" />
    </nav>
  )
}
```

### Common Icons

| Icon | Use Case |
|------|----------|
| Menu | Hamburger menu |
| Search | Search input |
| ShoppingCart | Cart |
| User | Profile |
| Settings | Settings |
| ChevronDown | Dropdowns |
| X | Close buttons |
| Check | Success |
| AlertCircle | Errors |
| Loader2 | Loading spinner |

### Expected Outcome
- lucide-react installed
- Icons available

### Verification Checklist
- [ ] pnpm add lucide-react completed
- [ ] lucide-react in dependencies
- [ ] No errors

---

## Task 75: Install next-themes

### Overview
Install next-themes for theme switching with system preference detection and persistence.

### Dependencies
- Task 10: Install Next.js

### Instructions

1. **Install next-themes**
   - Add as production dependency

2. **Verify installation**
   - Check package.json

3. **Understand integration**
   - Provider setup

### Installation Command

```bash
pnpm add next-themes
```

### Package Details

| Package | Version | Size |
|---------|---------|------|
| next-themes | ^0.x | ~3KB |

### Features

| Feature | Description |
|---------|-------------|
| System detection | Respects OS preference |
| Persistence | Saves to localStorage |
| No flash | SSR-safe theme |
| Multi-theme | Beyond just dark/light |

### Provider Setup

```typescript
// app/providers.tsx
'use client'

import { ThemeProvider } from 'next-themes'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}
```

### Layout Integration

```typescript
// app/layout.tsx
import { Providers } from './providers'

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

### Theme Toggle Hook

```typescript
import { useTheme } from 'next-themes'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle theme
    </button>
  )
}
```

### Expected Outcome
- next-themes installed
- Ready for theming

### Verification Checklist
- [ ] pnpm add next-themes completed
- [ ] next-themes in dependencies
- [ ] No errors

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 71 | Install clsx | Conditional classes |
| 72 | Install tailwind-merge | Class conflict resolution |
| 73 | Install class-variance-authority | Component variants |
| 74 | Install lucide-react | Icon library |
| 75 | Install next-themes | Theme switching |

### Installation Commands Summary

```bash
pnpm add clsx tailwind-merge class-variance-authority lucide-react next-themes
```

### package.json Additions

```json
{
  "dependencies": {
    "clsx": "^2.x",
    "tailwind-merge": "^2.x",
    "class-variance-authority": "^0.7.x",
    "lucide-react": "^0.x",
    "next-themes": "^0.x"
  }
}
```

### Library Summary

| Library | Purpose | Size |
|---------|---------|------|
| clsx | Conditional classes | ~1KB |
| tailwind-merge | Merge Tailwind | ~15KB |
| cva | Component variants | ~5KB |
| lucide-react | Icons | Tree-shaken |
| next-themes | Theming | ~3KB |

### Next Steps
Proceed to [02_Tasks-76-79_Config-Files.md](02_Tasks-76-79_Config-Files.md) for environment and config files.

---

## Notes for AI Agents

1. **Single install:** Can install all at once
2. **cn pattern:** clsx + tailwind-merge
3. **cva:** For variant-based components
4. **Lucide:** Tree-shakeable icons
5. **next-themes:** Use with suppressHydrationWarning
6. **Git:** Do NOT commit yet - complete Group G first
