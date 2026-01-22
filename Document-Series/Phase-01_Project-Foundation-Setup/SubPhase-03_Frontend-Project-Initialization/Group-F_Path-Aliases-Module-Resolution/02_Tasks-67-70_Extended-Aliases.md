# Tasks 67-70: Extended Aliases

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 03 - Frontend Project Initialization  
> **Group:** F - Path Aliases & Module Resolution  
> **Document:** 02 of 02  
> **Tasks Covered:** 67, 68, 69, 70

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-63-66_Core-Aliases.md](01_Tasks-63-66_Core-Aliases.md)
- **→ Next Group:** [../Group-G_Core-Dependencies-Config-Files/00_GROUP_OVERVIEW.md](../Group-G_Core-Dependencies-Config-Files/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document covers configuring the remaining path aliases for stores, services, and types directories, then verifying all aliases work correctly.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 67 | Configure @/stores Alias | Simple |
| 68 | Configure @/services Alias | Simple |
| 69 | Configure @/types Alias | Simple |
| 70 | Verify Path Aliases | Simple |

---

## Task 67: Configure @/stores Alias

### Overview
Add specific alias for the Zustand stores directory.

### Dependencies
- Task 63: Configure @/ Alias
- Task 56: Create stores/ Directory

### Instructions

1. **Add stores path**
   - Add to paths object

2. **Map to stores folder**
   - ./src/stores/*

3. **Verify store imports**
   - Test resolution

### Configuration Addition

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/stores/*": ["./src/stores/*"]
    }
  }
}
```

### Import Examples

```typescript
// Individual stores
import { useAuthStore } from '@/stores/useAuthStore'
import { useUIStore } from '@/stores/useUIStore'
import { useCartStore } from '@/stores/useCartStore'

// From barrel
import { useAuthStore, useUIStore } from '@/stores'
```

### Store Usage Pattern

```typescript
// In components
import { useAuthStore } from '@/stores/useAuthStore'
import { useUIStore } from '@/stores/useUIStore'

function Header() {
  const { user, logout } = useAuthStore()
  const { sidebarOpen, toggleSidebar } = useUIStore()

  return (
    <header>
      <button onClick={toggleSidebar}>Menu</button>
      <span>{user?.name}</span>
    </header>
  )
}
```

### Expected Outcome
- Stores alias configured
- Clean store imports

### Verification Checklist
- [ ] @/stores/* added to paths
- [ ] Mapped to ./src/stores/*
- [ ] Store imports work

---

## Task 68: Configure @/services Alias

### Overview
Add specific alias for the API services directory.

### Dependencies
- Task 63: Configure @/ Alias
- Task 57: Create services/ Directory

### Instructions

1. **Add services path**
   - Add to paths object

2. **Map to services folder**
   - ./src/services/*

3. **Verify API imports**
   - Test resolution

### Configuration Addition

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/stores/*": ["./src/stores/*"],
      "@/services/*": ["./src/services/*"]
    }
  }
}
```

### Import Examples

```typescript
// API client
import { api } from '@/services/api'

// Individual services
import { productService } from '@/services/products'
import { orderService } from '@/services/orders'
import { authService } from '@/services/auth'

// From barrel
import { api, productService } from '@/services'
```

### Service Usage Pattern

```typescript
// In hooks or components
import { productService } from '@/services/products'

async function fetchProducts() {
  try {
    const products = await productService.getAll()
    return products
  } catch (error) {
    console.error('Failed to fetch products:', error)
    throw error
  }
}
```

### Expected Outcome
- Services alias configured
- Clean API imports

### Verification Checklist
- [ ] @/services/* added to paths
- [ ] Mapped to ./src/services/*
- [ ] API imports work

---

## Task 69: Configure @/types Alias

### Overview
Add specific alias for TypeScript type definitions directory.

### Dependencies
- Task 63: Configure @/ Alias
- Task 28: Create types/index.d.ts

### Instructions

1. **Add types path**
   - Add to paths object

2. **Map to types folder**
   - ./src/types/*

3. **Verify type imports**
   - Test resolution

### Configuration Addition

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/stores/*": ["./src/stores/*"],
      "@/services/*": ["./src/services/*"],
      "@/types/*": ["./src/types/*"]
    }
  }
}
```

### Import Examples

```typescript
// Type imports
import type { User, Product, Order } from '@/types'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type { FormProps, FieldProps } from '@/types/forms'
```

### Type Files Structure

```
frontend/
└── src/
    └── types/
        ├── index.ts       # Re-exports all types
        ├── api.ts         # API-related types
        ├── auth.ts        # Auth types
        ├── models.ts      # Data models
        └── forms.ts       # Form types
```

### Type Organization

| File | Types |
|------|-------|
| models.ts | User, Product, Order, etc. |
| api.ts | ApiResponse, ApiError |
| auth.ts | LoginRequest, AuthState |
| forms.ts | FormField, ValidationError |

### Expected Outcome
- Types alias configured
- Clean type imports

### Verification Checklist
- [ ] @/types/* added to paths
- [ ] Mapped to ./src/types/*
- [ ] Type imports work

---

## Task 70: Verify Path Aliases

### Overview
Verify all path aliases work correctly with TypeScript and Next.js.

### Dependencies
- Tasks 63-69: All aliases configured

### Instructions

1. **Run TypeScript check**
   - pnpm tsc --noEmit

2. **Start dev server**
   - pnpm dev

3. **Test IDE resolution**
   - Autocomplete works

4. **Create test file**
   - Verify imports

### Verification Commands

| Command | Purpose |
|---------|---------|
| `pnpm tsc --noEmit` | Type check without build |
| `pnpm dev` | Start development server |
| `pnpm build` | Full production build |

### Test File Pattern

Create a test file to verify all aliases:

```typescript
// src/app/test-aliases.ts (temporary)

// Test root alias
import { cn } from '@/lib/cn'

// Test components alias
// import { Button } from '@/components/ui/Button'

// Test hooks alias
// import { useDebounce } from '@/hooks/useDebounce'

// Test stores alias
// import { useAuthStore } from '@/stores/useAuthStore'

// Test services alias
import { api } from '@/services/api'

// Test types alias
// import type { User } from '@/types'

// If no TypeScript errors, aliases work
export {}
```

### IDE Verification

| Check | Expected |
|-------|----------|
| Hover @/lib | Shows file path |
| Autocomplete | Lists available exports |
| Ctrl+Click | Navigates to file |
| No red underlines | Valid imports |

### Common Issues

| Issue | Solution |
|-------|----------|
| Red underlines | Restart TypeScript server |
| No autocomplete | Reload window |
| Build fails | Check path spelling |
| Wrong resolution | Verify baseUrl |

### Restart TypeScript Server

In VS Code/Cursor:
1. Open Command Palette (Ctrl+Shift+P)
2. Run "TypeScript: Restart TS Server"

### Final tsconfig.json Paths

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/stores/*": ["./src/stores/*"],
      "@/services/*": ["./src/services/*"],
      "@/types/*": ["./src/types/*"]
    }
  }
}
```

### Expected Outcome
- All aliases verified
- TypeScript happy
- Dev server works

### Verification Checklist
- [ ] tsc --noEmit passes
- [ ] Dev server starts
- [ ] IDE autocomplete works
- [ ] Ctrl+Click navigates

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 67 | Configure @/stores Alias | Stores alias |
| 68 | Configure @/services Alias | Services alias |
| 69 | Configure @/types Alias | Types alias |
| 70 | Verify Path Aliases | All aliases verified |

### Complete Path Configuration

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/stores/*": ["./src/stores/*"],
      "@/services/*": ["./src/services/*"],
      "@/types/*": ["./src/types/*"]
    }
  }
}
```

### All Aliases Summary

| Alias | Target | Use |
|-------|--------|-----|
| @/* | ./src/* | General imports |
| @/components/* | ./src/components/* | Components |
| @/lib/* | ./src/lib/* | Utilities |
| @/hooks/* | ./src/hooks/* | Custom hooks |
| @/stores/* | ./src/stores/* | Zustand stores |
| @/services/* | ./src/services/* | API services |
| @/types/* | ./src/types/* | Type definitions |

### Group F Complete

All path alias tasks completed:
- Root @/ alias configured
- All directory aliases added
- TypeScript resolution working
- IDE support verified

### Next Steps
Proceed to [../Group-G_Core-Dependencies-Config-Files/00_GROUP_OVERVIEW.md](../Group-G_Core-Dependencies-Config-Files/00_GROUP_OVERVIEW.md) for core dependencies.

---

## Notes for AI Agents

1. **Verification:** Run tsc --noEmit before committing
2. **IDE restart:** May need TypeScript server restart
3. **Test file:** Can delete after verification
4. **Consistency:** Always use aliases for shared code
5. **Relative imports:** Only for same-directory files
6. **Git:** Commit after Group F complete
