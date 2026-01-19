# Group F: Path Aliases & Module Resolution

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 03 - Frontend Project Initialization  
> **Group:** F of G  
> **Tasks Covered:** 63-70  
> **Group Goal:** Configure path aliases for clean imports throughout the application

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-E_Folder-Structure-Setup/](../Group-E_Folder-Structure-Setup/)
- **→ Next Group:** [../Group-G_Core-Dependencies-Config-Files/](../Group-G_Core-Dependencies-Config-Files/)

---

## Group Overview

This group configures TypeScript path aliases to enable clean imports like `@/components/Button` instead of relative paths like `../../../components/Button`. Each major directory gets its own alias for convenience.

### Key Outcomes
- Root @/ alias pointing to frontend directory
- Specific aliases for all major directories
- Consistent import patterns across codebase
- Aliases verified working with TypeScript

### Technology Context
- **Configuration:** tsconfig.json paths
- **Resolution:** Next.js handles alias resolution automatically
- **Pattern:** @/ prefix for absolute imports

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-63-66_Core-Aliases.md | 63-66 | Configure @/, @/components, @/lib, @/hooks aliases |
| 02 | 02_Tasks-67-70_Extended-Aliases.md | 67-70 | Configure @/stores, @/services, @/types, verify aliases |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 63 | Configure @/ Alias | Task 26 | Simple |
| 64 | Configure @/components Alias | Task 63 | Simple |
| 65 | Configure @/lib Alias | Task 63 | Simple |
| 66 | Configure @/hooks Alias | Task 63 | Simple |
| 67 | Configure @/stores Alias | Task 63 | Simple |
| 68 | Configure @/services Alias | Task 63 | Simple |
| 69 | Configure @/types Alias | Task 63 | Simple |
| 70 | Verify Path Aliases | Tasks 63-69 | Simple |

---

## Execution Order

```
01_Tasks-63-66_Core-Aliases.md
        │
        ▼
02_Tasks-67-70_Extended-Aliases.md
```

---

## Expected Deliverables

Updated tsconfig.json with paths configuration:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/hooks/*": ["./hooks/*"],
      "@/stores/*": ["./stores/*"],
      "@/services/*": ["./services/*"],
      "@/types/*": ["./types/*"]
    }
  }
}
```

---

## Import Examples

**Before (relative):**
```typescript
import { Button } from '../../../components/ui/Button'
import { useAuth } from '../../hooks/useAuth'
import { api } from '../../../services/api'
```

**After (aliases):**
```typescript
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/services/api'
```

---

## Verification Steps

1. Create test import in a nested file
2. Run `pnpm tsc --noEmit` - should pass
3. Run `pnpm dev` - should start without errors
4. IDE should provide autocomplete for aliases

---

## Notes for AI Agents

1. **Dependencies:** Requires TypeScript config (Task 26)
2. **Single Source:** Only define in tsconfig.json (Next.js reads from there)
3. **IDE Support:** VSCode/Cursor should recognize aliases automatically
4. **No Runtime:** Aliases are resolved at build time
5. **Consistency:** Use aliases everywhere, avoid relative imports for shared code
6. **Git Commit:** Commit after completing this group
