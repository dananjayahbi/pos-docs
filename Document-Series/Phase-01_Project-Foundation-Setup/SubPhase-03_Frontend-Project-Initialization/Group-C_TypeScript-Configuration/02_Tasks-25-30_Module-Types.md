# Tasks 25-30: Module Resolution & Type Files

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 03 - Frontend Project Initialization  
> **Group:** C - TypeScript Configuration  
> **Document:** 02 of 02  
> **Tasks Covered:** 25, 26, 27, 28, 29, 30

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-19-24_TypeScript-Install.md](01_Tasks-19-24_TypeScript-Install.md)
- **→ Next Document:** [../Group-D_Tailwind-CSS-Setup/00_GROUP_OVERVIEW.md](../Group-D_Tailwind-CSS-Setup/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document covers configuring module resolution, path aliases, include/exclude patterns, creating type definition files, and verifying the complete TypeScript setup.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 25 | Configure Module Resolution | Medium |
| 26 | Configure Path Aliases | Medium |
| 27 | Configure Include/Exclude | Simple |
| 28 | Create types/index.d.ts | Simple |
| 29 | Create types/env.d.ts | Medium |
| 30 | Verify TypeScript Setup | Simple |

---

## Task 25: Configure Module Resolution

### Overview
Configure TypeScript module resolution for modern bundler-based builds.

### Dependencies
- Task 23: Create tsconfig.json

### Instructions

1. **Open tsconfig.json**
   - Navigate to compilerOptions

2. **Set moduleResolution**
   - Use "bundler" for Next.js 14+

3. **Configure related options**
   - resolveJsonModule
   - allowJs

### Module Resolution Options

| Option | Value | Purpose |
|--------|-------|---------|
| `moduleResolution` | bundler | Modern resolution |
| `resolveJsonModule` | true | Import JSON files |
| `allowJs` | true | Allow JavaScript |

### Resolution Strategies

| Strategy | Use Case |
|----------|----------|
| `bundler` | Next.js 14+, Vite |
| `node` | Node.js applications |
| `nodenext` | Node.js ESM |

### Bundler Resolution Benefits

| Benefit | Description |
|---------|-------------|
| Simpler | Matches bundler behavior |
| ESM-first | Modern module handling |
| Less config | Fewer edge cases |

### Related Settings

| Option | Value | Purpose |
|--------|-------|---------|
| `resolveJsonModule` | true | Import .json files |
| `allowJs` | true | Mix JS and TS |

### Expected Outcome
- Modern module resolution
- JSON imports enabled

### Verification Checklist
- [ ] moduleResolution set to bundler
- [ ] resolveJsonModule enabled
- [ ] allowJs enabled

---

## Task 26: Configure Path Aliases

### Overview
Configure path aliases for cleaner imports throughout the project.

### Dependencies
- Task 23: Create tsconfig.json

### Instructions

1. **Set baseUrl**
   - Point to project root "."

2. **Configure paths**
   - Add @/* alias for root
   - Add component-specific aliases

3. **Match in next.config.js**
   - Aliases must match

### Path Alias Configuration

| Alias | Path | Purpose |
|-------|------|---------|
| `@/*` | `./*` | Root alias |
| `@/components/*` | `./components/*` | Components |
| `@/lib/*` | `./lib/*` | Utilities |
| `@/hooks/*` | `./hooks/*` | Custom hooks |
| `@/types/*` | `./types/*` | Type definitions |
| `@/styles/*` | `./styles/*` | Style files |
| `@/stores/*` | `./stores/*` | State stores |
| `@/services/*` | `./services/*` | API services |

### tsconfig.json Paths

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/hooks/*": ["./hooks/*"],
      "@/types/*": ["./types/*"]
    }
  }
}
```

### Next.js Automatic Support

Next.js 14+ automatically reads paths from tsconfig.json:
- No webpack alias config needed
- Works with App Router

### Import Examples

| Before | After |
|--------|-------|
| `../../components/Button` | `@/components/Button` |
| `../../../lib/utils` | `@/lib/utils` |

### Expected Outcome
- Path aliases configured
- Clean import paths

### Verification Checklist
- [ ] baseUrl set to "."
- [ ] @/* alias configured
- [ ] Component aliases added
- [ ] Imports resolve correctly

---

## Task 27: Configure Include/Exclude

### Overview
Configure which files TypeScript should include and exclude from compilation.

### Dependencies
- Task 23: Create tsconfig.json

### Instructions

1. **Configure include**
   - Add source directories
   - Add Next.js type file

2. **Configure exclude**
   - Exclude node_modules
   - Exclude build outputs

### Include Configuration

| Pattern | Purpose |
|---------|---------|
| `next-env.d.ts` | Next.js types |
| `**/*.ts` | All TypeScript |
| `**/*.tsx` | All TSX |
| `.next/types/**/*.ts` | Next.js generated types |

### Exclude Configuration

| Pattern | Purpose |
|---------|---------|
| `node_modules` | Dependencies |
| `.next` | Build output |
| `out` | Static export |
| `dist` | Build distribution |
| `coverage` | Test coverage |

### Include Array

```json
{
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ]
}
```

### Exclude Array

```json
{
  "exclude": [
    "node_modules",
    ".next",
    "out",
    "dist",
    "coverage"
  ]
}
```

### Expected Outcome
- Source files included
- Build outputs excluded

### Verification Checklist
- [ ] Include patterns defined
- [ ] Exclude patterns defined
- [ ] node_modules excluded
- [ ] Build directories excluded

---

## Task 28: Create types/index.d.ts

### Overview
Create the main type declaration file for global types and module augmentations.

### Dependencies
- Task 23: Create tsconfig.json

### Instructions

1. **Create types directory**
   - Create frontend/types/

2. **Create index.d.ts**
   - Add global type declarations
   - Add module augmentations

3. **Define utility types**
   - Common reusable types

### File Location

```
frontend/
├── types/
│   └── index.d.ts
└── tsconfig.json
```

### Global Types

| Type | Purpose |
|------|---------|
| `Nullable<T>` | T or null |
| `Optional<T>` | T or undefined |
| `AsyncReturnType` | Extract async return type |

### Module Augmentations

Extend existing modules:
- Next.js types
- React types

### Common Utility Types

| Type | Definition |
|------|------------|
| `ID` | string (UUID) |
| `Timestamp` | string (ISO date) |
| `Currency` | LKR number |

### API Response Types

| Type | Purpose |
|------|---------|
| `ApiResponse<T>` | Standard API response |
| `PaginatedResponse<T>` | List with pagination |
| `ApiError` | Error response |

### Expected Outcome
- Global types defined
- Utility types available

### Verification Checklist
- [ ] types/ directory created
- [ ] index.d.ts created
- [ ] Utility types defined
- [ ] No TypeScript errors

---

## Task 29: Create types/env.d.ts

### Overview
Create type declarations for environment variables used in the application.

### Dependencies
- Task 23: Create tsconfig.json

### Instructions

1. **Create env.d.ts**
   - Create types/env.d.ts

2. **Extend ProcessEnv**
   - Declare public environment variables
   - Declare server-only variables

3. **Group by category**
   - API URLs
   - Authentication
   - Feature flags

### File Location

```
frontend/types/
├── index.d.ts
└── env.d.ts
```

### ProcessEnv Extension

```typescript
declare namespace NodeJS {
  interface ProcessEnv {
    // Next.js
    NEXT_PUBLIC_API_URL: string;
    NEXT_PUBLIC_APP_URL: string;
    // ... more variables
  }
}
```

### Public Variables (NEXT_PUBLIC_)

| Variable | Type | Purpose |
|----------|------|---------|
| `NEXT_PUBLIC_API_URL` | string | Backend API base URL |
| `NEXT_PUBLIC_APP_URL` | string | Frontend app URL |
| `NEXT_PUBLIC_TENANT_ID` | string | Current tenant ID |

### Server-Only Variables

| Variable | Type | Purpose |
|----------|------|---------|
| `API_SECRET` | string | API authentication |
| `DATABASE_URL` | string | Database (if SSR) |

### Feature Flags

| Variable | Type | Purpose |
|----------|------|---------|
| `NEXT_PUBLIC_ENABLE_AI` | string | AI features toggle |
| `NEXT_PUBLIC_DEMO_MODE` | string | Demo mode flag |

### Sri Lanka Specific

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_DEFAULT_CURRENCY` | LKR |
| `NEXT_PUBLIC_DEFAULT_TIMEZONE` | Asia/Colombo |

