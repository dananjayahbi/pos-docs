# Tasks 63-66: Core Aliases

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 03 - Frontend Project Initialization  
> **Group:** F - Path Aliases & Module Resolution  
> **Document:** 01 of 02  
> **Tasks Covered:** 63, 64, 65, 66

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-E_Folder-Structure-Setup/03_Tasks-57-62_Services-Constants.md](../Group-E_Folder-Structure-Setup/03_Tasks-57-62_Services-Constants.md)
- **→ Next Document:** [02_Tasks-67-70_Extended-Aliases.md](02_Tasks-67-70_Extended-Aliases.md)

---

## Document Overview

This document covers configuring the core path aliases in tsconfig.json including the root alias and aliases for components, lib, and hooks directories.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 63 | Configure @/ Alias | Simple |
| 64 | Configure @/components Alias | Simple |
| 65 | Configure @/lib Alias | Simple |
| 66 | Configure @/hooks Alias | Simple |

---

## Task 63: Configure @/ Alias

### Overview
Configure the root path alias for absolute imports from the source directory.

### Dependencies
- Task 26: Create tsconfig.json

### Instructions

1. **Open tsconfig.json**
   - In frontend root

2. **Add baseUrl**
   - Set to current directory

3. **Add paths object**
   - Define @/* alias

4. **Set root mapping**
   - Point to source

### File Location

```
frontend/
└── tsconfig.json
```

### Configuration

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Why baseUrl + paths

| Config | Purpose |
|--------|---------|
| baseUrl | Starting point for resolution |
| paths | Alias mappings |
| @/* | Matches any import starting with @/ |

### Next.js Support

Next.js automatically:
- Reads paths from tsconfig.json
- Configures webpack resolver
- No additional setup needed

### Import Pattern

```typescript
// Instead of:
import { Button } from '../../../components/Button'

// Use:
import { Button } from '@/components/Button'
```

### Expected Outcome
- baseUrl configured
- Root @/ alias working

### Verification Checklist
- [ ] baseUrl set to "."
- [ ] paths object added
- [ ] @/* mapped to ./src/*

---

## Task 64: Configure @/components Alias

### Overview
Add specific alias for the components directory.

### Dependencies
- Task 63: Configure @/ Alias
- Task 46: Create components/ Directory

### Instructions

1. **Add components path**
   - Add to paths object

2. **Map to components folder**
   - ./src/components/*

3. **Test import**
   - Verify resolution

### Configuration Addition

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"]
    }
  }
}
```

### Why Specific Alias

Benefits of @/components/*:
| Benefit | Description |
|---------|-------------|
| Clarity | Obvious import source |
| IDE | Better autocomplete |
| Consistency | Standard pattern |

### Import Examples

```typescript
// UI components
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

// Layout components
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'

// Form components
import { FormField } from '@/components/forms/FormField'

// Common components
import { Logo } from '@/components/common/Logo'
```

### Expected Outcome
- Components alias configured
- Clean component imports

### Verification Checklist
- [ ] @/components/* added to paths
- [ ] Mapped to ./src/components/*
- [ ] IDE recognizes alias

---

## Task 65: Configure @/lib Alias

### Overview
Add specific alias for the library utilities directory.

### Dependencies
- Task 63: Configure @/ Alias
- Task 51: Create lib/ Directory

### Instructions

1. **Add lib path**
   - Add to paths object

2. **Map to lib folder**
   - ./src/lib/*

3. **Verify cn import**
   - Common utility

### Configuration Addition

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"]
    }
  }
}
```

### Import Examples

```typescript
// className utility
import { cn } from '@/lib/cn'

// General utilities
import { debounce, isEmpty } from '@/lib/utils'

// Date utilities (future)
import { formatDate } from '@/lib/dates'

// Currency utilities (future)
import { formatLKR } from '@/lib/currency'
```

### Common Pattern

```typescript
// In components
import { cn } from '@/lib/cn'

interface ButtonProps {
  className?: string
  variant?: 'primary' | 'secondary'
}

export function Button({ className, variant }: ButtonProps) {
  return (
    <button className={cn(
      'px-4 py-2',
      variant === 'primary' && 'bg-primary',
      className
    )} />
  )
}
```

### Expected Outcome
- Lib alias configured
- Utility imports clean

### Verification Checklist
- [ ] @/lib/* added to paths
- [ ] Mapped to ./src/lib/*
- [ ] cn import works

---

## Task 66: Configure @/hooks Alias

### Overview
Add specific alias for the custom hooks directory.

### Dependencies
- Task 63: Configure @/ Alias
- Task 54: Create hooks/ Directory

### Instructions

1. **Add hooks path**
   - Add to paths object

2. **Map to hooks folder**
   - ./src/hooks/*

3. **Verify hook imports**
   - Test resolution

### Configuration Addition

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"]
    }
  }
}
```

### Import Examples

```typescript
// Individual hooks
import { useDebounce } from '@/hooks/useDebounce'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useMediaQuery } from '@/hooks/useMediaQuery'

// From barrel export
import { useDebounce, useLocalStorage } from '@/hooks'
```

### Hook Usage Pattern

```typescript
// In components
import { useDebounce } from '@/hooks/useDebounce'
import { useLocalStorage } from '@/hooks/useLocalStorage'

function SearchInput() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>(
    'recentSearches',
    []
  )

  // Use debouncedQuery for API calls
}
```

### Barrel vs Direct

| Import | When to Use |
|--------|-------------|
| @/hooks | Multiple hooks from barrel |
| @/hooks/useDebounce | Single specific hook |

### Expected Outcome
- Hooks alias configured
- Clean hook imports

### Verification Checklist
- [ ] @/hooks/* added to paths
- [ ] Mapped to ./src/hooks/*
- [ ] Both patterns work

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 63 | Configure @/ Alias | Root alias |
| 64 | Configure @/components Alias | Components alias |
| 65 | Configure @/lib Alias | Library alias |
| 66 | Configure @/hooks Alias | Hooks alias |

### tsconfig.json Progress

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"]
    }
  }
}
```

### Alias Summary

| Alias | Target | Use |
|-------|--------|-----|
| @/* | ./src/* | General imports |
| @/components/* | ./src/components/* | Components |
| @/lib/* | ./src/lib/* | Utilities |
| @/hooks/* | ./src/hooks/* | Hooks |

### Next Steps
Proceed to [02_Tasks-67-70_Extended-Aliases.md](02_Tasks-67-70_Extended-Aliases.md) for remaining aliases and verification.

---

## Notes for AI Agents

1. **Order matters:** Add aliases in logical order
2. **Trailing /*:** Required for directory aliases
3. **Array syntax:** Use array for path values
4. **IDE restart:** May need to restart for recognition
5. **No webpack config:** Next.js handles it
6. **Git:** Do NOT commit yet - complete Group F first
