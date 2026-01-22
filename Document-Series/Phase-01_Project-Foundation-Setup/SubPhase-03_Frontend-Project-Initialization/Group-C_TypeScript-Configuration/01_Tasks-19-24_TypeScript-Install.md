# Tasks 19-24: TypeScript Installation & Configuration

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 03 - Frontend Project Initialization  
> **Group:** C - TypeScript Configuration  
> **Document:** 01 of 02  
> **Tasks Covered:** 19, 20, 21, 22, 23, 24

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [../Group-B_NextJS-Project-Creation/02_Tasks-14-18_App-Router-Setup.md](../Group-B_NextJS-Project-Creation/02_Tasks-14-18_App-Router-Setup.md)
- **→ Next Document:** [02_Tasks-25-30_Module-Types.md](02_Tasks-25-30_Module-Types.md)

---

## Document Overview

This document covers installing TypeScript and type definitions, creating the tsconfig.json, and configuring compiler options.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 19 | Install TypeScript | Simple |
| 20 | Install @types/node | Simple |
| 21 | Install @types/react | Simple |
| 22 | Install @types/react-dom | Simple |
| 23 | Create tsconfig.json | Medium |
| 24 | Configure Compiler Options | Medium |

---

## Task 19: Install TypeScript

### Overview
Install TypeScript 5.x as a development dependency.

### Dependencies
- Task 09: Install Next.js (Group B)

### Instructions

1. **Install TypeScript**
   - Run `pnpm add -D typescript`

2. **Verify version**
   - Ensure version 5.x

3. **Note integration**
   - Next.js has built-in TypeScript support

### Package Information

| Package | Version | Type |
|---------|---------|------|
| `typescript` | >=5.0.0 | Dev Dependency |

### TypeScript 5.x Features

| Feature | Description |
|---------|-------------|
| Decorators | Native decorator support |
| const params | Const type parameters |
| Enums | Improved enum handling |
| Bundler resolution | Modern module resolution |

### Installation Command

```bash
pnpm add -D typescript@latest
```

### Next.js Integration

Next.js provides:
- Automatic tsconfig.json generation
- Built-in type checking
- next-env.d.ts generation

### Expected Outcome
- TypeScript 5.x installed
- Added to devDependencies

### Verification Checklist
- [ ] typescript in devDependencies
- [ ] Version 5.x confirmed
- [ ] `pnpm exec tsc --version` works

---

## Task 20: Install @types/node

### Overview
Install Node.js type definitions for server-side code and build scripts.

### Dependencies
- Task 19: Install TypeScript

### Instructions

1. **Install @types/node**
   - Run `pnpm add -D @types/node`

2. **Version matching**
   - Match Node.js 20.x types

### Package Information

| Package | Version | Type |
|---------|---------|------|
| `@types/node` | >=20.0.0 | Dev Dependency |

### Node.js Types Coverage

| Module | Coverage |
|--------|----------|
| `fs`, `path` | File system |
| `http`, `https` | HTTP modules |
| `process` | Process and environment |
| `buffer` | Buffer handling |

### Installation Command

```bash
pnpm add -D @types/node@20
```

### Expected Outcome
- Node.js types available
- Process.env typed

### Verification Checklist
- [ ] @types/node in devDependencies
- [ ] Version matches Node.js version

---

## Task 21: Install @types/react

### Overview
Install React type definitions for component typing.

### Dependencies
- Task 19: Install TypeScript

### Instructions

1. **Install @types/react**
   - Run `pnpm add -D @types/react`

2. **Version matching**
   - Match React 18.x

### Package Information

| Package | Version | Type |
|---------|---------|------|
| `@types/react` | >=18.2.0 | Dev Dependency |

### React Types Coverage

| Type | Purpose |
|------|---------|
| `React.FC` | Function components |
| `React.ReactNode` | Children type |
| `React.CSSProperties` | Style objects |
| `React.HTMLAttributes` | HTML props |

### Installation Command

```bash
pnpm add -D @types/react@18
```

### Expected Outcome
- React types available
- Component typing enabled

### Verification Checklist
- [ ] @types/react in devDependencies
- [ ] Version matches React version

---

## Task 22: Install @types/react-dom

### Overview
Install ReactDOM type definitions for DOM rendering and portals.

### Dependencies
- Task 19: Install TypeScript

### Instructions

1. **Install @types/react-dom**
   - Run `pnpm add -D @types/react-dom`

2. **Version matching**
   - Match React 18.x

### Package Information

| Package | Version | Type |
|---------|---------|------|
| `@types/react-dom` | >=18.2.0 | Dev Dependency |

### ReactDOM Types Coverage

| Type | Purpose |
|------|---------|
| `createPortal` | Portal rendering |
| `createRoot` | React 18 root |
| `hydrateRoot` | Server hydration |