### Expected Outcome
- Environment types defined
- Type-safe env access

### Verification Checklist
- [ ] env.d.ts created
- [ ] ProcessEnv extended
- [ ] Public variables typed
- [ ] Server variables typed

---

## Task 30: Verify TypeScript Setup

### Overview
Verify the complete TypeScript configuration is working correctly.

### Dependencies
- Tasks 23-29: All TypeScript configuration

### Instructions

1. **Run type check**
   - Run `pnpm type-check`

2. **Verify imports**
   - Test path alias imports

3. **Check environment types**
   - Access process.env variables

4. **Run Next.js dev**
   - Verify no TypeScript errors

5. **Review generated files**
   - Check next-env.d.ts exists

### Verification Commands

| Command | Purpose |
|---------|---------|
| `pnpm exec tsc --noEmit` | Type check |
| `pnpm dev` | Dev server check |

### Type Check Expected Output

```
$ tsc --noEmit
(no output = success)
```

### Path Alias Verification

Test these imports work:
- `import {} from '@/components/...'`
- `import {} from '@/lib/...'`
- `import {} from '@/types/...'`

### Environment Variable Verification

Test process.env access:
- `process.env.NEXT_PUBLIC_API_URL`
- Type inference should work

### Generated Files Check

| File | Generated By |
|------|--------------|
| `next-env.d.ts` | Next.js |
| `.next/types/` | Next.js build |

### Common Issues

| Issue | Solution |
|-------|----------|
| Path alias errors | Check baseUrl and paths |
| Module not found | Verify moduleResolution |
| Type errors | Check strict settings |

### Expected Outcome
- No TypeScript errors
- All features working

### Verification Checklist
- [ ] `tsc --noEmit` passes
- [ ] Path aliases resolve
- [ ] Environment types work
- [ ] next-env.d.ts generated
- [ ] Dev server starts

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 25 | Configure Module Resolution | bundler resolution |
| 26 | Configure Path Aliases | @/* aliases |
| 27 | Configure Include/Exclude | File patterns |
| 28 | Create types/index.d.ts | Global types |
| 29 | Create types/env.d.ts | Env types |
| 30 | Verify TypeScript Setup | Validation |

### Files Created

```
frontend/
├── tsconfig.json        # Complete config
└── types/
    ├── index.d.ts       # Global types
    └── env.d.ts         # Env types
```

### Complete tsconfig.json Summary

| Section | Key Settings |
|---------|--------------|
| Compiler | strict, ES2022, bundler |
| Paths | @/* and component aliases |
| Include | *.ts, *.tsx, next-env.d.ts |
| Exclude | node_modules, .next |

### Git Commit Message
```
feat(frontend): configure TypeScript with strict mode

- Install TypeScript 5.x with type definitions
- Configure tsconfig.json with strict mode
- Set up path aliases for clean imports
- Create global type declarations
- Add environment variable types

SubPhase-03 Group C complete
```

### Next Steps
Proceed to [Group D](../Group-D_Tailwind-CSS-Setup/00_GROUP_OVERVIEW.md) for Tailwind CSS setup.

---

## Notes for AI Agents

1. **Path Aliases:** Must match in tsconfig.json
2. **bundler Resolution:** Correct for Next.js 14+
3. **Env Types:** Extend NodeJS.ProcessEnv
4. **Verification:** Run tsc --noEmit
5. **Git:** Commit after completing Group C