### Installation Command

```bash
pnpm add -D @types/react-dom@18
```

### Combined Installation

Install all types at once:
```bash
pnpm add -D typescript @types/node@20 @types/react@18 @types/react-dom@18
```

### Expected Outcome
- ReactDOM types available
- Portal typing enabled

### Verification Checklist
- [ ] @types/react-dom in devDependencies
- [ ] Version matches React version

---

## Task 23: Create tsconfig.json

### Overview
Create the TypeScript configuration file with Next.js-compatible settings.

### Dependencies
- Task 19: Install TypeScript

### Instructions

1. **Create tsconfig.json**
   - Create in frontend root
   - Or run Next.js dev to auto-generate

2. **Set extends (optional)**
   - Extend from next.js config

3. **Configure compilerOptions**
   - Target and lib settings
   - Module settings

4. **Add include/exclude**
   - Include source files
   - Exclude node_modules

### File Location

```
frontend/
├── tsconfig.json
├── next.config.js
└── package.json
```

### Base Structure

| Section | Purpose |
|---------|---------|
| `compilerOptions` | TypeScript compiler settings |
| `include` | Files to compile |
| `exclude` | Files to ignore |

### Next.js Auto-Generation

Running `pnpm dev` generates:
- tsconfig.json (if missing)
- next-env.d.ts

### Recommended Approach

1. Let Next.js generate base config
2. Customize for project needs

### Expected Outcome
- tsconfig.json created
- Ready for compiler options

### Verification Checklist
- [ ] tsconfig.json exists
- [ ] Valid JSON format
- [ ] compilerOptions section present

---

## Task 24: Configure Compiler Options

### Overview
Configure TypeScript compiler options for strict type checking and modern JavaScript.

### Dependencies
- Task 23: Create tsconfig.json

### Instructions

1. **Enable strict mode**
   - Set strict: true
   - Enables all strict checks

2. **Configure target and lib**
   - Target: ES2022
   - Lib: dom, dom.iterable, esnext

3. **Configure module settings**
   - Module: esnext
   - ModuleResolution: bundler

4. **Configure JSX**
   - JSX: preserve (Next.js handles)

5. **Enable additional options**
   - skipLibCheck for performance
   - esModuleInterop for compatibility

### Compiler Options

**Type Checking:**
| Option | Value | Purpose |
|--------|-------|---------|
| `strict` | true | All strict checks |
| `noUncheckedIndexedAccess` | true | Safe array access |
| `noImplicitReturns` | true | Explicit returns |

**Target and Library:**
| Option | Value | Purpose |
|--------|-------|---------|
| `target` | ES2022 | Output target |
| `lib` | ["dom", "dom.iterable", "esnext"] | Available APIs |

**Module:**
| Option | Value | Purpose |
|--------|-------|---------|
| `module` | esnext | Module format |
| `moduleResolution` | bundler | Resolution strategy |

**JSX:**
| Option | Value | Purpose |
|--------|-------|---------|
| `jsx` | preserve | Let Next.js handle |

**Interop:**
| Option | Value | Purpose |
|--------|-------|---------|
| `esModuleInterop` | true | CommonJS compat |
| `allowSyntheticDefaultImports` | true | Import syntax |
| `forceConsistentCasingInFileNames` | true | Case sensitivity |

**Performance:**
| Option | Value | Purpose |
|--------|-------|---------|
| `skipLibCheck` | true | Faster builds |
| `incremental` | true | Faster rebuilds |

**Output:**
| Option | Value | Purpose |
|--------|-------|---------|
| `noEmit` | true | Next.js handles output |
| `isolatedModules` | true | Required for Next.js |

### Expected Outcome
- Strict type checking enabled
- Modern JavaScript target

### Verification Checklist
- [ ] strict enabled
- [ ] Target ES2022
- [ ] Module bundler resolution
- [ ] JSX preserve
- [ ] noEmit true

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 19 | Install TypeScript | TypeScript 5.x |
| 20 | Install @types/node | Node.js types |
| 21 | Install @types/react | React types |
| 22 | Install @types/react-dom | ReactDOM types |
| 23 | Create tsconfig.json | Config file |
| 24 | Configure Compiler Options | Strict mode |

### Dependencies Added

```json
{
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0"
  }
}
```

### tsconfig.json (Partial)

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "noEmit": true
  }
}
```

### Next Steps
Proceed to [02_Tasks-25-30_Module-Types.md](02_Tasks-25-30_Module-Types.md) for module resolution and type files.

---

## Notes for AI Agents

1. **Strict Mode:** Always enable for type safety
2. **bundler Resolution:** Correct for Next.js 14+
3. **noEmit:** Next.js handles compilation
4. **isolatedModules:** Required for Next.js
5. **Git:** Do NOT commit yet - complete all Group C tasks first
